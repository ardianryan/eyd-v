/**
 * EYD V Serverless API for Cloudflare Workers
 * Edge deployment global
 */

import { checkEyd } from "../src/linter.js";
import { searchRules, getRuleById, checkSingleWord, lookupTechTerm, getTechTerms } from "../src/index.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (pathname === "/health" || pathname === "/") {
      return Response.json({ status: "ok", service: "eyd-v-worker", version: "5.2.1" }, { headers: corsHeaders });
    }

    if (pathname === "/api/check" && request.method === "POST") {
      try {
        const payload = await request.json();
        const text = payload.text || "";
        const options = {
          mode: payload.mode || "general",
          ignoreWords: payload.ignoreWords || [],
          preferredPronoun: payload.preferredPronoun || null
        };
        const result = checkEyd(text, options);
        return Response.json(result, { headers: corsHeaders });
      } catch (e) {
        return Response.json({ error: "Invalid JSON", message: e.message }, { status: 400, headers: corsHeaders });
      }
    }

    if (pathname === "/api/kata" && request.method === "GET") {
      const w = url.searchParams.get("w");
      if (!w) {
        return Response.json({ error: "Parameter w wajib diisi" }, { status: 400, headers: corsHeaders });
      }
      return Response.json(checkSingleWord(w), { headers: corsHeaders });
    }

    if (pathname === "/api/istilah" && request.method === "GET") {
      const q = url.searchParams.get("q");
      const terms = q ? lookupTechTerm(q) : getTechTerms();
      return Response.json({ query: q || "", total: terms.length, terms }, { headers: corsHeaders });
    }

    if (pathname === "/api/rules" && request.method === "GET") {
      const q = url.searchParams.get("q");
      if (q) {
        const results = searchRules(q, { limit: 10 });
        return Response.json({ query: q, results }, { headers: corsHeaders });
      }
      return Response.json({ message: "Gunakan parameter ?q=kata-kunci" }, { headers: corsHeaders });
    }

    return Response.json({ error: "Endpoint not found" }, { status: 404, headers: corsHeaders });
  }
};
