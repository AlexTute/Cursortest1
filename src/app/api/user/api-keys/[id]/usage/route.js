import { NextResponse } from "next/server";
import { getAdminClient } from "../../../../../../../lib/supabaseAdmin";
import { authMiddleware } from "../../../../../../../src/lib/authMiddleware";

// POST /api/user/api-keys/[id]/usage - Increment usage count for the authenticated user's API key
export async function POST(request, { params }) {
  try {
    const { user, error } = await authMiddleware(request);
    if (error) return NextResponse.json({ error }, { status: 401 });

    const { id } = params;
    if (!id) return NextResponse.json({ error: "Missing API key ID" }, { status: 400 });

    const supabase = getAdminClient();

    // Increment usage_count
    const { data, error: dbError } = await supabase
      .rpc('increment_api_key_usage', { key_id: id, user_id_param: user.id })
      .select()
      .single();

    if (dbError) {
      console.error(`Error incrementing usage for API key ${id} for user ${user.id}:`, dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "API key not found or usage limit exceeded" }, { status: 404 });
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

    console.log(`API key usage incremented for user ${user.id}: ${data.name} (${data.id}). New count: ${data.usage_count}`);
    return NextResponse.json({ data: mapped });
  } catch (error) {
    console.error(`Unexpected error in POST /api/user/api-keys/${params.id}/usage:`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/user/api-keys/[id]/usage - Reset usage count for the authenticated user's API key
export async function DELETE(request, { params }) {
  try {
    const { user, error } = await authMiddleware(request);
    if (error) return NextResponse.json({ error }, { status: 401 });

    const { id } = params;
    if (!id) return NextResponse.json({ error: "Missing API key ID" }, { status: 400 });

    const supabase = getAdminClient();

    // Reset usage_count
    const { data, error: dbError } = await supabase
      .from("api_keys")
      .update({ usage_count: 0, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", user.id) // Ensure user owns the key
      .select()
      .single();

    if (dbError) {
      console.error(`Error resetting usage for API key ${id} for user ${user.id}:`, dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "API key not found or not owned by user" }, { status: 404 });
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

    console.log(`API key usage reset for user ${user.id}: ${data.name} (${data.id})`);
    return NextResponse.json({ data: mapped });
  } catch (error) {
    console.error(`Unexpected error in DELETE /api/user/api-keys/${params.id}/usage:`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}