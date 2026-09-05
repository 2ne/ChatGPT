import { copyFileSync, existsSync } from "node:fs";
import path from "node:path";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const pagesBase = "/ChatGPT/treadmill-coach/";

function pagesFallbackPlugin(): Plugin {
  return {
    name: "github-pages-fallback",
    closeBundle() {
      const index = path.resolve(__dirname, "dist/index.html");
      const fallback = path.resolve(__dirname, "dist/404.html");
      if (existsSync(index)) copyFileSync(index, fallback);
    },
  };
}

function openaiSpeechPlugin(): Plugin {
  return {
    name: "openai-speech-dev-endpoint",
    configureServer(server) {
      server.middlewares.use("/api/speech", (req, res) => {
        void handleSpeechRequest(req, res);
      });
    },
  };
}

async function handleSpeechRequest(
  req: import("http").IncomingMessage,
  res: import("http").ServerResponse,
) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

    const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
  if (!apiKey) {
    res.statusCode = 503;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "OPENAI_API_KEY is not set on the local server",
        fallback: "browser",
      }),
    );
    return;
  }

  try {
    const body = await readJsonBody(req);
    const text = typeof body.text === "string" ? body.text.trim() : "";
    const instructions =
      typeof body.instructions === "string" ? body.instructions.trim() : "";

    if (!text) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Missing text" }));
      return;
    }

    const openaiResponse = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        voice: "ash",
        input: text,
        instructions:
          instructions ||
          "Speak like a focused running coach. Natural, confident and clear.",
        response_format: "mp3",
      }),
    });

    if (!openaiResponse.ok) {
      const detail = await openaiResponse.text();
      res.statusCode = openaiResponse.status;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "OpenAI speech failed", detail }));
      return;
    }

    const audio = Buffer.from(await openaiResponse.arrayBuffer());
    res.statusCode = 200;
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    res.end(audio);
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Speech request failed",
      }),
    );
  }
}

function readJsonBody(req: import("http").IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8") || "{}";
        resolve(JSON.parse(raw) as Record<string, unknown>);
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  if (env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY) {
    process.env.OPENAI_API_KEY = env.OPENAI_API_KEY;
  }

  return {
    base: pagesBase,
    plugins: [react(), tailwindcss(), openaiSpeechPlugin(), pagesFallbackPlugin()],
    server: {
      host: "0.0.0.0",
    },
    preview: {
      host: "0.0.0.0",
    },
  };
});
