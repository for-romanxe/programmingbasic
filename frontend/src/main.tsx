import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { IconContext } from "@phosphor-icons/react";
import { UserContainer } from "./containers/UserContainer";
import { HomePage } from "./pages/HomePage";
import { MenuPage } from "./pages/MenuPage";
import { CartPage } from "./pages/CartPage";
import { ReservationPage } from "./pages/ReservationPage";
import { OrderPage } from "./pages/OrderPage";
import { CheckPage } from "./pages/CheckPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import "./style.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <IconContext.Provider value={{ weight: "regular" }}>
      <BrowserRouter>
        <UserContainer>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/reservation" element={<ReservationPage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/check" element={<CheckPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </UserContainer>
      </BrowserRouter>
    </IconContext.Provider>
  </StrictMode>,
);
