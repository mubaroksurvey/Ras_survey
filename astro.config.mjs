import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";

const sourcePath = fileURLToPath(new URL("./src", import.meta.url));

const localAdminLoopbackPlugin = {
  name: "ras-local-admin-loopback",
  apply: "serve",
  configureServer(server) {
    server.middlewares.use((incoming, outgoing, next) => {
      const requestUrl = new URL(incoming.url ?? "/", `http://${incoming.headers.host ?? "localhost"}`);
      const isAdminPath =
        requestUrl.pathname === "/admin" ||
        requestUrl.pathname === "/admin/" ||
        requestUrl.pathname.startsWith("/admin/") ||
        requestUrl.pathname.startsWith("/__local-admin/");
      if (!isAdminPath) {
        next();
        return;
      }

      void (async () => {
        const headers = new Headers();
        for (const [name, value] of Object.entries(incoming.headers)) {
          if (value) headers.set(name, Array.isArray(value) ? value.join(", ") : value);
        }
        let body;
        if (incoming.method !== "GET" && incoming.method !== "HEAD") {
          const chunks = [];
          let size = 0;
          for await (const chunk of incoming) {
            size += chunk.length;
            if (size > 2 * 1024 * 1024) {
              outgoing.writeHead(413, { "Content-Type": "application/json; charset=utf-8" });
              outgoing.end(JSON.stringify({ error: "Ukuran data melebihi batas 2 MB." }));
              return;
            }
            chunks.push(chunk);
          }
          body = Buffer.concat(chunks);
        }
        const request = new Request(requestUrl, {
          method: incoming.method,
          headers,
          ...(body ? { body, duplex: "half" } : {}),
        });
        const { handleLocalAdminRequest } = await server.ssrLoadModule("/src/admin/localAdmin.ts");
        const result = await handleLocalAdminRequest(
          request,
          incoming.socket.remoteAddress ?? "",
        );
        if (!result) {
          next();
          return;
        }
        result.headers.forEach((value, name) => outgoing.setHeader(name, value));
        outgoing.writeHead(result.status, result.statusText);
        outgoing.end(Buffer.from(await result.arrayBuffer()));
      })().catch(next);
    });
  },
};

export default defineConfig({
  site: "https://www.rassurvey.com",
  output: "static",
  integrations: [react(), sitemap()],
  vite: {
    server: { host: "127.0.0.1" },
    plugins: [tailwind(), localAdminLoopbackPlugin],
    resolve: {
    alias: [
      { find: "@", replacement: sourcePath },
    ],
    },
  },
});
