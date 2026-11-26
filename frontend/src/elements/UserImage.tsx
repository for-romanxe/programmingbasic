import "./user-img.css";
import type { ImgHTMLAttributes } from "react";
import photoSheet from "../assets/menu-photos.png";
type Props = ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string };
export function UserImage({ src, alt, className = "", ...props }: Props) {
  if (src.startsWith("sprite:")) {
    const photo = src.slice(7);
    return (
      <span
        className={`food-photo food-photo--${photo} ${className}`}
        role="img"
        aria-label={alt}
        style={{ backgroundImage: `url(${photoSheet})`, ...props.style }}
      />
    );
  }
  return <img {...props} src={src} alt={alt} className={className} />;
}
export function UserImageRounded({
  topRounded = false,
  bottomRounded = false,
  style,
  ...props
}: Props & { topRounded?: boolean; bottomRounded?: boolean }) {
  return (
    <UserImage
      {...props}
      style={{
        borderTopLeftRadius: topRounded ? 12 : 0,
        borderTopRightRadius: topRounded ? 12 : 0,
        borderBottomLeftRadius: bottomRounded ? 12 : 0,
        borderBottomRightRadius: bottomRounded ? 12 : 0,
        ...style,
      }}
    />
  );
}
