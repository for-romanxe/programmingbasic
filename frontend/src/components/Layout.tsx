import type { HTMLAttributes, ReactNode } from "react";
import { UserColoredButtonRounded } from "../elements/UserButton";
export function Comment({ label }: { label: string }) {
  return <span className="comment">{label}</span>;
}
export function HorizontalFlex({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={`horizontal-flex ${className}`}>
      {children}
    </div>
  );
}
export function VerticalFlex({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={`vertical-flex ${className}`}>
      {children}
    </div>
  );
}
export function Grid({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={`menu-grid ${className}`}>
      {children}
    </div>
  );
}
export function Section({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={className} aria-label={label}>
      {children}
    </section>
  );
}
export function ColoredSection({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`colored-section ${className}`} aria-label={label}>
      {children}
    </section>
  );
}
export function TextCard({
  title,
  btnLabel,
  btnOnClick,
  disabled = false,
  selected = false,
  children,
}: {
  title: string;
  btnLabel: string;
  btnOnClick: () => void;
  disabled?: boolean;
  selected?: boolean;
  children?: ReactNode;
}) {
  return (
    <article className={`text-card ${selected ? "selected" : ""}`}>
      <h2>{title}</h2>
      {children}
      <UserColoredButtonRounded
        topRounded={false}
        bottomRounded
        onClick={btnOnClick}
        disabled={disabled}
        aria-pressed={selected}
        aria-label={`${title} ${btnLabel}`}
      >
        {btnLabel}
      </UserColoredButtonRounded>
    </article>
  );
}
export function NotFound({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="empty-state">
      <h1>{title}</h1>
      {children}
    </section>
  );
}
