import { ko } from "../lang/ko";
import { useEffect, useRef, type ReactNode } from "react";
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  Check,
  X,
  ArrowRight,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { UserButton, UserColoredButtonRounded } from "../elements/UserButton";
import { useOrderStore } from "../store/order";
import { type MenuModel } from "../util/types";
import { UserImage, UserImageRounded } from "../elements/UserImage";
import universityLogo from "../assets/kyonggi-logo.svg";

export function Logo({ postLabel = ko.appName }: { postLabel?: string }) {
  return (
    <Link to="/" className="logo" aria-label="경슐랭 학생식당 홈">
      <UserImage
        className="logo__image"
        src={universityLogo}
        alt="경기대학교 로고"
      />
      <span>
        <strong>{postLabel}</strong>
      </span>
    </Link>
  );
}
export function Photo({
  photo,
  name,
  className = "",
}: {
  photo: MenuModel["photo"];
  name: string;
  className?: string;
}) {
  return (
    <UserImage
      src={photo ? `sprite:${photo}` : ""}
      alt={name}
      className={`food-photo ${className}`}
    />
  );
}

export function PageTitle({
  title,
  description,
  back = "/menu",
  extra,
}: {
  title: string;
  description?: string;
  back?: string;
  extra?: ReactNode;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    ref.current?.focus({ preventScroll: true });
  }, []);
  return (
    <div className="page-heading">
      <div className="heading-line">
        <Link to={back} className="icon-button" aria-label="이전 화면">
          <ArrowLeft size={24} />
        </Link>
        <h1 ref={ref} tabIndex={-1}>
          {title}
        </h1>
        {extra}
      </div>
      {description && <p>{description}</p>}
    </div>
  );
}
export function CartLink() {
  const quantity = useOrderStore((s) =>
    s.cart.reduce((n, i) => n + i.quantity, 0),
  );
  return (
    <Link
      to="/cart"
      className="icon-button cart-link"
      aria-label={`장바구니 ${quantity}개`}
    >
      <ShoppingCart size={27} />
      <span className="cart-badge">{quantity}</span>
    </Link>
  );
}
export function ImageCard({
  title,
  imgSrc,
  imgAlt,
  btnLabel,
  btnOnClick,
  description,
  tag,
  selected = false,
  priceLabel,
}: {
  priceLabel?: string;
  title: string;
  imgSrc: string;
  imgAlt: string;
  btnLabel: string;
  btnOnClick: () => void;
  description?: string;
  tag?: string;
  selected?: boolean;
}) {
  return (
    <article className="menu-card">
      <UserImageRounded
        src={imgSrc}
        alt={imgAlt}
        className="food-photo"
        topRounded
      />
      <div className="menu-card__body">
        <div className="menu-card__title">
          <h2>{title}</h2>
          {tag && <span className="menu-tag">{tag}</span>}
        </div>
        {description && <p>{description}</p>}
        <div className="menu-card__bottom">
          {priceLabel && <strong>{priceLabel}</strong>}
          <UserColoredButtonRounded
            topRounded={false}
            bottomRounded={false}
            onClick={btnOnClick}
            aria-label={`${title} 담기`}
            className={selected ? "added" : ""}
          >
            {selected ? <Check size={18} /> : <Plus size={18} />} {btnLabel}
          </UserColoredButtonRounded>
        </div>
      </div>
    </article>
  );
}
export function QuantityControl({
  id,
  quantity,
  name,
}: {
  id: number;
  quantity: number;
  name: string;
}) {
  const change = useOrderStore((s) => s.change);
  return (
    <div className="quantity-control">
      <button aria-label={`${name} 수량 줄이기`} onClick={() => change(id, -1)}>
        <Minus size={17} />
      </button>
      <span aria-live="polite">{quantity}</span>
      <button aria-label={`${name} 수량 늘리기`} onClick={() => change(id, 1)}>
        <Plus size={17} />
      </button>
    </div>
  );
}
export function Stepper({ current }: { current: number }) {
  return (
    <ol className="stepper" aria-label="주문 진행 단계">
      {["메뉴 선택", "방문 시간", "결제"].map((step, i) => (
        <li
          key={step}
          className={i <= current ? "active" : ""}
          aria-current={i === current ? "step" : undefined}
        >
          <span>{i < current ? <Check size={13} weight="bold" /> : i + 1}</span>
          {step}
          {i < 2 && <ArrowRight className="stepper-arrow" size={16} />}
        </li>
      ))}
    </ol>
  );
}
export function Message({
  children,
  error = false,
}: {
  children: ReactNode;
  error?: boolean;
}) {
  return (
    <p
      className={`message ${error ? "message--error" : ""}`}
      role={error ? "alert" : "status"}
    >
      {children}
    </p>
  );
}
export function EmptyState({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="empty-state">
      <ShoppingCart size={46} weight="light" />
      <h2>{title}</h2>
      {children}
    </div>
  );
}
export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = before;
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="modal"
      onCancel={onClose}
      aria-labelledby="payment-title"
    >
      <div className="modal__header">
        <h2 id="payment-title">{title}</h2>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="결제 안내 닫기"
        >
          <X size={24} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
