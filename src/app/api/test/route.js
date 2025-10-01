import { NextResponse } from "next/server";
import { getAdminClient } from "../../../lib/supabaseAdmin";

export async function GET() {
  try {
    console.log("Testing API route...");
    
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log("Supabase URL:", supabaseUrl ? "✅ Set" : "❌ Missing");
    console.log("Service Key:", supabaseServiceKey ? "✅ Set" : "❌ Missing");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ 
        error: "Missing environment variables",
        supabaseUrl: !!supabaseUrl,
        serviceKey: !!supabaseServiceKey
      }, { status: 500 });
    }
    
    // Test Supabase connection
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("api_keys")
      .select("count")
      .limit(1);
    
    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "API route working",
      supabaseConnected: true
    });
    
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error.message 
    }, { status: 500 });
  }
}
