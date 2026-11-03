import Image from "@/compat/LegacyImage";

interface ProductPosterProps {
  name: string;
  heading?: string;
  image: string;
  features?: string[];
  showFeatures?: boolean;
  imageId?: string;
  onImageError?: () => void;
}

export default function ProductPoster({
  name,
  heading,
  image,
  features = [],
  showFeatures = true,
  imageId,
  onImageError,
}: ProductPosterProps) {
  const shortFeatures = features.filter(Boolean).slice(0, 2);
  const posterTitle = heading || name;

  return (
    <div className="product-poster">
      <img className="product-poster-logo" src="/icon-no-bg.png" alt="" aria-hidden="true" />
      <div className="product-poster-copy">
        <h3>{posterTitle}</h3>
        {showFeatures && shortFeatures.length > 0 ? (
          <ul>
            {shortFeatures.map((feature) => (
              <li key={feature}>
                <span className="product-poster-check" aria-hidden="true" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <Image
        className="product-poster-image"
        src={image}
        alt={name}
        id={imageId}
        width={500}
        height={500}
        onError={onImageError}
      />
      <div className="product-poster-contact">
        <span>www.rassurvey.com</span>
        <span>WhatsApp 0812-9595-8196</span>
      </div>
    </div>
  );
}
