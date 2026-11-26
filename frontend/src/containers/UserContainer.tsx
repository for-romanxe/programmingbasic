import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Info } from "@phosphor-icons/react";
import { Logo } from "../components/Ui";

export function UserContainer({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">
        본문 바로가기
      </a>
      <div className="demo-banner">
        <Info size={16} />
        화면 시연 · 실제 주문과 결제가 진행되지 않아요
      </div>
      <header className="site-header">
        <Logo />
        <nav aria-label="주요 메뉴">
          <NavLink to="/menu">메뉴 주문</NavLink>
          <NavLink to="/check">주문 조회</NavLink>
        </nav>
      </header>
      <main id="main">{children}</main>
      <footer className="site-footer">
        <span>경슐랭 학생식당</span>
        <span>미리 고르고, 여유롭게 식사하세요.</span>
      </footer>
    </>
  );
}
