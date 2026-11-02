import { parseFragment, serialize, type DefaultTreeAdapterTypes } from "parse5";

const allowedTags = new Set([
  "a",
  "b",
  "blockquote",
  "br",
  "em",
  "h2",
  "h3",
  "h4",
  "hr",
  "i",
  "li",
  "ol",
  "p",
  "strong",
  "u",
  "ul",
]);
const discardedTags = new Set(["iframe", "math", "object", "script", "style", "svg", "template"]);

function isSafeHref(value: string) {
  const href = value.trim().toLowerCase();
  return (
    (href.startsWith("/") && !href.startsWith("//")) ||
    href.startsWith("#") ||
    href.startsWith("https://") ||
    href.startsWith("http://") ||
    href.startsWith("mailto:")
  );
}

function sanitizeChildren(parent: DefaultTreeAdapterTypes.ParentNode) {
  for (let index = 0; index < parent.childNodes.length;) {
    const child = parent.childNodes[index];
    if (child.nodeName === "#text") {
      index += 1;
      continue;
    }
    if (child.nodeName === "#comment" || child.nodeName === "#documentType") {
      parent.childNodes.splice(index, 1);
      continue;
    }
    if (!("tagName" in child)) {
      parent.childNodes.splice(index, 1);
      continue;
    }

    const tag = child.tagName.toLowerCase();
    if (discardedTags.has(tag)) {
      parent.childNodes.splice(index, 1);
      continue;
    }

    sanitizeChildren(child);
    if (!allowedTags.has(tag)) {
      parent.childNodes.splice(index, 1, ...child.childNodes);
      continue;
    }

    const href =
      tag === "a"
        ? child.attrs.find((attribute) => attribute.name === "href")?.value
        : undefined;
    child.attrs = href && isSafeHref(href) ? [{ name: "href", value: href }] : [];
    index += 1;
  }
}

export function sanitizeRichText(value: string) {
  const fragment = parseFragment(value);
  sanitizeChildren(fragment);
  return serialize(fragment);
}
