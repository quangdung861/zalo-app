import React, { useEffect, createContext, useState, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

import { auth } from "firebaseConfig";
import { ROUTES } from "routes";
import { AuthContext } from "Context/AuthProvider";
import Sidebar from "../Sidebar";
import BoxChatGroup from "components/BoxChatGroup";
import BoxChat from "components/BoxChat";
import * as S from "./styles";

export const UserLayoutContext = createContext();

const UserLayout = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 991 });
  const [sectionSelected, setSectionSelected] = useState("");
  const [sidebarSelected, setSidebarSelected] = useState("message");
  const [isShowBoxChat, setIsShowBoxChat] = useState(false);
  const [isShowBoxChatGroup, setIsShowBoxChatGroup] = useState(false);

  const {
    user: { uid },
  } = useContext(AuthContext);

  if (!uid) {
    navigate(ROUTES.LOGIN);
  }

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

  useEffect(() => {
    setSectionSelected((prev) => {
      if (isMobile && sectionSelected === "") return "";
      return prev || "friend-list";
    });
  }, [isMobile]);


  const [isShowSectionLeft, setIsShowSectionLeft] = useState(true);
  const [isShowSectionRight, setIsShowSectionRight] = useState(true);

  const handleComeBack = () => {
    setIsShowBoxChat(false);
    setIsShowSectionRight(false);
    setIsShowSectionLeft(true);
    setSectionSelected("");
  };

  return (
    <UserLayoutContext.Provider
      value={{
        sidebarSelected,
        setSidebarSelected,
        isShowBoxChat,
        setIsShowBoxChat,
        isShowBoxChatGroup,
        setIsShowBoxChatGroup,
        sectionSelected,
        setSectionSelected,
        isShowSectionLeft,
        setIsShowSectionLeft,
        isShowSectionRight,
        setIsShowSectionRight,
        handleComeBack,
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
