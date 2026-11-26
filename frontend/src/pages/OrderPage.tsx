import { useState } from "react";
import { Bank, Clock, ForkKnife, Info } from "@phosphor-icons/react";
import { Navigate, useNavigate } from "react-router-dom";
import { OrderAPI } from "../api/order";
import { Message, PageTitle, Stepper } from "../components/Ui";
import { UserColoredButton } from "../elements/UserButton";
import { saveOrderStorage } from "../util/order-storage";
import { useOrderStore } from "../store/order";
import { timeLabel, won, type PaymentMethod } from "../util/types";

export function OrderPage() {
  const { cart, reservation } = useOrderStore();
  const [method, setMethod] = useState<PaymentMethod>(0);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  if (submitted) return <Navigate to="/check?payment=1" replace />;
  if (!cart.length) return <Navigate to="/cart" replace />;
  if (!reservation) return <Navigate to="/reservation" replace />;
  const total = cart.reduce((n, i) => n + i.menu.price * i.quantity, 0);
  const quantity = cart.reduce((n, i) => n + i.quantity, 0);
  async function submit() {
    if (pending || !reservation) return;
    setPending(true);
    setError("");
    try {
      const result = await OrderAPI.MakeOrder({
        menus: cart.map((i) => ({ id: i.menu.id, quantity: i.quantity })),
        reservation: reservation.id,
        paymentMethod:
          method === 0 ? { id: 0, body: { wantFailed: false } } : { id: 1 },
      });
      try {
        saveOrderStorage(result.passphrase, result.expiresAt);
      } catch {
        navigate("/", {
          state: {
            error: `주문은 접수됐지만 자동 조회 정보를 저장하지 못했어요. 조회 코드를 별도로 보관해 주세요: ${Object.values(result.passphrase).join(" ")}`,
          },
        });
        return;
      }
      setSubmitted(true);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "주문을 접수하지 못했어요.";
      setError(message);
      navigate("/", { state: { error: message }, replace: true });
    } finally {
      setPending(false);
    }
  }
  return (
    <div className="page">
      <PageTitle
        title="결제 수단 선택"
        description="주문 내용을 확인하고 결제 방법을 선택해 주세요."
        back="/reservation"
      />
      <Stepper current={2} />
      <section className="order-summary" aria-label="주문 내용">
        <div>
          <ForkKnife size={25} />
          <strong>메뉴 {quantity}개</strong>
          <b>{won(total)}</b>
        </div>
        <div>
          <Clock size={22} />
          <span>
            {new Date(reservation.startTime).toLocaleDateString("ko-KR", {
              month: "long",
              day: "numeric",
            })}{" "}
            · {timeLabel(reservation.startTime)} 방문
          </span>
        </div>
        <ul>
          {cart.map((i) => (
            <li key={i.menu.id}>
              <span>
                {i.menu.name} × {i.quantity}
              </span>
              <span>{won(i.menu.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
      </section>
      <div className="payment-list" role="group" aria-label="결제 수단">
        <button
          className={`payment-option ${method === 0 ? "selected" : ""}`}
          aria-pressed={method === 0}
          onClick={() => setMethod(0)}
          disabled={pending}
        >
          <span className="payment-icon">
            <Bank size={34} />
          </span>
          <span>
            <strong>무통장입금</strong>
            <small>계좌 안내를 확인하고 입금해요</small>
          </span>
          <i className="radio-mark">{method === 0 && <span />}</i>
        </button>
        <button
          className={`payment-option ${method === 1 ? "selected" : ""}`}
          aria-pressed={method === 1}
          onClick={() => setMethod(1)}
          disabled={pending}
        >
          <span className="bitcoin-icon" aria-hidden="true">
            ₿
          </span>
          <span>
            <strong>비트코인</strong>
            <small>BTC 입금 주소를 확인해요</small>
          </span>
          <i className="radio-mark">{method === 1 && <span />}</i>
        </button>
      </div>
      <p className="payment-notice">
        <Info size={18} />
        시연 주문만 저장되며 실제 결제는 진행되지 않아요.
      </p>
      {error && <Message error>{error}</Message>}
      <UserColoredButton
        className="step-action"
        onClick={submit}
        disabled={pending}
      >
        {pending ? "접수 중…" : "주문 접수하기"}
      </UserColoredButton>
    </div>
  );
}
