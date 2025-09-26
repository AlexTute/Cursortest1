import { NextResponse } from "next/server";
import { getAdminClient } from "../../../../lib/supabaseAdmin";

export async function GET() {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("api_keys")
    .select("id,name,value,usage,created_at")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const mapped = (data || []).map((r) => ({
    id: r.id,
    name: r.name,
    key: r.value,
    usageLimit: r.usage,
    usageCount: 0, // Default since usage tracking not implemented yet
    createdAt: r.created_at,
    updatedAt: r.created_at, // Use created_at as fallback
  }));
  return NextResponse.json({ data: mapped });
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const usageLimit = typeof body.usageLimit === "number" ? body.usageLimit : Number(body.usageLimit);
  if (!name) {
    return NextResponse.json({ error: "'name' is required" }, { status: 400 });
  }
  const supabase = getAdminClient();
  const now = new Date().toISOString();
  const key =
    "key_" + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  const insert = {
    name,
    value: key,
    usage: Number.isFinite(usageLimit) ? Math.floor(usageLimit) : null,
    created_at: now,
  };
  const { data, error } = await supabase.from("api_keys").insert(insert).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const mapped = {
    id: data.id,
    name: data.name,
    key: data.value,
    usageLimit: data.usage,
    usageCount: 0,
    createdAt: data.created_at,
    updatedAt: data.created_at,
  };
  return NextResponse.json({ data: mapped }, { status: 201 });
}


