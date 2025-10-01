import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getAdminClient } from "./supabaseAdmin";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          console.log("Google sign in attempt for:", user.email);
          const supabase = getAdminClient();
          
          // Check if user already exists
          const { data: existingUser, error: fetchError } = await supabase
            .from("users")
            .select("id")
            .eq("email", user.email)
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') {
            console.error("Error checking existing user:", fetchError);
            return false;
          }

          if (!existingUser) {
            console.log("Creating new user for:", user.email);
            
            // Create new user in Supabase (let Supabase generate the UUID)
            const { data: newUser, error } = await supabase
              .from("users")
              .insert({
                email: user.email,
                name: user.name,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .select()
              .single();

            if (error) {
              console.error("Error creating user:", error);
              return false; // Prevent sign in if user creation fails
            }
            
            console.log("New user created successfully:", newUser);
          } else {
            console.log("User already exists:", existingUser.id);
          }
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false; // Prevent sign in if there's an error
        }
      }
      return true;
    },
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user?.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
export default NextAuth(authOptions);
