import React, { useEffect, createContext, useState, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import * as S from "./styles";
import Sidebar from "../Sidebar";
import { auth, db } from "firebaseConfig";
import { ROUTES } from "routes";
import BoxChat from "components/BoxChat";
import {
  collection,
  getDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { AppContext } from "Context/AppProvider";

export const UserLayoutContext = createContext();

const UserLayout = () => {
  const navigate = useNavigate();
  const { userInfo, rooms } = useContext(AppContext);

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
  const [selectedUserMessaging, setSelectedUserMessaging] = useState(null);
  const [curentRoom, setCurrentRoom] = useState(null);

  const [room, setRoom] = useState([]);
  useEffect(() => {
    if (selectedUserMessaging?.uid) {
      const room = rooms.filter(
        (item) =>
          item.members.includes(selectedUserMessaging.uid) &&
          item.category === "single"
      );
      if (room[0]) {
        setRoom(room);
      } else {
        setRoom([]);
      }
    }
  }, [selectedUserMessaging, rooms]);

  return (
    <UserLayoutContext.Provider
      value={{
        sidebarSelected,
        setSidebarSelected,
        isShowBoxChat,
        setIsShowBoxChat,
        selectedUserMessaging,
        setSelectedUserMessaging,
        room,
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
