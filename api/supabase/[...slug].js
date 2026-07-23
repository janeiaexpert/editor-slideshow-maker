import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const TABLE = "carrosseis";

export default async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  // Extract the sub-path from [...slug]
  const slug = req.query.slug || [];
  const path = Array.isArray(slug) ? "/" + slug.join("/") : "/" + slug;
  const pathLower = path.toLowerCase();

  try {
    if (!supabase) throw new Error("Supabase not configured");

    if (req.method === "GET" && pathLower === "/list") {
      const { data, error } = await supabase.from(TABLE).select("id, name, cards, extra").order("id", { ascending: false });
      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === "GET" && pathLower.startsWith("/load/")) {
      const id = Number(path.replace("/load/", ""));
      const { data, error } = await supabase.from(TABLE).select("*").eq("id", id).single();
      if (error) throw error;
      return res.status(200).json({ cards: data.cards, extra: data.extra });
    }

    if (req.method === "POST" && pathLower === "/save") {
      const payload = { name: req.body?.name || "Carrossel", cards: req.body?.cards || [] };
      if (req.body?.extra) payload.extra = req.body.extra;
      try {
        const { data, error } = await supabase.from(TABLE).insert(payload).select("id").single();
        if (error) throw error;
        return res.status(200).json({ id: data.id });
      } catch {
        const { data, error } = await supabase.from(TABLE).insert({ name: req.body?.name || "Carrossel", cards: req.body?.cards || [] }).select("id").single();
        if (error) throw error;
        return res.status(200).json({ id: data.id });
      }
    }

    if (req.method === "PUT" && pathLower.startsWith("/update/")) {
      const id = Number(path.replace("/update/", ""));
      const payload = { cards: req.body?.cards || [] };
      if (req.body?.extra) payload.extra = req.body.extra;
      try {
        const { error } = await supabase.from(TABLE).update(payload).eq("id", id);
        if (error) throw error;
        return res.status(200).json({ ok: true });
      } catch {
        const { error } = await supabase.from(TABLE).update({ cards: req.body?.cards || [] }).eq("id", id);
        if (error) throw error;
        return res.status(200).json({ ok: true });
      }
    }

    if (req.method === "DELETE" && pathLower.startsWith("/delete/")) {
      const id = Number(path.replace("/delete/", ""));
      const { error } = await supabase.from(TABLE).delete().eq("id", id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    res.status(404).json({ error: "Route not found" });
  } catch (e) {
    console.error("[API]", e);
    res.status(500).json({ error: e.message });
  }
};
