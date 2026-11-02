import { defineMiddleware } from "astro:middleware";
import { parse, serialize } from "parse5";
import translations from "./data/translations.json";

const ignoredTags = new Set(["script", "style", "code", "pre", "svg", "noscript"]);

function isTranslatableAttribute(
  tagName: string | undefined,
  attribute: { name: string; value: string },
  attributes: Array<{ name: string; value: string }>,
) {
  if (["alt", "title", "placeholder", "aria-label", "aria-description"].includes(attribute.name)) {
    return true;
  }
  if (tagName !== "meta" || attribute.name !== "content") return false;
  const key = attributes.find((item) => item.name === "name" || item.name === "property")?.value;
  if (!key) return false;
  return new Set([
    "description",
    "keywords",
    "og:title",
    "og:description",
    "twitter:title",
    "twitter:description",
  ]).has(key);
}

function translateDocument(document: ReturnType<typeof parse>, route: string, origin: string) {
  function visit(node: Parameters<typeof serialize>[0], skipped = false) {
    const element = node as typeof node & {
      tagName?: string;
      nodeName?: string;
      value?: string;
      attrs?: Array<{ name: string; value: string }>;
      childNodes?: typeof node[];
      content?: typeof node;
    };
    const ignore = skipped || ignoredTags.has(element.tagName ?? "");

    if (!ignore && element.nodeName === "#text" && element.value) {
      const source = element.value.trim();
      const cachedTranslation = translations[source as keyof typeof translations];
      const translated =
        source === "Horizon" && cachedTranslation === "Horizons"
          ? source
          : cachedTranslation;
      if (translated) {
        const leading = element.value.match(/^\s*/)?.[0] ?? "";
        const trailing = element.value.match(/\s*$/)?.[0] ?? "";
        element.value = `${leading}${translated}${trailing}`;
      }
    }

    if (!ignore && element.attrs) {
      for (const attribute of element.attrs) {
        if (element.tagName === "html" && attribute.name === "lang") {
          attribute.value = "en";
        }

        if (isTranslatableAttribute(element.tagName, attribute, element.attrs)) {
          const translated = translations[attribute.value as keyof typeof translations];
          if (translated) attribute.value = translated;
        }

        if (element.tagName === "link") {
          const rel = element.attrs.find((item) => item.name === "rel")?.value;
          if (attribute.name === "href" && rel === "canonical") {
            attribute.value = `${origin}/en${route === "/" ? "/" : route}`;
          } else if (attribute.name === "href" && rel === "alternate") {
            const language = element.attrs.find((item) => item.name === "hreflang")?.value;
            const neutralRoute = route === "/404" ? "/" : route;
            if (language === "en") {
              attribute.value = `${origin}/en${neutralRoute === "/" ? "/" : neutralRoute}`;
            } else if (language === "id" || language === "x-default") {
              attribute.value = `${origin}${neutralRoute}`;
            }
          }
        }

        if (element.tagName === "meta" && attribute.name === "content") {
          const property = element.attrs.find((item) => item.name === "property")?.value;
          if (property === "og:url") {
            attribute.value = `${origin}/en${route === "/" ? "/" : route}`;
          }
        }

        if (element.tagName === "a" && attribute.name === "href") {
          const language = element.attrs.find(
            (item) => item.name === "data-language-switch",
          )?.value;
          if (language) {
            const neutralRoute = route === "/404" ? "/" : route;
            attribute.value =
              language === "en"
                ? `/en${neutralRoute === "/" ? "/" : neutralRoute}`
                : neutralRoute;
          } else if (attribute.value.startsWith("/") && !attribute.value.startsWith("//")) {
            const url = new URL(attribute.value, origin);
            if (!/^\/en(?:\/|$)/.test(url.pathname)) {
              attribute.value = `/en${url.pathname === "/" ? "/" : url.pathname}${url.search}${url.hash}`;
            }
          }
        }

        if (element.tagName === "form" && attribute.name === "action") {
          const action = new URL(attribute.value, origin);
          if (
            action.origin === origin &&
            action.pathname.startsWith("/") &&
            !/^\/en(?:\/|$)/.test(action.pathname)
          ) {
            attribute.value = `/en${action.pathname === "/" ? "/" : action.pathname}${action.search}`;
          }
        }
      }
    }

    for (const child of element.childNodes ?? []) visit(child, ignore);
    if (element.content) visit(element.content, ignore);
  }

  visit(document);
}

export const onRequest = defineMiddleware(async (context, next) => {
  const duplicateEnglishPrefix = context.url.pathname.match(/^\/en\/en(?=\/|$)(.*)$/);
  if (duplicateEnglishPrefix) {
    const correctedPath = duplicateEnglishPrefix[1] || "/";
    const target = new URL(
      `/en${correctedPath === "/" ? "/" : correctedPath}${context.url.search}`,
      context.url.origin,
    );
    return Response.redirect(target, 308);
  }

  if (!import.meta.env.DEV || !/^\/en(?:\/|$)/.test(context.url.pathname)) {
    return next();
  }

  const englishPath = context.url.pathname;
  const route = englishPath.replace(/^\/en(?=\/|$)/, "") || "/";
  const response = await next();
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) return response;

  const document = parse(await response.text());
  translateDocument(document, route, context.url.origin);
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(serialize(document), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
});
