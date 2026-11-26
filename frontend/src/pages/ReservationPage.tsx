import { useEffect, useState } from "react";
import { ArrowRight, CalendarBlank } from "@phosphor-icons/react";
import { Navigate, useNavigate } from "react-router-dom";
import { ReservationAPI } from "../api/reservation";
import { Message, PageTitle, Stepper } from "../components/Ui";
import { ColoredSection, VerticalFlex, TextCard } from "../components/Layout";
import { UserColoredButton } from "../elements/UserButton";
import { useOrderStore } from "../store/order";
import { timeLabel, type ReservationTargetModel } from "../util/types";
export function ReservationPage() {
  const [slots, setSlots] = useState<ReservationTargetModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { cart, reservation, selectReservation } = useOrderStore();
  const navigate = useNavigate();
  useEffect(() => {
    let cancelled = false;
    ReservationAPI.ReadAllReservationTargets()
      .then((data) => {
        if (!cancelled) setSlots(data.list);
      })
      .catch(() => {
        if (!cancelled)
          setError(
            "방문 시간을 불러오지 못했어요. 인터넷 연결과 서버 실행 상태를 확인해 주세요.",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  if (!cart.length) return <Navigate to="/cart" replace />;
  const selected = slots.find(
    (s) => s.id === reservation?.id && s.remaining > 0,
  );
  return (
    <div className="page">
      <PageTitle
        title="방문 시간 선택"
        description="원하는 시간에 맞춰 식사를 준비할게요."
        back="/cart"
      />
      <Stepper current={1} />
      {loading ? (
        <Message>방문 가능한 시간을 확인하고 있어요.</Message>
      ) : error ? (
        <Message error>{error}</Message>
      ) : !slots.length ? (
        <Message>현재 예약 가능한 방문 시간이 없어요.</Message>
      ) : (
        <>
          <div className="date-heading">
            <CalendarBlank size={25} />
            <div>
              <span>예약 가능한 날짜</span>
              <strong>
                {new Date(slots[0].startTime).toLocaleDateString("ko-KR", {
                  month: "long",
                  day: "numeric",
                  weekday: "long",
                })}
              </strong>
            </div>
          </div>
          <ColoredSection label="방문 시간 선택">
            <VerticalFlex>
              {slots.map((slot) => (
                <TextCard
                  key={slot.id}
                  title={`${timeLabel(slot.startTime)} – ${timeLabel(slot.endTime)}`}
                  btnLabel={
                    slot.remaining
                      ? `${slot.remaining}건 남음${selected?.id === slot.id ? " · 선택됨" : ""}`
                      : "마감"
                  }
                  btnOnClick={() => selectReservation(slot)}
                  disabled={!slot.remaining}
                  selected={selected?.id === slot.id}
                >
                  <p>
                    {new Date(slot.startTime).toLocaleDateString("ko-KR", {
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </TextCard>
              ))}
            </VerticalFlex>
          </ColoredSection>
          <p className="quiet-note">
            좌석 지정 없이 방문 시간만 예약해요. 마감된 시간은 선택할 수 없어요.
          </p>
        </>
      )}
      <UserColoredButton
        className="step-action"
        disabled={!selected}
        onClick={() => navigate("/order")}
      >
        결제 수단 선택 <ArrowRight size={20} />
      </UserColoredButton>
    </div>
  );
}
