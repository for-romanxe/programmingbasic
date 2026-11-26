import { useEffect, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { MenuAPI } from "../api/menu";
import { CartLink, ImageCard, Message, PageTitle } from "../components/Ui";
import { Grid, ColoredSection } from "../components/Layout";
import { UserNav } from "../containers/UserNav";
import { UserLink } from "../elements/UserButton";
import { useOrderStore } from "../store/order";
import { won, type MenuModel, type SectionName } from "../util/types";

const sections: SectionName[] = ["만권화밥", "숑숑돈까스", "위델가"];
export function MenuPage() {
  const [selected, setSelected] = useState<SectionName>("만권화밥");
  const [menus, setMenus] = useState<MenuModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const cart = useOrderStore((s) => s.cart);
  const add = useOrderStore((s) => s.add);
  const quantity = cart.reduce((n, i) => n + i.quantity, 0);
  const total = cart.reduce((n, i) => n + i.menu.price * i.quantity, 0);
  useEffect(() => {
    let cancelled = false;
    MenuAPI.ReadAllMenus()
      .then((data) => {
        if (!cancelled) setMenus(data.flatMap((section) => section.list));
      })
      .catch(() => {
        if (!cancelled)
          setError(
            "메뉴를 불러오지 못했어요. 인터넷 연결과 서버 실행 상태를 확인해 주세요.",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return (
    <div className="page menu-page">
      <PageTitle
        title="메뉴 선택"
        description="오늘은 어떤 한 끼가 좋을까요?"
        back="/"
        extra={<CartLink />}
      />
      <div className="store-tabs" role="group" aria-label="매장 선택">
        {sections.map((section) => (
          <button
            key={section}
            aria-pressed={selected === section}
            className={selected === section ? "selected" : ""}
            onClick={() => setSelected(section)}
          >
            {section}
          </button>
        ))}
      </div>
      <div className="section-heading">
        <h2>{selected}</h2>
        <span>따뜻한 한 끼, 바로 준비해 드릴게요.</span>
      </div>
      {loading ? (
        <Message>메뉴를 불러오고 있어요.</Message>
      ) : error ? (
        <Message error>{error}</Message>
      ) : (
        <ColoredSection label={selected}>
          <Grid>
            {menus
              .filter((m) => m.section === selected)
              .map((menu) => (
                <ImageCard
                  key={menu.id}
                  title={menu.name}
                  imgSrc={menu.image.src}
                  imgAlt={menu.image.alt}
                  priceLabel={won(menu.price)}
                  description={menu.description}
                  tag={menu.tag}
                  btnLabel={
                    cart.find((i) => i.menu.id === menu.id)
                      ? `${cart.find((i) => i.menu.id === menu.id)!.quantity}개 담음 · 담기`
                      : "담기"
                  }
                  selected={cart.some((i) => i.menu.id === menu.id)}
                  btnOnClick={() => add(menu)}
                />
              ))}
          </Grid>
        </ColoredSection>
      )}
      <p className="quiet-note">메뉴·가격·매장별 배정은 시연용 예시입니다.</p>
      <UserNav quantity={quantity} total={total}>
        <UserLink to="/">홈으로</UserLink>
        <UserLink to="/cart" primary>
          장바구니 보기 <ArrowRight size={20} />
        </UserLink>
      </UserNav>
    </div>
  );
}
