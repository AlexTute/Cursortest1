import { NextResponse } from "next/server";
import { getAdminClient } from "../../../../../../lib/supabaseAdmin";
import { authMiddleware } from "../../../../../../src/lib/authMiddleware";

// GET /api/user/api-keys/[id] - Get specific API key for the authenticated user
export async function GET(request, { params }) {
  try {
    const { user, error } = await authMiddleware(request);
    if (error) return NextResponse.json({ error }, { status: 401 });

    const { id } = params;
    if (!id) return NextResponse.json({ error: "Missing API key ID" }, { status: 400 });

    const supabase = getAdminClient();
    const { data, error: dbError } = await supabase
      .from("api_keys")
      .select("id,name,value,usage,usage_count,created_at,updated_at")
      .eq("id", id)
      .eq("user_id", user.id) // Ensure user owns the key
      .single();

    if (dbError) {
      console.error(`Error fetching API key ${id} for user ${user.id}:`, dbError);
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

    return NextResponse.json({ data: mapped });
  } catch (error) {
    console.error(`Unexpected error in GET /api/user/api-keys/${params.id}:`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/user/api-keys/[id] - Update specific API key for the authenticated user
export async function PATCH(request, { params }) {
  try {
    const { user, error } = await authMiddleware(request);
    if (error) return NextResponse.json({ error }, { status: 401 });

    const { id } = params;
    if (!id) return NextResponse.json({ error: "Missing API key ID" }, { status: 400 });

    const body = await request.json().catch(() => ({}));
    const name = typeof body.name === "string" ? body.name.trim() : undefined;
    const usageLimit = typeof body.usageLimit === "number" ? body.usageLimit : Number(body.usageLimit);

    // Validation
    if (name !== undefined) {
      if (!name) {
        return NextResponse.json({ error: "API key name cannot be empty" }, { status: 400 });
      }
      if (name.length < 2 || name.length > 50) {
        return NextResponse.json({ error: "API key name must be between 2 and 50 characters" }, { status: 400 });
      }
    }

    if (usageLimit && (usageLimit < 1 || usageLimit > 1000000)) {
      return NextResponse.json({ error: "Usage limit must be between 1 and 1,000,000" }, { status: 400 });
    }

    const supabase = getAdminClient();
    const updates = { updated_at: new Date().toISOString() };

    if (name !== undefined) updates.name = name;
    if (Number.isFinite(usageLimit) && usageLimit > 0) {
      updates.usage = Math.floor(usageLimit);
    } else if (usageLimit === 0 || usageLimit === null) {
      updates.usage = null;
    }

    const { data, error: dbError } = await supabase
      .from("api_keys")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id) // Ensure user owns the key
      .select()
      .single();

    if (dbError) {
      console.error(`Error updating API key ${id} for user ${user.id}:`, dbError);
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

    console.log(`API key updated for user ${user.id}: ${data.name} (${data.id})`);
    return NextResponse.json({ data: mapped });
  } catch (error) {
    console.error(`Unexpected error in PATCH /api/user/api-keys/${params.id}:`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/user/api-keys/[id] - Delete specific API key for the authenticated user
export async function DELETE(request, { params }) {
  try {
    const { user, error } = await authMiddleware(request);
    if (error) return NextResponse.json({ error }, { status: 401 });

    const { id } = params;
    if (!id) return NextResponse.json({ error: "Missing API key ID" }, { status: 400 });

    const supabase = getAdminClient();

    // First, get the key details for logging
    const { data: keyData } = await supabase
      .from("api_keys")
      .select("name")
      .eq("id", id)
      .eq("user_id", user.id) // Ensure user owns the key
      .single();

    const { data, error: dbError } = await supabase
      .from("api_keys")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id) // Ensure user owns the key
      .select()
      .single();

    if (dbError) {
      console.error(`Error deleting API key ${id} for user ${user.id}:`, dbError);
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

    console.log(`API key deleted for user ${user.id}: ${keyData?.name || 'Unknown'} (${id})`);
    return NextResponse.json({ data: mapped });
  } catch (error) {
    console.error(`Unexpected error in DELETE /api/user/api-keys/${params.id}:`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}