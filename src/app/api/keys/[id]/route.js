import { NextResponse } from "next/server";
import { getAdminClient } from "../../../../../lib/supabaseAdmin";

export async function PATCH(request, { params }) {
  const { id } = params;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const body = await request.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim() : undefined;
  const usageLimit = typeof body.usageLimit === "number" ? body.usageLimit : Number(body.usageLimit);

  const supabase = getAdminClient();
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (Number.isFinite(usageLimit)) updates.usage = Math.floor(usageLimit);

  const { data, error } = await supabase
    .from("api_keys")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const mapped = {
    id: data.id,
    name: data.name,
    key: data.value,
    usageLimit: data.usage,
    usageCount: 0,
    createdAt: data.created_at,
    updatedAt: data.created_at,
  };
  return NextResponse.json({ data: mapped });
}

export async function DELETE(_request, { params }) {
  const { id } = params;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("api_keys")
    .delete()
    .eq("id", id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const mapped = {
    id: data.id,
    name: data.name,
    key: data.value,
    usageLimit: data.usage,
    usageCount: 0,
    createdAt: data.created_at,
    updatedAt: data.created_at,
  };
  return NextResponse.json({ data: mapped });
}


