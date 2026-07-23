import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
const TABLE = "carrosseis";

export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, "slug") || "";
  const method = getMethod(event);

  if (!supabase) throw createError({ statusCode: 500, message: "Supabase not configured" });

  if (method === "GET" && path === "list") {
    const { data, error } = await supabase.from(TABLE).select("id, name, cards, extra").order("id", { ascending: false });
    if (error) throw createError({ statusCode: 500, message: error.message });
    return data || [];
  }

  if (method === "GET" && path.startsWith("load/")) {
    const id = Number(path.replace("load/", ""));
    const { data, error } = await supabase.from(TABLE).select("*").eq("id", id).single();
    if (error) throw createError({ statusCode: 500, message: error.message });
    return { cards: data.cards, extra: data.extra };
  }

  if (method === "POST" && path === "save") {
    const body = await readBody(event);
    const payload: Record<string, unknown> = { name: body?.name || "Carrossel", cards: body?.cards || [] };
    if (body?.extra) payload.extra = body.extra;
    try {
      const { data, error } = await supabase.from(TABLE).insert(payload).select("id").single();
      if (error) throw error;
      return { id: data.id };
    } catch {
      const { data, error } = await supabase.from(TABLE).insert({ name: body?.name || "Carrossel", cards: body?.cards || [] }).select("id").single();
      if (error) throw createError({ statusCode: 500, message: error.message });
      return { id: data.id };
    }
  }

  if (method === "PUT" && path.startsWith("update/")) {
    const id = Number(path.replace("update/", ""));
    const body = await readBody(event);
    const payload: Record<string, unknown> = { cards: body?.cards || [] };
    if (body?.extra) payload.extra = body.extra;
    try {
      const { error } = await supabase.from(TABLE).update(payload).eq("id", id);
      if (error) throw error;
      return { ok: true };
    } catch {
      const { error } = await supabase.from(TABLE).update({ cards: body?.cards || [] }).eq("id", id);
      if (error) throw createError({ statusCode: 500, message: error.message });
      return { ok: true };
    }
  }

  if (method === "DELETE" && path.startsWith("delete/")) {
    const id = Number(path.replace("delete/", ""));
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) throw createError({ statusCode: 500, message: error.message });
    return { ok: true };
  }

  throw createError({ statusCode: 404, message: "Route not found" });
});
