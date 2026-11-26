import { ArrowRight, Plus, X } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import {
  EmptyState,
  PageTitle,
  QuantityControl,
  Stepper,
} from "../components/Ui";
import { UserImage } from "../elements/UserImage";
import { UserNav } from "../containers/UserNav";
import { UserLink, UserColoredLink } from "../elements/UserButton";
import { useOrderStore } from "../store/order";
import { won } from "../util/types";

export function CartPage() {
  const cart = useOrderStore((s) => s.cart);
  const remove = useOrderStore((s) => s.remove);
  const total = cart.reduce((n, i) => n + i.menu.price * i.quantity, 0);
  const quantity = cart.reduce((n, i) => n + i.quantity, 0);
  return (
    <div className="page">
      <PageTitle
        title="장바구니"
        description="담은 메뉴와 수량을 확인해 주세요."
      />
      <Stepper current={0} />
      {!cart.length ? (
        <EmptyState title="아직 담은 메뉴가 없어요">
          <p>오늘 먹고 싶은 메뉴를 골라 보세요.</p>
          <UserLink to="/menu" primary>
            메뉴 고르기
          </UserLink>
        </EmptyState>
      ) : (
        <>
          <div className="cart-list">
            {cart.map(({ menu, quantity }) => (
              <article key={menu.id} className="cart-item">
                <UserImage
                  src={menu.image.src}
                  alt={menu.image.alt}
                  className="food-photo"
                />
                <div className="cart-item__details">
                  <span className="store-label">{menu.section}</span>
                  <h2>{menu.name}</h2>
                  <strong>{won(menu.price)}</strong>
                </div>
                <button
                  className="icon-button cart-item__delete"
                  aria-label={`${menu.name} 삭제`}
                  onClick={() => remove(menu.id)}
                >
                  <X size={20} />
                </button>
                <QuantityControl
                  id={menu.id}
                  quantity={quantity}
                  name={menu.name}
                />
              </article>
            ))}
          </div>
          <Link className="text-link add-more" to="/menu">
            <Plus size={18} />
            메뉴 더 담기
          </Link>
          <div className="summary-row">
            <span>메뉴 {quantity}개 · 총 주문 금액</span>
            <strong>{won(total)}</strong>
          </div>
          <UserNav quantity={quantity} total={total}>
            <UserLink to="/menu">메뉴 선택</UserLink>
            <UserColoredLink to="/reservation">
              방문 시간 선택 <ArrowRight size={20} />
            </UserColoredLink>
          </UserNav>
        </>
      )}
    </div>
  );
}
