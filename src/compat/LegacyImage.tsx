import type { ImgHTMLAttributes } from "react";

type LegacyImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
  priority?: boolean;
  fill?: boolean;
  quality?: number;
  placeholder?: string;
  blurDataURL?: string;
  unoptimized?: boolean;
};

export default function LegacyImage({
  src,
  priority,
  fill,
  quality,
  placeholder,
  blurDataURL,
  unoptimized,
  loading,
  ...props
}: LegacyImageProps) {
  void fill;
  void quality;
  void placeholder;
  void blurDataURL;
  void unoptimized;

  return (
    <img
      {...props}
      src={src}
      loading={loading ?? (priority ? "eager" : "lazy")}
      fetchPriority={priority ? "high" : props.fetchPriority}
    />
  );
}
