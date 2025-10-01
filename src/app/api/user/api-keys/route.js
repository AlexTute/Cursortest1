import { NextResponse } from "next/server";
import { getAdminClient } from "../../../../../lib/supabaseAdmin";
import { authMiddleware } from "../../../../../src/lib/authMiddleware";
import { generateApiKey } from "../../../../../lib/apiKeyUtils";

// GET /api/user/api-keys - List all API keys for the authenticated user
export async function GET(request) {
  try {
    const { user, error } = await authMiddleware(request);
    if (error) return NextResponse.json({ error }, { status: 401 });

    const supabase = getAdminClient();
    const { data, error: dbError } = await supabase
      .from("api_keys")
      .select("id,name,value,usage,usage_count,created_at,updated_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (dbError) {
      console.error("Error fetching user API keys:", dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
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
    console.error("Unexpected error in GET /api/user/api-keys:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/user/api-keys - Create new API key for the authenticated user
export async function POST(request) {
  try {
    const { user, error } = await authMiddleware(request);
    if (error) return NextResponse.json({ error }, { status: 401 });

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

    const supabase = getAdminClient();

    // Check if user already has a key with this name
    const { data: existingKey } = await supabase
      .from("api_keys")
      .select("id")
      .eq("user_id", user.id)
      .eq("name", name)
      .single();

    if (existingKey) {
      return NextResponse.json({ error: "An API key with this name already exists" }, { status: 409 });
    }

    const now = new Date().toISOString();
    const key = generateApiKey();

    const insert = {
      user_id: user.id,
      name,
      value: key,
      usage: Number.isFinite(usageLimit) && usageLimit > 0 ? Math.floor(usageLimit) : null,
      usage_count: 0,
      created_at: now,
      updated_at: now,
    };

    const { data, error: dbError } = await supabase
      .from("api_keys")
      .insert(insert)
      .select()
      .single();

    if (dbError) {
      console.error("Error creating API key:", dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
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

    console.log(`API key created for user ${user.email}: ${data.name} (${data.id})`);
    return NextResponse.json({ data: mapped }, { status: 201 });

  } catch (error) {
    console.error("Unexpected error in POST /api/user/api-keys:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}