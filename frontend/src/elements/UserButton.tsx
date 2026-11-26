import "./user-btn.css";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";
export type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
  children?: ReactNode;
  variant?: "primary" | "secondary" | "quiet";
};
type Rounded = { topRounded?: boolean; bottomRounded?: boolean };
const roundedStyle = ({
  topRounded = false,
  bottomRounded = false,
}: Rounded) => ({
  borderTopLeftRadius: topRounded ? 12 : 0,
  borderTopRightRadius: topRounded ? 12 : 0,
  borderBottomLeftRadius: bottomRounded ? 12 : 0,
  borderBottomRightRadius: bottomRounded ? 12 : 0,
});
export function UserButton({
  label,
  children,
  variant = "secondary",
  className = "",
  ...props
}: Props) {
  return (
    <button className={`button button--${variant} ${className}`} {...props}>
      {children ?? label}
    </button>
  );
}
export function UserButtonRounded({
  topRounded,
  bottomRounded,
  style,
  ...props
}: Props & Rounded) {
  return (
    <UserButton
      {...props}
      style={{ ...roundedStyle({ topRounded, bottomRounded }), ...style }}
    />
  );
}
export function UserColoredButton(props: Props) {
  return <UserButton {...props} variant="primary" />;
}
export function UserColoredButtonRounded(props: Props & Rounded) {
  return <UserButtonRounded {...props} variant="primary" />;
}
type UserLinkProps = Omit<LinkProps, "children"> & {
  label?: string;
  children?: ReactNode;
  primary?: boolean;
};
export function UserLink({
  to,
  label,
  children,
  primary = false,
  className = "",
  ...props
}: UserLinkProps) {
  return (
    <Link
      {...props}
      className={`button button--${primary ? "primary" : "secondary"} ${className}`}
      to={to}
    >
      {children ?? label}
    </Link>
  );
}
export function UserLinkRounded({
  topRounded,
  bottomRounded,
  style,
  ...props
}: UserLinkProps & Rounded) {
  return (
    <UserLink
      {...props}
      style={{ ...roundedStyle({ topRounded, bottomRounded }), ...style }}
    />
  );
}
export function UserColoredLink(props: UserLinkProps) {
  return <UserLink {...props} primary />;
}
export function UserColoredLinkRounded(props: UserLinkProps & Rounded) {
  return <UserLinkRounded {...props} primary />;
}
