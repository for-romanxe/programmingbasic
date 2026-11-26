import { NotFound } from "../components/Layout";
import { UserLink } from "../elements/UserButton";
export function NotFoundPage() {
  return (
    <div className="page">
      <NotFound title="페이지를 찾을 수 없어요.">
        <UserLink to="/">홈으로 돌아가기</UserLink>
      </NotFound>
    </div>
  );
}
