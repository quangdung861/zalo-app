import React, { useContext, useState, useRef, useEffect } from "react";
import * as S from "./styles";
import {
  collection,
  query,
  where,
  serverTimestamp,
  addDoc,
  onSnapshot,
  doc,
  orderBy,
  getDoc,
  setDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "firebaseConfig";
import { addDocument } from "services";
import { AppContext } from "Context/AppProvider";
import moment from "moment";
import messageSend from "assets/audio/messageSend.wav";
import data from "@emoji-mart/data/sets/14/facebook.json";
import Picker from "@emoji-mart/react";
import AvatarGroup from "components/AvatarGroup";
import UserManual from "components/UserManual";
import ModalAccountGroup from "components/ModalAccoutGroup";
import { UserLayoutContext } from "layouts/user/UserLayout";

const BoxChatGroup = () => {
  const { userInfo, room, selectedGroupMessaging, setSelectedGroupMessaging } =
    useContext(AppContext);

  const { setIsShowBoxChatGroup } = useContext(UserLayoutContext);

  const inputRef = useRef();
  const boxChatRef = useRef();

  const [inputValue, setInputValue] = useState("");

  const audio = new Audio(messageSend);

  useEffect(() => {
    if (inputRef) {
      inputRef.current.focus();
    }
  }, [room.id]);

  useEffect(() => {
    if (room.id) {
      const messagesViewedIndex = room.messagesViewed.findIndex(
        (item) => item.uid === userInfo.uid
      );
      const messagesViewed = room.messagesViewed.find(
        (item) => item.uid === userInfo.uid
      );

      const newMessageViewed = [...room.messagesViewed];

      newMessageViewed.splice(messagesViewedIndex, 1, {
        ...messagesViewed,
        count: room.totalMessages,
      });

      const docRef = doc(db, "rooms", room.id);

      updateMessageViewed(docRef, newMessageViewed);
    }
  }, [room]);

  const updateMessageViewed = async (docRef, newMessageViewed) => {
    setDoc(
      docRef,
      {
        messagesViewed: newMessageViewed,
      },
      {
        merge: true,
      }
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (inputValue) {
        if (room.id) {
          audio.play();
          const createMes = async () => {
            const roomRef = doc(db, "rooms", room.id);

            const messagesViewedIndex = room.messagesViewed.findIndex(
              (item) => item.uid === userInfo.uid
            );
            const messagesViewed = room.messagesViewed.find(
              (item) => item.uid === userInfo.uid
            );

            const newMessageViewed = [...room.messagesViewed];

            newMessageViewed.splice(messagesViewedIndex, 1, {
              ...messagesViewed,
              count: messagesViewed.count + 1,
            });

            await setDoc(
              roomRef,
              {
                messageLastest: {
                  text: inputValue,
                  displayName: userInfo.displayName,
                  uid: userInfo.uid,
                  createdAt: serverTimestamp(),
                },
                totalMessages: room.totalMessages + 1,
                messagesViewed: newMessageViewed,
              },
              {
                merge: true,
              }
            );

            addDocument("messages", {
              category: "group",
              roomId: room.id,
              uid: userInfo.uid,
              displayName: userInfo.displayName,
              photoURL: userInfo.photoURL,
              text: inputValue,
            });
          };
          createMes();
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

  const [isShowOverlayModal, setIsShowOverlayModal] = useState(false);

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
    return () => setMessages([])
  }, [])

  useEffect(() => {
    let unSubcribe;
    if (room.id) {
      const handleSnapShotMessage = async () => {
        const messagesRef = query(
          collection(db, "messages"),
          where("roomId", "==", room.id),
          orderBy("createdAt", "asc")
        );
        unSubcribe = onSnapshot(messagesRef, (docsSnap) => {
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

    return () => unSubcribe && unSubcribe();
  }, [room.id]);

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
                  <div style={{ fontSize: "13px", color: "#7589A3" }}>
                    {item.displayName}
                  </div>
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

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerEmojiRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pickerEmojiRef.current &&
        !pickerEmojiRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  // Hàm xử lý sự kiện khi bấm nút hiển thị/ẩn bảng chọn emoji
  const handleToggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  // Hàm xử lý sự kiện khi chọn emoji từ bảng chọn
  const handleSelectEmoji = (emoji) => {
    setInputValue(inputValue + emoji.native);
  };

  const [categoryUser, setCategoryUser] = useState({});

  const [avatars, setAvatars] = useState();
  const [name, setName] = useState();

  useEffect(() => {
    if (room.id) {
      const fetchData = async () => {
        const partnerRef = query(
          collection(db, "users"),
          where("uid", "in", room.members)
        );
        const response = await getDocs(partnerRef);
        const documents = response.docs.map((doc) => {
          const id = doc.id;
          const data = doc.data();
          return {
            id: id,
            displayName: data.displayName,
            photoURL: data.photoURL,
          };
        });

        const avatars = documents.map((item) => item.photoURL);
        setAvatars(avatars);

        const name = documents.map((item) => item.displayName).join(", ");
        setName(name);
      };
      fetchData();
    }
  }, [userInfo, selectedGroupMessaging, room]);

  const handleComeBack = () => {
    setIsShowBoxChatGroup(false);
    setSelectedGroupMessaging({});
  };

  return (
    <S.Wrapper>
      <S.Container>
        <div className="box-chat">
          <div className="box-chat__header">
            <div className="left">
              <div className="btn-come-back" onClick={() => handleComeBack()}>
                <i className="fa-solid fa-chevron-left"></i>
              </div>
              <div
                className="avatar"
                onClick={() => setIsShowOverlayModal(true)}
              >
                {selectedGroupMessaging?.room?.avatar?.url ? (
                  <img src={selectedGroupMessaging?.room?.avatar?.url} alt="" />
                ) : (
                  <AvatarGroup
                    props={{
                      room: selectedGroupMessaging?.room,
                      avatars: avatars,
                    }}
                  />
                )}
              </div>

              <div className="user-info">
                <div className="display-name">
                  {selectedGroupMessaging?.room?.name
                    ? selectedGroupMessaging?.room?.name
                    : selectedGroupMessaging.name}
                </div>

                <div className="last-time">
                  <>
                    {/* <></>
                    <span className="new-seperator"></span> */}
                    <div style={{ color: "#7589A3" }}>Nhóm</div>
                  </>
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
              <div className="user-info__avatar">
                {selectedGroupMessaging?.room?.avatar.url ? (
                  <img src={selectedGroupMessaging?.room?.avatar?.url} alt="" />
                ) : (
                  <AvatarGroup
                    props={{
                      room: selectedGroupMessaging?.room,
                      avatars: avatars,
                    }}
                    styleBox={{
                      width: "100px",
                      height: "100px",
                    }}
                    styleIcon={{
                      width: "54px",
                      height: "54px",
                      fontSize: "24px",
                    }}
                  />
                )}
              </div>
              <div className="user-info__name">
                {selectedGroupMessaging?.room?.name
                  ? selectedGroupMessaging?.room?.name
                  : selectedGroupMessaging.name}
              </div>
              <div className="user-info__description">
                Bắt đầu chia sẽ những câu chuyện thú vị cùng nhau
              </div>
              <UserManual selectedGroupMessaging={selectedGroupMessaging} />
            </div>
            <div className="created-room">{renderCreatedAt()}</div>
            {renderMessages()}
          </div>
          <div className="box-chat__footer">
            <div className="toolbar-chat-input">
              <div className="emoji-mart" ref={pickerEmojiRef}>
                {showEmojiPicker && (
                  <Picker
                    data={data}
                    onEmojiSelect={handleSelectEmoji}
                    previewPosition="none"
                    emojiSize={22}
                    searchPosition="none"
                    locale="vi"
                    emojiButtonRadius="6px"
                    perLine={8}
                    set="facebook"
                  />
                )}
              </div>
              <div
                onClick={handleToggleEmojiPicker}
                className={
                  showEmojiPicker ? "box-icon box-icon--active" : "box-icon"
                }
              >
                <i className="fa-regular fa-face-laugh-beam"></i>
              </div>
            </div>
            <div className="box-chat-input">
              <div className="box-chat-input__left">
                {/* Nhận content từ người dùng */}
                <input
                  className="input-message-text"
                  type="text"
                  // style={{ textTransform: "capitalize" }}
                  placeholder={`Nhắn tin tới ${
                    room?.name || selectedGroupMessaging?.name
                  }`}
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
        {isShowOverlayModal && (
          <ModalAccountGroup
            setIsShowOverlayModal={setIsShowOverlayModal}
            accountSelected={{ ...selectedGroupMessaging, avatars, name }}
            isShowOverlayModal={isShowOverlayModal}
          />
        )}
      </S.Container>
    </S.Wrapper>
  );
};

export default BoxChatGroup;
