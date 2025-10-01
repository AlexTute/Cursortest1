import { NextResponse } from "next/server";
import { getAdminClient } from "../../../../../../lib/supabaseAdmin";

// Increment usage count for an API key
export async function POST(request, { params }) {
  try {
    const { id } = params;
    if (!id) return NextResponse.json({ error: "Missing API key ID" }, { status: 400 });

    const body = await request.json().catch(() => ({}));
    const increment = typeof body.increment === "number" ? body.increment : 1;
    
    if (increment < 1 || increment > 1000) {
      return NextResponse.json({ error: "Increment must be between 1 and 1000" }, { status: 400 });
    }

    const supabase = getAdminClient();
    
    // Get current usage count
    const { data: currentData, error: fetchError } = await supabase
      .from("api_keys")
      .select("usage_count, usage, name")
      .eq("id", id)
      .single();
      
    if (fetchError) {
      console.error("Error fetching API key for usage update:", fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }
    
    if (!currentData) return NextResponse.json({ error: "API key not found" }, { status: 404 });
    
    // Check if usage limit would be exceeded
    const newUsageCount = (currentData.usage_count || 0) + increment;
    if (currentData.usage && newUsageCount > currentData.usage) {
      return NextResponse.json({ 
        error: "Usage limit exceeded", 
        currentUsage: currentData.usage_count || 0,
        limit: currentData.usage,
        remaining: Math.max(0, currentData.usage - (currentData.usage_count || 0))
      }, { status: 429 });
    }
    
    // Update usage count
    const { data, error } = await supabase
      .from("api_keys")
      .update({ 
        usage_count: newUsageCount,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating API key usage:", error);
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
    
    console.log(`API key usage updated: ${data.name} (${id}) - ${increment} increment, total: ${newUsageCount}`);
    return NextResponse.json({ data: mapped });
    
  } catch (error) {
    console.error("Unexpected error in POST /api/keys/[id]/usage:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Reset usage count for an API key
export async function DELETE(_request, { params }) {
  try {
    const { id } = params;
    if (!id) return NextResponse.json({ error: "Missing API key ID" }, { status: 400 });

    const supabase = getAdminClient();
    
    const { data, error } = await supabase
      .from("api_keys")
      .update({ 
        usage_count: 0,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();
      
    if (error) {
      console.error("Error resetting API key usage:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (!data) return NextResponse.json({ error: "API key not found" }, { status: 404 });
    
    const mapped = {
      id: data.id,
      name: data.name,
      key: data.value,
      usageLimit: data.usage,
      usageCount: 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at || data.created_at,
    };
    
    console.log(`API key usage reset: ${data.name} (${id})`);
    return NextResponse.json({ data: mapped });
    
  } catch (error) {
    console.error("Unexpected error in DELETE /api/keys/[id]/usage:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
