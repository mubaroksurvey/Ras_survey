export function createProductPoster({
  heading,
  image,
  features = [],
  className = "",
  showFeatures = true,
} = {}) {
  const poster = document.createElement("div");
  poster.className = `product-poster ${className}`.trim();

  const logo = document.createElement("img");
  logo.className = "product-poster-logo";
  logo.src = "/icon-no-bg.png";
  logo.alt = "";

  const copy = document.createElement("div");
  copy.className = "product-poster-copy";
  const title = document.createElement("h3");
  title.className = "product-poster-heading";
  title.textContent = heading || "Nama produk";
  copy.append(title);

  const featureList = document.createElement("ul");
  featureList.className = "product-poster-features";
  if (showFeatures) {
    features.filter(Boolean).slice(0, 3).forEach((feature) => {
      const item = document.createElement("li");
      const check = document.createElement("span");
      check.className = "product-poster-check";
      check.setAttribute("aria-hidden", "true");
      const text = document.createElement("span");
      text.textContent = feature;
      item.append(check, text);
      featureList.append(item);
    });
  }
  if (featureList.childElementCount) copy.append(featureList);

  const productImage = document.createElement("img");
  productImage.className = "product-poster-image";
  productImage.alt = "";
  if (image) productImage.src = image;

  const contact = document.createElement("div");
  contact.className = "product-poster-contact";
  const domain = document.createElement("span");
  domain.textContent = "www.rassurvey.com";
  const whatsapp = document.createElement("span");
  whatsapp.textContent = "WhatsApp 0812-9595-8196";
  contact.append(domain, whatsapp);

  poster.append(logo, copy, productImage, contact);
  return poster;
}
