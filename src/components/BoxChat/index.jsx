import React, {
  useContext,
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback,
} from "react";
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
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "firebaseConfig";
import { addDocument } from "services";
import { AppContext } from "Context/AppProvider";
import { formatRelative } from "date-fns";
import moment from "moment";
import messageSend from "assets/audio/messageSend.wav";
import messageTouch from "assets/audio/messageTouch.wav";

const BoxChat = () => {
  const { userInfo, room, selectedUserMessaging, setRoom, rooms } =
    useContext(AppContext);
  console.log("🚀 ~ file: index.jsx:30 ~ BoxChat ~ room:", room);

  const inputRef = useRef();
  const boxChatRef = useRef();

  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (value) => {
    setInputValue(value);
    // const audio = new Audio(messageTouch);
    // audio.play();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (inputValue) {
        if (room.id) {
          const audio = new Audio(messageSend);
          audio.play();
          const createMes = async () => {
            const roomRef = doc(db, "rooms", room.id);
            await setDoc(
              roomRef,
              {
                messageLastest: {
                  text: inputValue,
                  displayName: userInfo.displayName,
                  uid: userInfo.uid,
                  createdAt: serverTimestamp(),
                },
              },
              {
                merge: true,
              }
            );

            addDocument("messages", {
              category: "single",
              roomId: room.id,
              uid: userInfo.uid,
              displayName: userInfo.displayName,
              photoURL: userInfo.photoURL,
              text: inputValue,
            });
          };
          createMes();
        } else {
          const createRoomAndMes = async () => {
            try {
              const roomRef = await addDoc(collection(db, "rooms"), {
                category: "single",
                members: [userInfo.uid, selectedUserMessaging.uidSelected],
                info: [
                  {
                    avatar: selectedUserMessaging.photoURLSelected,
                    name: selectedUserMessaging.displayNameSelected,
                    uid: selectedUserMessaging.uidSelected,
                  },
                  {
                    avatar: userInfo.photoURL,
                    name: userInfo.displayName,
                    uid: userInfo.uid,
                  },
                ],
                messageLastest: {
                  text: inputValue,
                  displayName: userInfo.displayName,
                  uid: userInfo.uid,
                  createdAt: serverTimestamp(),
                },
                createdAt: serverTimestamp(),
              });

              const response = await getDoc(roomRef);

              if (roomRef && roomRef.id) {
                setRoom({ id: response.id, ...response.data() });
                addDocument("messages", {
                  category: "single",
                  roomId: response.id,
                  uid: userInfo.uid,
                  displayName: userInfo.displayName,
                  photoURL: userInfo.photoURL,
                  text: inputValue,
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
      // focus to input again after submit

      setInputValue("");

      if (inputRef?.current) {
        setTimeout(() => {
          inputRef.current.focus();
        });
      }

      const chatWindow = boxChatRef?.current;
      setTimeout(() => {
        chatWindow.scrollTo({
          top: chatWindow.scrollHeight,
          behavior: "smooth",
        });
      }, 200);
    }
  };

  useEffect(() => {
    // focus to input again after submit
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current.focus();
      });
    }
  }, []);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (room.id) {
      const handleSnapShotMessage = async () => {
        const messagesRef = query(
          collection(db, "messages"),
          where("roomId", "==", room.id),
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
      handleSnapShotMessage();
    }
    const chatWindow = boxChatRef?.current;
    setTimeout(() => {
      chatWindow.scrollTo({
        top: chatWindow.scrollHeight,
        behavior: "auto",
      });
    }, 100);
  }, [room.id, rooms]);

  useEffect(() => {
    const chatWindow = boxChatRef?.current;
    setTimeout(() => {
      chatWindow.scrollTo({
        top: chatWindow.scrollHeight,
        behavior: "auto",
      });
    }, 100);
  }, [messages]);

  const renderMessages = () => {
    return messages?.map((item) => {
      const renderCreatedAtMessage = () => {
        if (item.createdAt) {
          let formattedDate = "";
          const now = moment(); // Lấy thời điểm hiện tại

          const date = moment(item.createdAt.toDate()); // Chuyển đổi timestamp thành đối tượng Moment.js

          if (date.isSame(now, "day")) {
            // Nếu timestamp là cùng ngày với hiện tại
            const formattedTime = date.format("HH:mm"); // Định dạng giờ theo "HH:mm"
            formattedDate = `${formattedTime} Hôm nay`;
          } else if (date.isSame(now.clone().subtract(1, "day"), "day")) {
            // Nếu timestamp là ngày hôm qua
            const formattedTime = date.format("HH:mm"); // Định dạng giờ theo "HH:mm"
            formattedDate = `${formattedTime} Hôm qua`;
          } else {
            // Trường hợp khác
            const formattedDateTime = date.format("HH:mm DD/MM/YYYY"); // Định dạng ngày và giờ theo "HH:mm DD/MM/YYYY"
            formattedDate = `${formattedDateTime} `;
          }

          return <div className="format-date-message"> {formattedDate} </div>;
        }
      };

      return (
        <div key={item.id} className="message-item">
          {item.uid === userInfo.uid ? (
            <div className="message-item__myself">
              <div className="box-image">
                <div className="text">
                  {item.text}
                  <div className="box-date">{renderCreatedAtMessage()}</div>
                </div>
                <img src={item.photoURL} alt="" className="avatar" />
              </div>
            </div>
          ) : (
            <div className="message-item__other">
              <div className="box-image">
                <img src={item.photoURL} alt="" className="avatar" />
                <div className="text">
                  {item.text}
                  <div className="box-date">{renderCreatedAtMessage()} </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  const renderCreatedAt = () => {
    if (room.createdAt) {
      let formattedDate = "";
      const now = moment(); // Lấy thời điểm hiện tại

      const date = moment(room.createdAt.toDate()); // Chuyển đổi timestamp thành đối tượng Moment.js

      if (date.isSame(now, "day")) {
        // Nếu timestamp là cùng ngày với hiện tại
        const formattedTime = date.format("HH:mm"); // Định dạng giờ theo "HH:mm"
        formattedDate = `${formattedTime} Hôm nay`;
      } else if (date.isSame(now.clone().subtract(1, "day"), "day")) {
        // Nếu timestamp là ngày hôm qua
        const formattedTime = date.format("HH:mm"); // Định dạng giờ theo "HH:mm"
        formattedDate = `${formattedTime} Hôm qua`;
      } else {
        // Trường hợp khác
        const formattedDateTime = date.format("HH:mm DD/MM/YYYY"); // Định dạng ngày và giờ theo "HH:mm DD/MM/YYYY"
        formattedDate = `${formattedDateTime} `;
      }

      return <div className="format-date"> {formattedDate} </div>;
    }
  };

  return (
    <S.Wrapper>
      <S.Container>
        <div className="box-chat">
          <div className="box-chat__header">
            <div className="left">
              <img src={selectedUserMessaging?.photoURLSelected} alt="" />
              <div className="user-info">
                <div className="display-name">
                  {selectedUserMessaging?.displayNameSelected}
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
          <div className="box-chat__content" ref={boxChatRef}>
            <div className="user-info">
              <img
                src={selectedUserMessaging.photoURLSelected}
                alt=""
                className="user-info__avatar"
              />
              <div className="user-info__name">
                {selectedUserMessaging.displayNameSelected}
              </div>
              {userInfo.friends.includes(selectedUserMessaging.uidSelected) ? (
                <div className="user-info__description">
                  {selectedUserMessaging.displayNameSelected} là bạn bè của bạn
                  trên Zalo
                </div>
              ) : (
                <div className="user-info__description">
                  {selectedUserMessaging.displayNameSelected} không phải bạn bè
                  của bạn trên Zalo
                </div>
              )}
            </div>
            <div className="created-room">{renderCreatedAt()}</div>
            {renderMessages()}
          </div>
          <div className="box-chat__footer">
            <div className="toolbar-chat-input"></div>
            <div className="box-chat-input">
              <div className="box-chat-input__left">
                {/* Nhận content từ người dùng */}
                <input
                  className="input-message-text"
                  type="text"
                  placeholder={`Nhắn tin tới ${selectedUserMessaging.displayNameSelected}`}
                  ref={inputRef}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e)}
                  value={inputValue}
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
