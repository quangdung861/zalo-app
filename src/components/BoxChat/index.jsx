import React, { useContext, useState, useRef, useMemo, useEffect } from "react";
import * as S from "./styles";
import { UserLayoutContext } from "layouts/user/UserLayout";
import {
  collection,
  query,
  where,
  serverTimestamp,
  addDoc,
  onSnapshot,
  doc,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "firebaseConfig";
import { addDocument } from "services";
import { AppContext } from "Context/AppProvider";
import useFirestore from "hooks/useFirestore";

const BoxChat = () => {
  const { selectedUserMessaging, setSelectedUserMessaging, room } =
    useContext(UserLayoutContext);

  const { userInfo, rooms } = useContext(AppContext);

  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (value) => {
    setInputValue(value);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (inputValue) {
        if (room[0]) {
          const createMes = async () => {
            addDocument("messages", {
              category: "single",
              roomId: room[0].id,
              uid: userInfo.uid,
              displayName: userInfo.displayName,
              photoURL: userInfo.photoURL,
              text: inputValue,
              createdAt: serverTimestamp(),
            });
          };
          createMes();
        } else {
          const createRoomAndMes = async () => {
            try {
              const roomRef = await addDoc(collection(db, "rooms"), {
                category: "single",
                members: [userInfo.uid, selectedUserMessaging.uid],
                avatar: selectedUserMessaging.photoURL,
                name: selectedUserMessaging.displayName,
                createdAt: serverTimestamp(),
              });

              if (roomRef && roomRef.id) {
                const roomId = roomRef.id;
                console.log("Room ID:", roomId);
                addDocument("messages", {
                  category: "single",
                  roomId,
                  uid: userInfo.uid,
                  displayName: userInfo.displayName,
                  photoURL: userInfo.photoURL,
                  text: inputValue,
                  createdAt: serverTimestamp(),
                });
              } else {
                console.log("false");
              }
            } catch (error) {
              console.error("Error creating room:", error);
            }
          };

          createRoomAndMes();
        }
      }
    }
  };

  useEffect(() => {
    if (room[0]) {
      handleSnapShotMessage();
    }
  }, [room]);

  const [messages, setMessages] = useState([]);
  const handleSnapShotMessage = async () => {
    const messagesRef = query(
      collection(db, "messages"),
      where("roomId", "==", room[0].id),
      orderBy("createdAt", "asc")
    );
    onSnapshot(messagesRef, (docsSnap) => {
      const documents = docsSnap.docs.map((doc) => {
        const id = doc.id;
        const data = doc.data();
        return {
          ...data,
          id: id,
        };
      });
      setMessages(documents);
    });
  };

  const renderMessages = () => {
    return messages?.map((item) => {
      return (
        <div key={item.id} className="message-item">
          {item.uid === userInfo.uid ? (
            <div className="message-item__myself">
              <div className="text">{item.text}</div>
            </div>
          ) : (
            <div className="message-item__other">
              <img src={item.photoURL} alt="" className="avatar" />
              <div className="text">{item.text}</div>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <S.Wrapper>
      <S.Container>
        <div className="box-chat">
          <div className="box-chat__header">
            <div className="left">
              <img src={selectedUserMessaging.photoURL} alt="" />
              <div className="user-info">
                <div className="display-name">
                  {selectedUserMessaging.displayName}
                </div>

                <div className="last-time">
                  Truy cập 10 giờ trước<span className="new-seperator"></span>
                  <i className="fa-regular fa-bookmark"></i>
                </div>
              </div>
            </div>
            <div className="right" style={{ color: "#333" }}>
              <div className="box-icon">
                <i className="fa-solid fa-users"></i>
              </div>
              <div className="box-icon">
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
              <div className="box-icon">
                <i className="fa-solid fa-video"></i>
              </div>
              <div className="box-icon">
                <i className="fa-solid fa-chart-bar"></i>
              </div>
            </div>
          </div>
          <div className="box-chat__content">{renderMessages()}</div>
          <div className="box-chat__footer">
            <div className="toolbar-chat-input"></div>
            <div className="box-chat-input">
              <div className="box-chat-input__left">
                {/* Nhận content từ người dùng */}
                <input
                  className="input-message-text"
                  type="text"
                  placeholder="Nhập tin nhắn tới A Đinh Hộp Đen"
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e)}
                />
              </div>
              <div className="box-chat-input__right"></div>
            </div>
          </div>
        </div>
      </S.Container>
    </S.Wrapper>
  );
};

export default BoxChat;
