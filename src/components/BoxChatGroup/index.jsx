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
import { convertImagesToBase64 } from "utils/image";

const BoxChatGroup = () => {
  const { userInfo, room, selectedGroupMessaging, setSelectedGroupMessaging } =
    useContext(AppContext);
  const [inputValue, setInputValue] = useState("");

  const { setIsShowBoxChatGroup } = useContext(UserLayoutContext);
  const [infoUsers, setInfoUsers] = useState();
  const [messageSelected, setMessageSelected] = useState();
  const [isShowOverlayModalDetailImage, setIsShowOverlayModalDetailImage] =
    useState(false);
  const [isReplyMessage, setIsReplyMessage] = useState(false);
  const [infoReply, setInfoReply] = useState({});

  const inputRef = useRef();
  const imagesRef = useRef();
  const boxChatRef = useRef();
  const dropdownRef = useRef();

  const audio = new Audio(messageSend);

  const [isShowContainerImageList, setIsShowContainerImageList] =
    useState(true);
  const [isShowDropdownOption, setIsShowDropdownOption] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsShowDropdownOption(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const handleFocus = () => {
    const toolbarChatInputElement = document.querySelector(
      ".toolbar-chat-input"
    );
    Object.assign(toolbarChatInputElement.style, {
      borderBottom: "1px solid #0068FF",
    });
  };

  const handleBlur = () => {
    const toolbarChatInputElement = document.querySelector(
      ".toolbar-chat-input"
    );
    Object.assign(toolbarChatInputElement.style, {
      borderBottom: "1px solid var(--boder-dividing-color)",
    });
  };

  const handleKeyDown = (imageBase64FullInfo, e) => {
    if (e?.key === "Enter") {
      if (inputValue || imageBase64FullInfo[0]) {
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
                  text: inputValue || (imageBase64FullInfo && "Hình ảnh"),
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
              images: imageBase64FullInfo || [],
              infoReply: infoReply,
            });
          };
          createMes();
        }
      }
      // focus to input again after submit
      setIsReplyMessage(false);
      setInfoReply({});
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

  const handleClickSentMessage = () => {
    if (inputValue) {
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
              images: [],
              infoReply: infoReply,
            });
          };
          createMes();
        }
      }
      // focus to input again after submit
      setIsReplyMessage(false);
      setInfoReply({});
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

  const [isShowMessageError, setIsShowMessageError] = useState(false);

  const handleUploadImage = async (e) => {
    // Chuyển đổi đối tượng thành mảng đơn giản
    const files = Object.values(e.target.files);

    if (files) {
      const sumSize = files.reduce((total, file) => {
        return total + file.size;
      }, 0);
      if (sumSize >= 500000) {
        //500000 bytes (max size)
        setIsShowMessageError(true);
        setTimeout(function () {
          setIsShowMessageError(false);
        }, 3000);
        return;
      }
      const imageBase64FullInfo = await convertImagesToBase64(files);
      const e = {
        key: "Enter",
      };

      handleKeyDown(imageBase64FullInfo, e);
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
    return () => setMessages([]);
  }, []);

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

  useEffect(() => {
    if (messages[0]) {
      const allUser = messages.map((item) => item.uid);
      var uniqueArr = [...new Set(allUser)];

      const fetchData = async () => {
        const docRef = query(
          collection(db, "users"),
          where("uid", "in", uniqueArr)
        );
        const reponse = await getDocs(docRef);
        const documents = reponse.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
        setInfoUsers(documents);
      };
      fetchData();
    }
  }, [messages, userInfo]);

  const handleReplyMessage = ({ name, id, text, image }) => {
    setInfoReply({ name, id, text, image });
    setIsReplyMessage(true);
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current.focus();
      });
    }

    if (messages) {
      if (messages[messages.length - 1]?.id === id) {
        const chatWindow = boxChatRef?.current;
        setTimeout(() => {
          chatWindow.scrollTo({
            top: chatWindow.scrollHeight,
            behavior: "smooth",
          });
        }, 200);
      }
    }
  };

  const handleCopyText = (text) => {
    if (text) {
      navigator.clipboard
        .writeText(text)
        .then(() => true)
        .catch((err) => console.log("ERROR>>>", err));
    }
    setIsShowDropdownOption(false);
  };

  const renderMessages = () => {
    return messages?.map((item) => {
      const newInfoUser = infoUsers?.find(
        (infoUser) => infoUser.uid === item.uid
      );
      let CREATEDAT_URL;

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

          CREATEDAT_URL = formattedDate;

          return <div className="format-date-message"> {formattedDate} </div>;
        }
      };

      return (
        <div key={item.id} className="message-item">
          {item.uid === userInfo.uid ? (
            <div className="message-item__myself">
              <div className="container-options">
                <div className="myself-options">
                  <i
                    className="fa-solid fa-quote-right"
                    title="Trả lời"
                    onClick={() =>
                      handleReplyMessage({
                        name: newInfoUser.displayName,
                        id: item.id,
                        text: item.text,
                        image: item?.images[0] || null,
                      })
                    }
                  ></i>
                  <i className="fa-solid fa-share" title="Chia sẻ"></i>
                  <i
                    className="fa-solid fa-ellipsis"
                    title="Thêm"
                    onClick={() =>
                      setIsShowDropdownOption({
                        id: item.id,
                      })
                    }
                  ></i>
                </div>
                {isShowDropdownOption?.id === item.id && (
                  <div className="dropdown-menu" ref={dropdownRef}>
                    <div
                      className="menu-item"
                      onClick={() => handleCopyText(item.text)}
                    >
                      <i className="fa-regular fa-copy"></i>
                      Copy tin nhắn
                    </div>
                  </div>
                )}
              </div>
              <div className="box-image">
                <div className="text">
                  {item.images[0] &&
                    item.images.map((image, index) => {
                      return (
                        <img
                          key={index}
                          src={image.url}
                          alt=""
                          style={{ width: "100%", cursor: "pointer" }}
                          onClick={() => {
                            setMessageSelected({
                              ...newInfoUser,
                              URL: image.url,
                              CREATEDAT_URL,
                              MESSAGE_ID: item.id,
                              IMAGE_INDEX: index,
                            });
                            setIsShowOverlayModalDetailImage(true);
                          }}
                        />
                      );
                    })}
                  {item.infoReply?.id && (
                    <div className="reply-content">
                      <div className="reply-content__left"></div>
                      {item.infoReply?.image && (
                        <img
                          src={item.infoReply?.image?.url}
                          alt=""
                          className="image-reply"
                        />
                      )}
                      <div className="reply-content__right">
                        <div className="subcription">
                          <span className="name">
                            {item.infoReply?.name || userInfo.displayName}
                          </span>
                        </div>
                        <div className="content">
                          {item.infoReply.text || "[Hình ảnh]"}
                        </div>
                      </div>
                    </div>
                  )}
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
                  {item?.images[0] &&
                    item.images.map((image, index) => {
                      return (
                        <img
                          key={index}
                          src={image.url}
                          alt=""
                          style={{ width: "100%", cursor: "pointer" }}
                          onClick={() => {
                            setMessageSelected({
                              ...newInfoUser,
                              URL: image.url,
                              CREATEDAT_URL,
                              MESSAGE_ID: item.id,
                              IMAGE_INDEX: index,
                            });
                            setIsShowOverlayModalDetailImage(true);
                          }}
                        />
                      );
                    })}
                  {item.infoReply?.id && (
                    <div className="reply-content">
                      <div className="reply-content__left"></div>
                      {item.infoReply?.image && (
                        <img
                          src={item.infoReply?.image?.url}
                          alt=""
                          className="image-reply"
                        />
                      )}
                      <div className="reply-content__right">
                        <div className="subcription">
                          <span className="name">
                            {item.infoReply?.name || userInfo.displayName}
                          </span>
                        </div>
                        <div className="content">
                          {item.infoReply.text || "[Hình ảnh]"}
                        </div>
                      </div>
                    </div>
                  )}
                  {item.text}
                  <div className="box-date">{renderCreatedAtMessage()} </div>
                </div>
              </div>
              <div className="container-options">
                <div className="other-options">
                  <i
                    className="fa-solid fa-quote-right"
                    title="Trả lời"
                    onClick={() =>
                      handleReplyMessage({
                        name: newInfoUser.displayName,
                        id: item.id,
                        text: item.text,
                        image: item?.images[0] || null,
                      })
                    }
                  ></i>
                  <i className="fa-solid fa-share" title="Chia sẻ"></i>
                  <i
                    className="fa-solid fa-ellipsis"
                    title="Thêm"
                    onClick={() =>
                      setIsShowDropdownOption({
                        id: item.id,
                      })
                    }
                  ></i>
                </div>
                {isShowDropdownOption?.id === item.id && (
                  <div className="dropdown-menu" ref={dropdownRef}>
                    <div
                      className="menu-item"
                      onClick={() => handleCopyText(item.text)}
                    >
                      <i className="fa-regular fa-copy"></i>
                      Copy tin nhắn
                    </div>
                  </div>
                )}
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
        const documents = response.docs
          .map((doc) => {
            const id = doc.id;
            const data = doc.data();
            return {
              id: id,
              displayName: data.displayName,
              photoURL: data.photoURL,
            };
          })
          .reverse();

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

  const renderContainerImages = () => {
    return messages.map((item) => {
      const newInfoUser = infoUsers?.find(
        (infoUser) => infoUser.uid === item.uid
      );

      let CREATEDAT_URL;
      const getCreatedAtMessage = () => {
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

          return (CREATEDAT_URL = formattedDate);
        }
      };
      getCreatedAtMessage();

      return item.images.map((image, index) => {
        return (
          <img
            className="image-item"
            key={index}
            src={image.url}
            alt=""
            onClick={() =>
              setMessageSelected({
                ...newInfoUser,
                URL: image.url,
                CREATEDAT_URL: CREATEDAT_URL,
                MESSAGE_ID: item.id,
                IMAGE_INDEX: index,
              })
            }
            style={
              item.id === messageSelected.MESSAGE_ID &&
              index === messageSelected.IMAGE_INDEX
                ? {
                    minWidth: "100px",
                    minHeight: "100px",
                    filter: "none",
                    border: "2px solid #fff",
                    transition: "all .3s ease",
                  }
                : {}
            }
          />
        );
      });
    });
  };

  const [imageFormat, setImageFormat] = useState({
    rotate: 0,
    scale: 1,
  });

  useEffect(() => {
    setImageFormat({
      rotate: 0,
      scale: 1,
    });
  }, [messageSelected]);

  const downloadImage = () => {
    const randomNumber = Math.floor(Math.random() * 10000000000000);
    const base64Data = messageSelected?.URL; // Dữ liệu base64 của ảnh
    const link = document.createElement("a");
    link.href = `${base64Data}`;
    link.download = `photo-${randomNumber}`; // Tên file khi được lưu xuống máy
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <S.Wrapper>
      <S.Container isReplyMessage={isReplyMessage}>
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
              <div className="box-icon upload-image">
                <label htmlFor="uploadImage" style={{ cursor: "pointer" }}>
                  {" "}
                  <i className="fa-regular fa-image"></i>
                </label>
                <input
                  id="uploadImage"
                  type="file"
                  accept="image/*"
                  multiple={true}
                  style={{ display: "none" }}
                  onClick={(event) => (event.target.value = null)}
                  onChange={handleUploadImage}
                />
              </div>
            </div>
            {isReplyMessage && (
              <div className="reply-content">
                <div className="reply-content__left"></div>
                {infoReply?.image && (
                  <img
                    src={infoReply?.image?.url}
                    alt=""
                    className="image-reply"
                  />
                )}
                <div className="reply-content__right">
                  <div className="subcription">
                    <i className="fa-solid fa-quote-right"></i>
                    <span>Trả lời</span>
                    <span className="name">{infoReply?.name}</span>
                  </div>
                  <div className="content">
                    {infoReply.text || "[Hình ảnh]"}
                  </div>
                </div>
                <i
                  className="fa-solid fa-circle-xmark btn-close"
                  onClick={() => setIsReplyMessage(false)}
                ></i>
              </div>
            )}
            <div className="box-chat-input">
              <div className="box-chat-input__left">
                {/* Nhận content từ người dùng */}
                <input
                  className="input-message-text"
                  type="text"
                  // style={{ textTransform: "capitalize" }}
                  placeholder={`Nhắn tin tới ${
                    (room?.name &&
                      (room?.name?.length < 40
                        ? room?.name
                        : room?.name?.slice(0, 39) + "...")) ||
                    (selectedGroupMessaging?.name &&
                      (selectedGroupMessaging?.name.length < 40
                        ? selectedGroupMessaging?.name
                        : selectedGroupMessaging?.name?.slice(0, 39) + "..."))
                  }`}
                  ref={inputRef}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={(e) => handleKeyDown([], e)}
                  value={inputValue}
                  onFocus={() => handleFocus()}
                  onBlur={() => handleBlur()}
                />
              </div>
              <div className="box-chat-input__right">
                {inputValue.length > 0 && (
                  <div
                    className="btn-sent-message"
                    onClick={() => handleClickSentMessage()}
                  >
                    GỬI
                  </div>
                )}
              </div>
            </div>
          </div>
          {isShowMessageError && (
            <div
              className="message-error"
              style={{
                position: "absolute",
                top: "80px",
                left: "0px",
                right: "0px",
                margin: "0 auto",
                backgroundColor: "#fff",
                width: "320px",
                height: "40px",
                padding: "12px",
                borderRadius: "4px",
                boxShadow: "var(--box-shadow-default)",
                textAlign: "center",
                fontWeight: "500",
                zIndex: 999,
              }}
            >
              Hình ảnh phải có kích thước nhỏ hơn 0.5MB
            </div>
          )}
        </div>

        {isShowOverlayModal && (
          <ModalAccountGroup
            setIsShowOverlayModal={setIsShowOverlayModal}
            accountSelected={{ ...selectedGroupMessaging, avatars, name }}
            isShowOverlayModal={isShowOverlayModal}
          />
        )}

        {isShowOverlayModalDetailImage && (
          <div className="images-container">
            <div className="image-show__title">
              <div>Cloud của tôi</div>
              <i
                className="fa-solid fa-xmark"
                onClick={() => setIsShowOverlayModalDetailImage(false)}
              ></i>
            </div>
            <div className="image-show__center">
              <div className="main-image">
                <img
                  src={messageSelected?.URL}
                  alt=""
                  style={{
                    zIndex: 2,
                    position: "relative",
                    scale: `${imageFormat.scale}`,
                    rotate: `${imageFormat.rotate}deg`,
                  }}
                />
                <div
                  className="background-overlay"
                  style={{ position: "absolute", inset: "0 0 0 0", zIndex: 1 }}
                  onClick={() => {
                    setIsShowOverlayModalDetailImage(false);
                    setIsShowContainerImageList(true);
                  }}
                ></div>
              </div>

              {isShowContainerImageList && (
                <div className="container-image-list">
                  <div className="dividing">
                    <div className="dividing-line"></div>
                  </div>

                  <div className="images" ref={imagesRef}>
                    <div className="image-list__title"> </div>
                    {renderContainerImages()}
                  </div>
                </div>
              )}
            </div>
            <div className="image-show__bottom">
              <div className="image-show__bottom__sender">
                <img
                  className="image-show__bottom__sender__avatar"
                  src={messageSelected?.photoURL}
                  alt=""
                />
                <div className="image-show__bottom__sender__info">
                  <div className="sender-name">
                    {messageSelected.displayName}
                  </div>
                  <div className="createAt">
                    {messageSelected.CREATEDAT_URL}
                  </div>
                </div>
              </div>
              <div className="image-show__bottom__ctrl">
                <i className="fa-solid fa-share"></i>
                <i className="fa-solid fa-download" onClick={downloadImage}></i>
                <i
                  className="fa-solid fa-rotate-right fa-flip-horizontal"
                  onClick={() => {
                    imageFormat.scale <= 7 &&
                      setImageFormat((current) => ({
                        ...current,
                        rotate: current.rotate - 90,
                      }));
                  }}
                ></i>
                <i
                  className="fa-solid fa-rotate-right"
                  onClick={() => {
                    imageFormat.scale <= 7 &&
                      setImageFormat((current) => ({
                        ...current,
                        rotate: current.rotate + 90,
                      }));
                  }}
                ></i>
                <i
                  className="fa-solid fa-magnifying-glass-plus"
                  onClick={() => {
                    imageFormat.scale <= 7 &&
                      setImageFormat((current) => ({
                        ...current,
                        scale: current.scale + 0.25,
                      }));
                  }}
                ></i>
                <i
                  className="fa-solid fa-magnifying-glass-minus"
                  onClick={() => {
                    setImageFormat((current) => ({
                      ...current,
                      scale: 1,
                    }));
                  }}
                ></i>
              </div>
              <div className="image-show__bottom__slider-wrapper">
                <div>
                  <i className="fa-regular fa-thumbs-up"></i>
                </div>
                <i
                  className="fa-solid fa-expand"
                  onClick={() =>
                    setIsShowContainerImageList(!isShowContainerImageList)
                  }
                ></i>
              </div>
            </div>
          </div>
        )}
      </S.Container>
    </S.Wrapper>
  );
};

export default BoxChatGroup;
