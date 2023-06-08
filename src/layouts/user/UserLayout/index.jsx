import React, { useEffect, createContext, useState, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import * as S from "./styles";
import Sidebar from "../Sidebar";
import { auth } from "firebaseConfig";
import { ROUTES } from "routes";
import BoxChat from "components/BoxChat";
import { AuthContext } from "Context/AuthProvider";

export const UserLayoutContext = createContext();

const UserLayout = () => {
  const navigate = useNavigate();
  const {
    user: { uid },
  } = useContext(AuthContext);
  console.log("🚀 ~ file: index.jsx:17 ~ UserLayout ~ uid:", uid);

  if (!uid) {
    navigate(ROUTES.LOGIN);
  }

  const [sidebarSelected, setSidebarSelected] = useState("message");
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

  const [isShowBoxChat, setIsShowBoxChat] = useState(false);

  return (
    <UserLayoutContext.Provider
      value={{
        sidebarSelected,
        setSidebarSelected,
        isShowBoxChat,
        setIsShowBoxChat,
      }}
    >
      <S.Wrapper>
        <S.Container>
          <Sidebar />
          <Outlet className="outlet" />
          {isShowBoxChat && <BoxChat className="box-chat" />}
        </S.Container>
      </S.Wrapper>
    </UserLayoutContext.Provider>
  );
};

export default UserLayout;
