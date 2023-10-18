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
import ModalSharingMessage from "components/ModalSharingMessage";

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
  const [isShowMessageError, setIsShowMessageError] = useState(false);
  const [isShowAlertRecallRejectMessage, setIsShowAlertRecallRejectMessage] =
    useState(false);
  const [
    isShowOverlayModalSharingMessage,
    setIsShowOverlayModalSharingMessage,
  ] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [isShowDropdownTagName, setIsShowDropdownTagName] = useState(false);
  const [usernames, setUsernames] = useState({});

  const inputRef = useRef();
  const imagesRef = useRef();
  const boxChatRef = useRef();
  const dropdownRef = useRef();
  const categoryRef = useRef();
  const dropdownTagnameRef = useRef();

  const audio = new Audio(messageSend);

  const [isShowContainerImageList, setIsShowContainerImageList] =
    useState(true);
  const [isShowDropdownOption, setIsShowDropdownOption] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsShowDropdownOption(false);
      }
      if (
        dropdownTagnameRef.current &&
        !dropdownTagnameRef.current.contains(event.target)
      ) {
        setIsShowDropdownTagName(false);
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

  const [categoryGroup, setCategoryGroup] = useState({});

  useEffect(() => {
    const infoGroup = userInfo.groups.find(
      (item) => item.id === selectedGroupMessaging?.room?.id
    );

    const categoryResult = userInfo.categoriesTemplate.find(
      (item) => item.name === infoGroup?.category
    );

    setCategoryGroup(categoryResult);
  }, [selectedGroupMessaging, userInfo]);

  const handleCategoryUser = async (value) => {
    const groupIndex = userInfo.groups.findIndex(
      (item) => item.id === selectedGroupMessaging.room.id
    );

    const newGroups = userInfo.groups;

    if (userInfo.groups[groupIndex].category === value) {
      newGroups.splice(groupIndex, 1, {
        id: selectedGroupMessaging.room.id,
        category: "",
      });

      const userInfoRef = doc(db, "users", userInfo.id);

      await setDoc(
        userInfoRef,
        {
          groups: newGroups,
        },
        {
          merge: true,
        }
      );
      return;
    }

    newGroups.splice(groupIndex, 1, {
      id: selectedGroupMessaging.room.id,
      category: value,
    });

    const userInfoRef = doc(db, "users", userInfo.id);

    await setDoc(
      userInfoRef,
      {
        groups: newGroups,
      },
      {
        merge: true,
      }
    );
    setCategoryDropdown(false);
  };

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

  const [infoMessageSharing, setInfoMessageSharing] = useState({});
  const handleSharingMessage = ({ infoMessage }) => {
    let text = infoMessage.text;
    infoUsers.forEach((member, index) => {
      const searchPattern = new RegExp(`@user:${member.uid}:user`, "g"); // Biểu thức chính quy với biến
      const replacement = `@${member.displayName}`;
      text = text.replace(searchPattern, replacement);
    });

    setInfoMessageSharing({
      ...infoMessage,
      text,
    });
    setIsShowOverlayModalSharingMessage(true);
  };

  const handleKeyDown = (imageBase64FullInfo, e) => {
    if (e?.key === "Enter") {
      if (!e?.isPreventDefault) {
        e.preventDefault();
      }
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

            const regex = /@user:([^:]+):user/g;
            const mentions = [];

            let mention;
            while ((mention = regex.exec(inputValue)) !== null) {
              mentions.push(mention[1]);
            }

            // Hợp nhất hai mảng và gộp các giá trị trùng nhau thành một

            await setDoc(
              roomRef,
              {
                messageLastest: {
                  text: displayedText || (imageBase64FullInfo && "Hình ảnh"),
                  displayName: userInfo.displayName,
                  uid: userInfo.uid,
                  createdAt: serverTimestamp(),
                },
                totalMessages: room.totalMessages + 1,
                messagesViewed: newMessageViewed,
                ...(room.mentioned && {
                  mentioned: [...new Set([...room.mentioned, ...mentions])],
                }),
                ...(!room.mentioned && {
                  mentioned: mentions,
                }),
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

            const regex = /@user:([^:]+):user/g;
            const mentions = [];

            let mention;
            while ((mention = regex.exec(inputValue)) !== null) {
              mentions.push(mention[1]);
            }

            await setDoc(
              roomRef,
              {
                messageLastest: {
                  text: displayedText,
                  displayName: userInfo.displayName,
                  uid: userInfo.uid,
                  createdAt: serverTimestamp(),
                },
                totalMessages: room.totalMessages + 1,
                messagesViewed: newMessageViewed,
                ...(room.mentioned && {
                  mentioned: [...new Set([...room.mentioned, ...mentions])],
                }),
                ...(!room.mentioned && {
                  mentioned: mentions,
                }),
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
        isPreventDefault: true,
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

  const [messageLength, setMessageLength] = useState(messages.length);

  useEffect(() => {
    if (messages.length !== messageLength) {
      const chatWindow = boxChatRef?.current;
      setTimeout(() => {
        chatWindow.scrollTo({
          top: chatWindow.scrollHeight,
          behavior: "auto",
        });
      }, 100);
      setMessageLength(messages.length);
    }
  }, [messages, messageLength]);

  useEffect(() => {
    if (messages[0]) {
      const allUser = messages.map((item) => item.uid);
      var uniqueArr = [...new Set([...allUser, ...room.members])];

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

        documents.forEach((member, index) => {
          setUsernames((cur) => ({ ...cur, [member.uid]: member.displayName }));
        });
      };
      fetchData();
    }
  }, [messages, userInfo]);

  const handleReplyMessage = ({ name, id, text, image }) => {
    let textResult = text;
    infoUsers.forEach((member, index) => {
      const searchPattern = new RegExp(`@user:${member.uid}:user`, "g"); // Biểu thức chính quy với biến
      const replacement = `@${member.displayName}`;
      textResult = textResult.replace(searchPattern, replacement);
    });

    setInfoReply({ name, id, text: textResult, image });
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
      let textResult = text;
      let arrName = selectedGroupMessaging.name.split(", ");
      selectedGroupMessaging.room.members.forEach((memberId, index) => {
        const searchPattern = new RegExp(`@user:${memberId}:user`, "g"); // Biểu thức chính quy với biến
        const replacement = `@${arrName[index]}`;
        textResult = textResult.replace(searchPattern, replacement);
      });

      navigator.clipboard
        .writeText(textResult)
        .then(() => true)
        .catch((err) => console.log("ERROR>>>", err));
    }
    setIsShowDropdownOption(false);
  };

  const handleRecallMessage = async ({ id, createdAt }) => {
    const now = moment();
    const date = moment(createdAt.toDate()); // Chuyển đổi timestamp thành đối tượng Moment.js

    const diffSeconds = now.diff(date, "seconds");
    if (diffSeconds < 30) {
      const messageRef = doc(db, "messages", id);
      setIsShowDropdownOption(false);

      await setDoc(
        messageRef,
        {
          isRecall: true,
        },
        {
          merge: true,
        }
      );
      setIsShowDropdownOption(false);
      return;
    }

    setIsShowDropdownOption(false);
    setIsShowAlertRecallRejectMessage(true);
    setTimeout(function () {
      setIsShowAlertRecallRejectMessage(false);
    }, 3000);
    return;
  };

  const handleDeleteMessage = async ({ message }) => {
    const messageRef = doc(db, "messages", message.id);

    await setDoc(
      messageRef,
      {
        ...(message.isDeleted && {
          isDeleted: [...message.isDeleted, userInfo.uid],
        }),
        ...(!message.isDeleted && {
          isDeleted: [userInfo.uid],
        }),
      },
      {
        merge: true,
      }
    );
  };

  const renderMessages = () => {
    return messages?.map((item) => {
      const newInfoUser = infoUsers?.find(
        (infoUser) => infoUser.uid === item.uid
      );

      if (item.isDeleted?.includes(userInfo.uid)) {
        return undefined;
      }

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

      const renderText = () => {
        let text = item.text;
        infoUsers?.forEach((member, index) => {
          const searchPattern = new RegExp(`@user:${member.uid}:user`, "g"); // Biểu thức chính quy với biến
          const replacement = `@${member.displayName}`;
          text = text.replace(
            searchPattern,
            `<span style="color: #0068ff; cursor: pointer">${replacement}</span>`
          );
        });
        return <div dangerouslySetInnerHTML={{ __html: text }} />;
      };

      return (
        <div key={item.id} className="message-item">
          {item.uid === userInfo.uid ? (
            <div className="message-item__myself">
              <div className="container-options">
                {!item.isRecall ? (
                  <>
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
                      <i
                        className="fa-solid fa-share"
                        title="Chia sẻ"
                        onClick={() =>
                          handleSharingMessage({ infoMessage: item })
                        }
                      ></i>
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
                        <div
                          className="menu-item"
                          style={{ color: "#d91b1b" }}
                          onClick={() =>
                            handleRecallMessage({
                              id: item.id,
                              createdAt: item.createdAt,
                            })
                          }
                        >
                          <i
                            className="fa-solid fa-rotate-left"
                            style={{ color: "#d91b1b" }}
                          ></i>
                          Thu hồi
                        </div>
                        <div
                          className="menu-item"
                          style={{ color: "#d91b1b" }}
                          onClick={() =>
                            handleDeleteMessage({
                              message: item,
                            })
                          }
                        >
                          <i
                            className="fa-regular fa-trash-can"
                            style={{ color: "#d91b1b" }}
                          ></i>
                          Xoá chỉ ở phía tôi
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    className="myself-options recall"
                    onClick={() =>
                      handleDeleteMessage({
                        message: item,
                      })
                    }
                  >
                    <i className="fa-regular fa-trash-can"></i>
                  </div>
                )}
              </div>
              <div className="box-image">
                <div className="text">
                  {!item.isRecall ? (
                    <>
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

                      {renderText()}
                    </>
                  ) : (
                    <span
                      style={{ color: "rgba(0,0,0,0.3)", userSelect: "none" }}
                    >
                      Tin nhắn đã được thu hồi
                    </span>
                  )}

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
                  {!item.isRecall ? (
                    <>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#7589A3",
                          userSelect: "none",
                        }}
                      >
                        {item.displayName}
                      </div>
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

                      {renderText()}
                    </>
                  ) : (
                    <span
                      style={{ color: "rgba(0,0,0,0.3)", userSelect: "none" }}
                    >
                      Tin nhắn đã được thu hồi
                    </span>
                  )}
                  <div className="box-date">{renderCreatedAtMessage()} </div>
                </div>
              </div>
              <div className="container-options">
                {!item.isRecall ? (
                  <>
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
                      <i
                        className="fa-solid fa-share"
                        title="Chia sẻ"
                        onClick={() =>
                          handleSharingMessage({ infoMessage: item })
                        }
                      ></i>
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
                        <div
                          className="menu-item"
                          style={{ color: "#d91b1b" }}
                          onClick={() =>
                            handleDeleteMessage({
                              message: item,
                            })
                          }
                        >
                          <i
                            className="fa-regular fa-trash-can"
                            style={{ color: "#d91b1b" }}
                          ></i>
                          Xoá chỉ ở phía tôi
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    className="other-options recall"
                    onClick={() =>
                      handleDeleteMessage({
                        message: item,
                      })
                    }
                  >
                    <i className="fa-regular fa-trash-can"></i>
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
    let valueInput = value;
    if (
      valueInput.slice(-2) === " @" ||
      (valueInput.slice(-2) === "@" && valueInput.length === 1)
    ) {
      setIsShowDropdownTagName(true);
    } else {
      setIsShowDropdownTagName(false);
    }

    setInputValue(valueInput);
  };

  const replaceUsernames = (text) => {
    for (const [user, name] of Object.entries(usernames)) {
      const searchPattern = new RegExp(`@user:${user}:user`, "g");
      text = text.replace(searchPattern, `@${name}`);
    }
    return text;
  };

  const displayedText = replaceUsernames(inputValue);

  // Hàm xử lý sự kiện khi bấm nút hiển thị/ẩn bảng chọn emoji
  const handleToggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  // Hàm xử lý sự kiện khi chọn emoji từ bảng chọn
  const handleSelectEmoji = (emoji) => {
    setInputValue(inputValue + emoji.native);
  };

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

  const handleSelectTagname = (memberId) => {
    handleInputChange(inputValue + memberId);
  };

  const renderMemberList = () => {
    return infoUsers?.map((member, index) => {
      return (
        <div
          className="member-item"
          key={member.uid}
          onClick={() => handleSelectTagname(`user:${member.uid}:user`)}
        >
          <img src={member.photoURL} alt="" className="member-item__avatar" />
          <div className="member-item__name">{member.displayName}</div>
        </div>
      );
    });
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
                  {/* <></>
                    <span className="new-seperator"></span> */}
                  <div style={{ color: "#7589A3" }}>Nhóm</div>
                  <span className="new-seperator"></span>
                  <div className="category">
                    {categoryGroup?.name ? (
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => setCategoryDropdown(true)}
                      >
                        <i
                          className="fa-solid fa-bookmark category-icon"
                          style={{
                            color: categoryGroup.color,
                            marginRight: "8px",
                          }}
                        ></i>
                        <span
                          style={{
                            color: categoryGroup.color,
                          }}
                        >
                          {categoryGroup.name}
                        </span>
                      </div>
                    ) : (
                      <i
                        className="fa-regular fa-bookmark category-icon"
                        onClick={() => setCategoryDropdown(true)}
                      ></i>
                    )}

                    {categoryDropdown && (
                      <div className="category-dropdown" ref={categoryRef}>
                        {userInfo?.categoriesTemplate?.map((item, index) => (
                          <div
                            key={index}
                            className="category-dropdown__item"
                            onClick={() => handleCategoryUser(item.name)}
                          >
                            <i
                              className="fa-solid fa-bookmark"
                              style={{ color: item.color }}
                            ></i>
                            {item.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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
                {isShowDropdownTagName && (
                  <div className="dropdown-tagname" ref={dropdownTagnameRef}>
                    <div className="description">
                      <div className="box-icon">
                        <i className="fa-solid fa-lightbulb"></i>
                      </div>
                      <div className="text">
                        Press ↑ or ↓ to select and Enter to use.
                      </div>
                      <i className="fa-solid fa-xmark icon-close"></i>
                    </div>
                    <div className="member-list">
                      <div
                        className="member-item"
                        onClick={() =>
                          handleSelectTagname(
                            selectedGroupMessaging.room.members
                              .map((memberId) => `user:${memberId}:user`)
                              .join(" @")
                          )
                        }
                      >
                        <div>
                          <div className="left left--tag">
                            <span>@</span>
                          </div>
                        </div>
                        <div className="member-item__name">
                          Báo cáo cho cả nhóm ·{" "}
                          <span style={{ color: "#0068FF" }}>@All</span>
                        </div>
                      </div>
                      {renderMemberList()}
                    </div>
                  </div>
                )}
                {/* {displayedText} */}
                <textarea
                  id="input-message-text"
                  className="input-message-text"
                  type="text"
                  autoComplete="off"
                  spellCheck="false"
                  // style={{ textTransform: "capitalize" }}
                  placeholder={`Nhập @, tin nhắn tới ${
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
                  value={displayedText}
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
                userSelect: "none",
              }}
            >
              Hình ảnh phải có kích thước nhỏ hơn 0.5MB
            </div>
          )}
          {isShowAlertRecallRejectMessage && (
            <div
              className="message-error"
              style={{
                position: "absolute",
                top: "160px",
                left: "0px",
                right: "0px",
                margin: "0 auto",
                color: "white",
                backgroundColor: "rgba(0,0,0,0.7)",
                width: "320px",
                height: "auto",
                padding: "12px",
                borderRadius: "4px",
                boxShadow: "var(--box-shadow-default)",
                textAlign: "center",
                fontWeight: "500",
                zIndex: 999,
                userSelect: "none",
              }}
            >
              Bạn chỉ có thể thu hồi tin nhắn trong 1 phút sau khi gửi
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
        {isShowOverlayModalSharingMessage && (
          <ModalSharingMessage
            setIsShowOverlayModalSharingMessage={
              setIsShowOverlayModalSharingMessage
            }
            infoMessageSharing={infoMessageSharing}
          />
        )}
      </S.Container>
    </S.Wrapper>
  );
};

export default BoxChatGroup;
