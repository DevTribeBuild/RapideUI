import Image from 'next/image';
import { useState } from 'react';

function ImageWithFallback({
  src,
  alt,
  width,
  height,
  style,
  fallback,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  style?: React.CSSProperties;
  fallback: string;
}) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      style={style}
      onError={() => setImgSrc(fallback)}
    />
  );
}
export default ImageWithFallback;