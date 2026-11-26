import "./user-nav.css";
import type { ReactNode } from "react";
import { Comment } from "../components/Layout";
import { won } from "../util/types";
export function UserNav({
  children,
  label,
  quantity = 0,
  total = 0,
}: {
  children: ReactNode;
  label?: string;
  quantity?: number;
  total?: number;
}) {
  return (
    <nav className="nav bottom-bar" aria-label="주문 단계 이동">
      <div className="bottom-bar__summary nav__info">
        {label ? (
          <Comment label={label} />
        ) : (
          <>
            <span>
              선택한 메뉴 <b>{quantity}개</b>
            </span>
            <strong>{won(total)}</strong>
          </>
        )}
      </div>
      <div className="nav__actions">{children}</div>
    </nav>
  );
}
