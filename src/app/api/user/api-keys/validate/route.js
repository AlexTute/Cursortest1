import { NextResponse } from "next/server";
import { getAdminClient } from "../../../../../lib/supabaseAdmin";
import { authMiddleware } from "../../../../../src/lib/authMiddleware";

// POST /api/user/api-keys/validate - Validate an API key for the authenticated user
export async function POST(request) {
  try {
    const { user, error } = await authMiddleware(request);
    if (error) return NextResponse.json({ error }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const apiKey = typeof body.key === "string" ? body.key.trim() : "";

    if (!apiKey) {
      return NextResponse.json({ error: "API key is required for validation" }, { status: 400 });
    }

    const supabase = getAdminClient();
    const { data, error: dbError } = await supabase
      .from("api_keys")
      .select("id,name,value,usage,usage_count,created_at,updated_at")
      .eq("value", apiKey)
      .eq("user_id", user.id) // Ensure user owns the key
      .single();

    if (dbError) {
      console.error(`Error validating API key for user ${user.id}:`, dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ isValid: false, message: "API key not found or not owned by user" }, { status: 404 });
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

    return NextResponse.json({ isValid: true, data: mapped });
  } catch (error) {
    console.error("Unexpected error in POST /api/user/api-keys/validate:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}