import "./lib/error-capture";

import { createClient } from "@supabase/supabase-js";
import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { generateFromInsight, generateSingleCard, generateCalendar, generateCaptionCopy } from "./lib/ai";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => ((m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry)),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

// --- Supabase API handler ---

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
const TABLE = "carrosseis";

function parsePath(url: string): string {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

async function supabaseJson(status: number, data: unknown): Promise<Response> {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

async function handleSupabaseRequest(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
        "access-control-allow-headers": "Content-Type",
      },
    });
  }

  const path = parsePath(request.url).toLowerCase();

  try {
    if (!supabase) return supabaseJson(500, { error: "Supabase not configured" });

    if (request.method === "GET" && path === "/api/supabase/list") {
      const { data, error } = await supabase.from(TABLE).select("id, name, cards").order("id", { ascending: false });
      if (error) throw error;
      return supabaseJson(200, data || []);
    }

    if (request.method === "GET" && path.startsWith("/api/supabase/load/")) {
      const id = path.replace("/api/supabase/load/", "");
      const { data, error } = await supabase.from(TABLE).select("*").eq("id", id).maybeSingle();
      if (error) return supabaseJson(500, { error: error.message });
      if (!data) return supabaseJson(404, { error: "Carrossel não encontrado" });
      return supabaseJson(200, { cards: data.cards, extra: data.extra });
    }

    if (request.method === "POST" && path === "/api/supabase/save") {
      const body = await request.json().catch(() => ({}));
      const payload: Record<string, unknown> = { name: body.name || "Carrossel", cards: body.cards || [] };
      if (body.extra) payload.extra = body.extra;
      const { data, error } = await supabase.from(TABLE).insert(payload).select("id").single();
      if (error) throw error;
      return supabaseJson(200, { id: data.id });
    }

    if (request.method === "PUT" && path.startsWith("/api/supabase/update/")) {
      const id = path.replace("/api/supabase/update/", "");
      const body = await request.json().catch(() => ({}));
      const payload: Record<string, unknown> = { cards: body.cards || [] };
      if (body.extra) payload.extra = body.extra;
      const { error } = await supabase.from(TABLE).update(payload).eq("id", id);
      if (error) throw error;
      return supabaseJson(200, { ok: true });
    }

    if (request.method === "DELETE" && path.startsWith("/api/supabase/delete/")) {
      const id = path.replace("/api/supabase/delete/", "");
      const { error } = await supabase.from(TABLE).delete().eq("id", id);
      if (error) throw error;
      return supabaseJson(200, { ok: true });
    }

    return supabaseJson(404, { error: "Route not found" });
  } catch (e) {
    const message = e instanceof Error ? e.message : typeof e === "object" && e !== null ? JSON.stringify(e) : String(e);
    console.error("[API]", e);
    return supabaseJson(500, { error: message });
  }
}

// --- AI Generate handler ---

async function handleGenerate(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "POST, OPTIONS",
        "access-control-allow-headers": "Content-Type",
      },
    });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const insight = typeof body.insight === "string" ? body.insight.trim() : "";

    if (!insight) {
      return new Response(JSON.stringify({ error: "Insight é obrigatório" }), {
        status: 400,
        headers: { "content-type": "application/json; charset=utf-8" },
      });
    }

    const result = await generateFromInsight(insight, {
      goal: body.goal,
      tone: body.tone,
      brand: body.brand,
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[AI Generate]", e);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  }
}

function jsonResponse(status: number, data: unknown): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

async function handleGenerateCard(request: Request): Promise<Response> {
  if (request.method !== "POST") return jsonResponse(405, { error: "Method not allowed" });
  try {
    const body = await request.json().catch(() => ({}));
    const type = typeof body.type === "string" ? body.type : "";
    const topic = typeof body.topic === "string" ? body.topic.trim() : "";
    if (!type || !topic) return jsonResponse(400, { error: "Informe o tópico antes de gerar o card." });
    const card = await generateSingleCard({
      type: type as never,
      topic,
      goal: body.goal,
      tone: body.tone,
      context: typeof body.context === "string" ? body.context : undefined,
    });
    return jsonResponse(200, { card });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[AI Card]", e);
    return jsonResponse(500, { error: message });
  }
}

async function handleCalendar(request: Request): Promise<Response> {
  if (request.method !== "POST") return jsonResponse(405, { error: "Method not allowed" });
  try {
    const body = await request.json().catch(() => ({}));
    const documento = (body.documento || {}) as Record<string, string>;
    if (!documento.propostaDeValor || !documento.publicoAlvo) {
      return jsonResponse(400, { error: "Preencha Proposta de Valor e Público-Alvo no Documento Mestre." });
    }
    const itens = await generateCalendar({
      documento,
      dias: Number(body.dias) || 7,
      objetivo: typeof body.objetivo === "string" ? body.objetivo : "autoridade",
      postsPorDia: Number(body.postsPorDia) || 1,
      incluirStories: Boolean(body.incluirStories),
      dataInicial: typeof body.dataInicial === "string" ? body.dataInicial : new Date().toISOString().split("T")[0],
    });
    return jsonResponse(200, { itens });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[AI Calendar]", e);
    return jsonResponse(500, { error: message });
  }
}

async function handleCaption(request: Request): Promise<Response> {
  if (request.method !== "POST") return jsonResponse(405, { error: "Method not allowed" });
  try {
    const body = await request.json().catch(() => ({}));
    const topic = typeof body.topic === "string" ? body.topic.trim() : "";
    if (!topic) return jsonResponse(400, { error: "Informe o tópico antes de gerar a legenda." });
    const result = await generateCaptionCopy({
      topic,
      goal: body.goal,
      tone: body.tone,
      framework: body.framework,
      cards: Array.isArray(body.cards) ? body.cards : [],
    });
    return jsonResponse(200, result);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[AI Caption]", e);
    return jsonResponse(500, { error: message });
  }
}

// --- Main fetch handler ---

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const path = parsePath(request.url);

    if (path.startsWith("/api/supabase")) {
      return handleSupabaseRequest(request);
    }

    if (path === "/api/generate") {
      return handleGenerate(request);
    }

    if (path === "/api/generate-card") {
      return handleGenerateCard(request);
    }

    if (path === "/api/calendario") {
      return handleCalendar(request);
    }

    if (path === "/api/caption") {
      return handleCaption(request);
    }

    if (path.startsWith("/qr/")) {
      return handleQrImport(request);
    }

    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return brandedErrorResponse();
    }
  },
};

async function handleQrImport(request: Request): Promise<Response> {
  const path = parsePath(request.url);
  const id = path.replace("/qr/", "");

  if (!id || !supabase) {
    return qrResponse(qr404html(), 404);
  }

  try {
    const { data, error } = await supabase.from(TABLE).select("*").eq("id", id).maybeSingle();
    if (error || !data) {
      return qrResponse(qr404html(), 404);
    }
    const name = (data.extra?.name || data.name || "Carrossel").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const state = JSON.stringify({ state: { cards: data.cards || [], topic: data.extra?.topic || "", goal: data.extra?.goal || "authority", tone: data.extra?.tone || "direto", designPreset: data.extra?.designPreset || null, colorTheme: data.extra?.colorTheme || null, framework: data.extra?.framework || "aida", generatedCaption: data.extra?.generatedCaption || "", generatedCta: data.extra?.generatedCta || "", generatedHashtags: data.extra?.generatedHashtags || [], brand: data.extra?.brand || { logo: null, primaryColor: "#c2a25b", secondaryColor: "#ffffff", fontTitle: "Inter, sans-serif", fontBody: "Inter, sans-serif", applyByDefault: false }, highlight: data.extra?.highlight || { mode: "off", style: "bold" } } });
    return qrResponse(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${name}</title><style>body{background:#111;color:#fff;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:16px;text-align:center}div{max-width:400px}h1{font-size:20px;margin-bottom:8px;color:#c2a25b}p{font-size:14px;color:rgba(255,255,255,.7);margin-bottom:24px}button{background:#c2a25b;color:#111;border:none;border-radius:8px;padding:12px 32px;font-size:16px;font-weight:700;cursor:pointer}button:hover{opacity:.9}</style></head><body><div><h1>${name}</h1><p>Carregar este carrossel no seu dispositivo?</p><button id="b">Importar</button><div id="s" style="margin-top:16px;font-size:13px;color:rgba(255,255,255,.5)"></div></div><script>const d=${state};document.getElementById('b').addEventListener('click',async()=>{const b=document.getElementById('b');b.disabled=true;b.textContent='Importando...';try{localStorage.setItem('carrossel-store-v2',JSON.stringify(d));b.textContent='Importado!';setTimeout(()=>{window.location.href='/'},1500)}catch{document.getElementById('s').textContent='Erro.';b.disabled=false;b.textContent='Importar'}})<\/script></body></html>`);
  } catch {
    return qrResponse(qr404html(), 404);
  }
}

function qrResponse(html: string, status = 200): Response {
  return new Response(html, { status, headers: { "content-type": "text/html; charset=utf-8" } });
}

function qr404html(): string {
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Carrossel não encontrado</title><style>body{background:#111;color:#fff;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:16px;text-align:center}div{max-width:400px}h1{font-size:20px;color:rgba(255,255,255,.5)}</style></head><body><div><h1>Carrossel não encontrado</h1></div></body></html>`;
}
