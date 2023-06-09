import React, { useEffect, createContext, useState, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import * as S from "./styles";
import Sidebar from "../Sidebar";
import { auth } from "firebaseConfig";
import { ROUTES } from "routes";
import BoxChat from "components/BoxChat";
import { AuthContext } from "Context/AuthProvider";
import { TITLE_BAR } from "constants/public";
import BoxChatGroup from "components/BoxChatGroup";

export const UserLayoutContext = createContext();

const UserLayout = () => {
  const navigate = useNavigate();
  const {
    user: { uid },
  } = useContext(AuthContext);

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

  const [isShowBoxChatGroup, setIsShowBoxChatGroup] = useState(false);

  const [totalUnSeenMessage, setTotalUnseenMessage] = useState(0);

  const [sectionSelected, setSectionSelected] = useState("friend-list");

  useEffect(() => {
    if (window.location.hostname === "localhost") {
      if (totalUnSeenMessage >= 1) {
        if (totalUnSeenMessage > 99) {
          document.title = `(99+) ${TITLE_BAR.DEPLOY}`;
          return;
        }
        document.title = `(${totalUnSeenMessage}) ${TITLE_BAR.DEV}`;
      } else {
        document.title = TITLE_BAR.DEV;
      }
    } else {
      if (totalUnSeenMessage >= 1) {
        if (totalUnSeenMessage > 99) {
          document.title = `(99+) ${TITLE_BAR.DEPLOY}`;
          return;
        }
        document.title = `(${totalUnSeenMessage}) ${TITLE_BAR.DEPLOY}`;
      } else {
        document.title = TITLE_BAR.DEPLOY;
      }
    }
  }, [totalUnSeenMessage]);

  const [isShowSectionLeft, setIsShowSectionLeft] = useState(true);
  const [isShowSectionRight, setIsShowSectionRight] = useState(true);

  return (
    <UserLayoutContext.Provider
      value={{
        sidebarSelected,
        setSidebarSelected,
        isShowBoxChat,
        setIsShowBoxChat,
        totalUnSeenMessage,
        setTotalUnseenMessage,
        isShowBoxChatGroup,
        setIsShowBoxChatGroup,
        sectionSelected,
        setSectionSelected,
        isShowSectionLeft,
        setIsShowSectionLeft,
        isShowSectionRight,
        setIsShowSectionRight,
      }}
    >
      <S.Wrapper>
        <S.Container>
          <Sidebar />
          <Outlet className="outlet" />
          {isShowBoxChat && <BoxChat className="box-chat" />}
          {isShowBoxChatGroup && <BoxChatGroup className="box-chat" />}
        </S.Container>
      </S.Wrapper>
    </UserLayoutContext.Provider>
  );
};

export default UserLayout;
