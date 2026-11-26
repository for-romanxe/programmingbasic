import { Clock, ForkKnife, Receipt, ArrowRight } from "@phosphor-icons/react";
import {
  UserLink,
  UserLinkRounded,
  UserColoredLinkRounded,
} from "../elements/UserButton";
import { useLocation } from "react-router-dom";
import { UserNav } from "../containers/UserNav";
import { HorizontalFlex, Section } from "../components/Layout";
import { Photo, Message } from "../components/Ui";

export function HomePage() {
  const location = useLocation();
  const error =
    typeof location.state?.error === "string" ? location.state.error : "";
  return (
    <div className="home">
      {error && <Message error>{error}</Message>}
      <section className="home-hero">
        <div className="home-hero__copy">
          <span className="eyebrow">오늘의 한 끼를 미리</span>
          <h1>
            기다림 없이,
            <br />
            맛있는 한 끼.
          </h1>
          <p>
            메뉴는 지금 고르고,
            <br />
            식사는 여유롭게 즐기세요.
          </p>
          <HorizontalFlex className="home-links">
            <UserLinkRounded to="/check" topRounded bottomRounded>
              주문 확인
            </UserLinkRounded>
            <UserColoredLinkRounded to="/menu" topRounded bottomRounded>
              메뉴 둘러보기 <ArrowRight size={21} />
            </UserColoredLinkRounded>
          </HorizontalFlex>
          <div className="brand-stripes" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
        </div>
        <div className="home-hero__image">
          <Photo photo="cutlet" name="바삭한 수제 돈가스와 밥, 신선한 샐러드" />
          <div className="photo-caption">
            <ForkKnife size={20} />
            <span>든든하게, 맛있게. 오늘도 학생식당</span>
          </div>
        </div>
      </section>
      <Section className="home-details" label="학생식당 안내">
        <div>
          <Clock size={24} />
          <span>
            식사 운영 시간<strong>11:00 – 14:00</strong>
          </span>
        </div>
        <div>
          <ForkKnife size={24} />
          <span>
            원하는 시간에<strong>미리 주문하고 픽업</strong>
          </span>
        </div>
        <div>
          <Receipt size={24} />
          <span>
            로그인 없이 간편하게<strong>조회 코드로 주문 확인</strong>
          </span>
        </div>
      </Section>
      <UserNav label="로그인 없이 메뉴를 고르고 주문을 확인하세요.">
        <UserLink to="/check">주문 확인</UserLink>
        <UserLink to="/menu" primary>
          메뉴 선택
        </UserLink>
      </UserNav>
      <p className="quiet-note">메뉴와 운영 시간은 시연용 예시입니다.</p>
    </div>
  );
}
