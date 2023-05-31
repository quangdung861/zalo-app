import React, { useEffect, createContext, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import * as S from "./styles";
import Sidebar from "../Sidebar";
import { auth } from "firebaseConfig";
import { ROUTES } from "routes";

export const UserLayoutContext = createContext();

const UserLayout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribed = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate(ROUTES.LOGIN);
      }
    });
    return () => {
      unsubscribed();
    };
  }, []);

  const [sidebarSelected, setSidebarSelected] = useState("message");

  return (
    <UserLayoutContext.Provider value={{ sidebarSelected, setSidebarSelected }}>
      <S.Wrapper>
        <S.Container>
          <Sidebar />
          <Outlet className="outlet" />
        </S.Container>
      </S.Wrapper>
    </UserLayoutContext.Provider>
  );
};

export default UserLayout;
