import React from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  lazy?: boolean;
  className?: string;
  sources?: { srcSet: string; type: string }[];
}

/**
 * OptimizedImage
 * - Adds lazy loading
 * - Supports responsive srcSet via <picture>
 * - Optional WebP/AVIF sources
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  lazy = true,
  className,
  sources,
  ...rest
}) => {
  const img = (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={lazy ? 'lazy' : undefined}
      decoding={lazy ? 'async' : undefined}
      className={className}
      {...rest}
    />
  );

  if (!sources || sources.length === 0) return img;

  return (
    <picture>
      {sources.map((s, i) => (
        <source key={i} srcSet={s.srcSet} type={s.type} />
      ))}
      {img}
    </picture>
  );
};

export default OptimizedImage;

