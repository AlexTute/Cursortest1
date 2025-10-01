import { NextResponse } from "next/server";
import { getAdminClient } from "../../../lib/supabaseAdmin";
import { generateApiKey } from "../../../../lib/apiKeyUtils";
import { getServerSession } from "next-auth";
import auth from "../../../lib/auth";

export async function GET() {
  try {
    console.log("GET /api/keys - Starting...");
    
    // Get the current session
    const session = await getServerSession(auth);
    
    const supabase = getAdminClient();
    
    // Determine which user's keys to fetch
    let userId = "00000000-0000-0000-0000-000000000000"; // Default user
    if (session?.user?.email) {
      // If user is signed in, get their user ID from the database
      const { data: user } = await supabase
        .from("users")
        .select("id")
        .eq("email", session.user.email)
        .single();
      
      if (user) {
        userId = user.id;
        console.log("Fetching keys for authenticated user:", session.user.email, userId);
      } else {
        console.log("User not found in database, using default user");
      }
    } else {
      console.log("No session, using default user");
    }
    
    const { data, error } = await supabase
      .from("api_keys")
      .select("id,name,value,usage,usage_count,created_at,updated_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    console.log("Supabase query result:", { data, error });
    
    if (error) {
      console.error("Error fetching API keys:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    const mapped = (data || []).map((r) => ({
      id: r.id,
      name: r.name,
      key: r.value,
      usageLimit: r.usage,
      usageCount: r.usage_count || 0,
      createdAt: r.created_at,
      updatedAt: r.updated_at || r.created_at,
    }));
    
    return NextResponse.json({ data: mapped });
  } catch (error) {
    console.error("Unexpected error in GET /api/keys:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const usageLimit = typeof body.usageLimit === "number" ? body.usageLimit : Number(body.usageLimit);
    
    // Enhanced validation
    if (!name) {
      return NextResponse.json({ error: "API key name is required" }, { status: 400 });
    }
    
    if (name.length < 2) {
      return NextResponse.json({ error: "API key name must be at least 2 characters" }, { status: 400 });
    }
    
    if (name.length > 50) {
      return NextResponse.json({ error: "API key name must be less than 50 characters" }, { status: 400 });
    }
    
    if (usageLimit && (usageLimit < 1 || usageLimit > 1000000)) {
      return NextResponse.json({ error: "Usage limit must be between 1 and 1,000,000" }, { status: 400 });
    }
    
    // Get the current session
    const session = await getServerSession(auth);
    
    const supabase = getAdminClient();
    const now = new Date().toISOString();
    
    // Generate a more secure API key using utility function
    const key = generateApiKey();
    
    // Determine which user to create the key for
    let userId;
    if (session?.user?.email) {
      // If user is signed in, get their user ID from the database
      const { data: user } = await supabase
        .from("users")
        .select("id")
        .eq("email", session.user.email)
        .single();
      
      if (user) {
        userId = user.id;
        console.log("Creating key for authenticated user:", session.user.email, userId);
      } else {
        console.log("User not found in database, using default user");
        userId = "00000000-0000-0000-0000-000000000000";
      }
    } else {
      // No session, use default user
      const { data: defaultUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", "default@example.com")
        .single();

      if (defaultUser) {
        userId = defaultUser.id;
      } else {
        const { data: newUser, error: userError } = await supabase
          .from("users")
          .insert({
            id: "00000000-0000-0000-0000-000000000000",
            email: "default@example.com",
            name: "Default User",
            created_at: now,
            updated_at: now
          })
          .select()
          .single();
        
        if (userError) {
          console.error("Error creating default user:", userError);
          return NextResponse.json({ error: "Failed to create default user" }, { status: 500 });
        }
        userId = newUser.id;
      }
    }

    const insert = {
      user_id: userId,
      name,
      value: key,
      usage: Number.isFinite(usageLimit) && usageLimit > 0 ? Math.floor(usageLimit) : null,
      usage_count: 0,
      created_at: now,
      updated_at: now,
    };
    
    const { data, error } = await supabase.from("api_keys").insert(insert).select().single();
    
    if (error) {
      console.error("Error creating API key:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    const mapped = {
      id: data.id,
      name: data.name,
      key: data.value,
      usageLimit: data.usage,
      usageCount: data.usage_count || 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at || data.created_at,
    };
    
    console.log(`API key created: ${data.name} (${data.id})`);
    return NextResponse.json({ data: mapped }, { status: 201 });
    
  } catch (error) {
    console.error("Unexpected error in POST /api/keys:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


