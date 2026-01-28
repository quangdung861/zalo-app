import React, { useContext, useState, useRef, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  orderBy,
  setDoc,
  getDocs,
  startAfter,
  limit,
  updateDoc,
} from "firebase/firestore";
import { db } from "firebaseConfig";
import { addDocument } from "services";
import { AppContext } from "Context/AppProvider";
import moment from "moment";
import messageSend from "assets/audio/messageSend.wav";
import data from "@emoji-mart/data/sets/14/facebook.json";
import Picker from "@emoji-mart/react";
import { RichTextarea } from "rich-textarea";

import AvatarGroup from "components/AvatarGroup";
import UserManual from "components/UserManual";
import ModalAccountGroup from "components/ModalAccoutGroup";
import { UserLayoutContext } from "layouts/user/UserLayout";
import ModalSharingMessage from "components/ModalSharingMessage";
import smileIcon from "assets/emoji/smile.png";
import heartIcon from "assets/emoji/heart.png";
import surpriseIcon from "assets/emoji/surprise.png";
import cryIcon from "assets/emoji/cry.png";
import angryIcon from "assets/emoji/angry.png";
import ModalAccount from "components/ModalAccount";
import ModalAddFriend from "components/ModalAddFriend";
import BackgoundModal from "common/BackgoundModal/BackgoundModal";
import * as S from "./styles";
import { useMediaQuery } from "react-responsive";
import InfiniteScroll from "react-infinite-scroll-component";
import { PAGE_SIZE_MESSAGES } from "constants/public";
import {
  backgoundsDefault,
  BACKGROUND_GROUP_DEFAULT,
} from "../../common/BackgoundModal/constants";
import { uploadImage } from "services/uploadImage";
import useClickOutside from "hooks/useClickOutside";

const BoxChatGroup = () => {
  const isMobile = useMediaQuery({ maxWidth: 576 });
  const {
    userInfo,
    room,
    selectedGroupMessaging,
    setSelectedGroupMessaging,
    startLoading,
    stopLoading,
  } = useContext(AppContext);
  const [inputValue, setInputValue] = useState("");
  const [mentions, setMentions] = useState([]);

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
  const [emojis, setEmojis] = useState();
  const [isShowOverlayUserInfoModal, setIsShowOverlayUserInfoModal] =
    useState(false);
  const [viewUserDetail, setViewUserDetail] = useState();
  const [isRenderUserNameInEmojiList, setIsRenderUserNameInEmojiList] =
    useState(false);
  const [isShowOverlayModalEmotion, setIsShowOverlayModalEmotion] =
    useState(false);
  const [isShowOverlayModalAddFriend, setIsShowOverlayModalAddFriend] =
    useState(false);
  const [avatars, setAvatars] = useState();
  const [name, setName] = useState();
  const [infoMessageSharing, setInfoMessageSharing] = useState({});
  const [isShowContainerImageList, setIsShowContainerImageList] =
    useState(true);
  const [isShowDropdownOption, setIsShowDropdownOption] = useState(false);
  const [isShowBackgroundModal, setIsShowBackgroundModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState([]);
  const [categoryGroup, setCategoryGroup] = useState({});

  const pickerEmojiRef = useRef(null);
  const inputRef = useRef();
  const imagesRef = useRef();
  const boxChatRef = useRef();
  const dropdownRef = useRef();
  const categoryRef = useRef();
  const dropdownTagnameRef = useRef();
  const dropdownSelectEmoji = useRef();
  const emotionModal = useRef();
  const prevValueRef = useRef("");

  const audio = new Audio(messageSend);

  const dataIconEmoji = [
    {
      id: "smile",
      src: smileIcon,
    },
    {
      id: "heart",
      src: heartIcon,
    },
    {
      id: "surprise",
      src: surpriseIcon,
    },
    {
      id: "cry",
      src: cryIcon,
    },
    {
      id: "angry",
      src: angryIcon,
    },
  ];

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
      if (
        dropdownSelectEmoji.current &&
        !dropdownSelectEmoji.current.contains(event.target)
      ) {
        setEmojis(false);
      }
      if (
        emotionModal.current &&
        !emotionModal.current.contains(event.target)
      ) {
        setIsShowOverlayModalEmotion(false);
        setClicked("all");
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setCategoryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const clearUnreadCount = async () => {
      if (room?.id && userInfo?.uid) {
        const newUnreadMembers = [...room.unreadMembers].filter(
          (uid) => uid !== userInfo.uid,
        );
        try {
          await updateDoc(doc(db, "rooms", room.id), {
            [`unreadCount.${userInfo.uid}`]: 0,
            unreadMembers: newUnreadMembers,
          });
        } catch (error) {
          console.error("Lỗi cập nhật unreadCount:", error);
        }
      }
    };

    // 2. Gọi hàm đó
    clearUnreadCount();
  }, [room.totalMessages]);

  useEffect(() => {
    if (room?.messageLastest?.clientCreatedAt) {
      const chatWindow = boxChatRef?.current;
      if (showBtnUpToTop) return;
      setTimeout(() => {
        chatWindow.scrollTo({
          top: chatWindow.scrollHeight,
          behavior: "auto",
        });
      }, 100);
    }
  }, [room?.messageLastest?.clientCreatedAt]);

  useEffect(() => {
    if (!room?.id || !userInfo?.uid || !room.messageLastest) return;

    const updateMessageLatestStatus = async () => {
      const lastMsg = room.messageLastest;

      // ======================
      // 1️⃣ RECEIVED (chỉ sender làm)
      // ======================
      if (lastMsg.uid === userInfo.uid) {
        const arrOnline = infoUsers?.filter(
          (user) =>
            user.isOnline?.value === true &&
            user.uid !== userInfo.uid &&
            !lastMsg.receivedBy?.[user.uid],
        );

        if (arrOnline?.length) {
          const receivedUpdates = {};

          arrOnline.forEach((user) => {
            receivedUpdates[`messageLastest.receivedBy.${user.uid}`] =
              Date.now();
          });

          await updateDoc(doc(db, "rooms", room.id), receivedUpdates);
        }
      }

      // ======================
      // 2️⃣ SEEN (chỉ receiver làm)
      // ======================
      if (lastMsg.uid !== userInfo.uid && !lastMsg.seenBy?.[userInfo.uid]) {
        await updateDoc(doc(db, "rooms", room.id), {
          [`messageLastest.seenBy.${userInfo.uid}`]: Date.now(),
        });
      }
    };

    updateMessageLatestStatus();
  }, [
    room?.id,
    room.messageLastest?.clientCreatedAt,
    infoUsers,
    userInfo?.uid,
  ]);

  useEffect(() => {
    const infoGroup = userInfo.groups.find(
      (item) => item.id === selectedGroupMessaging?.room?.id,
    );

    const categoryResult = userInfo.categoriesTemplate.find(
      (item) => item.name === infoGroup?.category,
    );

    setCategoryGroup(categoryResult);
  }, [selectedGroupMessaging, userInfo]);

  const handleCategoryUser = async (value) => {
    const groupIndex = userInfo.groups.findIndex(
      (item) => item.id === selectedGroupMessaging.room.id,
    );

    const newGroups = userInfo.groups;

    if (userInfo.groups[groupIndex].category === value) {
      newGroups.splice(groupIndex, 1, {
        id: selectedGroupMessaging.room.id,
        category: "",
      });

      const userInfoRef = doc(db, "users", userInfo.id);
      startLoading();
      await setDoc(
        userInfoRef,
        {
          groups: newGroups,
        },
        {
          merge: true,
        },
      );
      stopLoading();
      return;
    }

    newGroups.splice(groupIndex, 1, {
      id: selectedGroupMessaging.room.id,
      category: value,
    });

    const userInfoRef = doc(db, "users", userInfo.id);
    startLoading();
    await setDoc(
      userInfoRef,
      {
        groups: newGroups,
      },
      {
        merge: true,
      },
    );
    setCategoryDropdown(false);
    stopLoading();
  };

  const handleFocus = () => {
    const toolbarChatInputElement = document.querySelector(
      ".toolbar-chat-input",
    );
    Object.assign(toolbarChatInputElement.style, {
      borderBottom: "1px solid #0068FF",
    });
  };

  const handleBlur = () => {
    const toolbarChatInputElement = document.querySelector(
      ".toolbar-chat-input",
    );
    Object.assign(toolbarChatInputElement.style, {
      borderBottom: "1px solid var(--boder-dividing-color)",
    });
  };

  const handleSharingMessage = ({ infoMessage }) => {
    let infoSend = {
      text: infoMessage.text,
      images: infoMessage.images,
    };
    setInfoMessageSharing(infoSend);
    setIsShowOverlayModalSharingMessage(true);
  };

  const handleKeyDown = (imgList, e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault && e.preventDefault(); // ⛔ chặn xuống dòng
      if (inputValue || imgList[0]) {
        if (room.id) {
          audio.play();
          const createMes = async () => {
            const roomRef = doc(db, "rooms", room.id);

            const members = room.members || [];
            const unreadCount = room.unreadCount || {};

            const newUnreadCount = { ...unreadCount };
            const newUnreadMembers = [...members].filter(
              (uid) => uid !== userInfo.uid,
            );

            members.forEach((uid) => {
              if (uid === userInfo.uid) {
                newUnreadCount[uid] = 0;
              } else {
                newUnreadCount[uid] = (newUnreadCount[uid] || 0) + 1;
              }
            });

            const mentionsOnlyId = mentions.map((mention) => mention.id);
            startLoading();
            await setDoc(
              roomRef,
              {
                messageLastest: {
                  text: inputValue || (imgList && "Hình ảnh"),
                  displayName: userInfo.displayName,
                  uid: userInfo.uid,
                  receivedBy: null,
                  seenBy: null,
                  clientCreatedAt: Date.now(),
                },
                totalMessages: room.totalMessages + 1,
                unreadCount: newUnreadCount,
                unreadMembers: newUnreadMembers,
                ...(room.mentioned && {
                  mentioned: [
                    ...new Set([...room.mentioned, ...mentionsOnlyId]),
                  ],
                }),
                ...(!room.mentioned && {
                  mentioned: mentionsOnlyId,
                }),
                hideTemporarily: [],
              },
              {
                merge: true,
              },
            );

            addDocument("messages", {
              category: "group",
              roomId: room.id,
              uid: userInfo.uid,
              displayName: userInfo.displayName,
              photoURL: userInfo.photoURL,
              text: inputValue,
              mentions: mentions,
              images: imgList || [],
              infoReply: infoReply,
              emojiList: [
                {
                  id: "smile",
                  uids: [],
                },
                {
                  id: "heart",
                  uids: [],
                },
                {
                  id: "surprise",
                  uids: [],
                },
                {
                  id: "cry",
                  uids: [],
                },
                {
                  id: "angry",
                  uids: [],
                },
              ],
            });
            stopLoading();
          };
          createMes();
        }
      }
      // focus to input again after submit
      setIsReplyMessage(false);
      setInfoReply({});
      setInputValue("");
      setMentions([]);

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
    const input = inputRef?.current;
    if (!input) return;

    selectionRef.current = {
      start: input.selectionStart,
      end: input.selectionEnd,
    };
  };

  const handleClickSentMessage = () => {
    if (inputValue) {
      if (room.id) {
        audio.play();
        const createMes = async () => {
          const roomRef = doc(db, "rooms", room.id);

          const members = room.members || [];
          const unreadCount = room.unreadCount || {};

          const newUnreadCount = { ...unreadCount };
          const newUnreadMembers = [...members].filter(
            (uid) => uid !== userInfo.uid,
          );

          members.forEach((uid) => {
            if (uid === userInfo.uid) {
              newUnreadCount[uid] = 0;
            } else {
              newUnreadCount[uid] = (newUnreadCount[uid] || 0) + 1;
            }
          });
          const mentionsOnlyId = mentions.map((mention) => mention.id);
          startLoading();
          await setDoc(
            roomRef,
            {
              messageLastest: {
                text: inputValue,
                displayName: userInfo.displayName,
                uid: userInfo.uid,
                receivedBy: null,
                seenBy: null,
                clientCreatedAt: Date.now(),
              },
              totalMessages: room.totalMessages + 1,
              unreadCount: newUnreadCount,
              unreadMembers: newUnreadMembers,
              ...(room.mentioned && {
                mentioned: [...new Set([...room.mentioned, ...mentionsOnlyId])],
              }),
              ...(!room.mentioned && {
                mentioned: mentionsOnlyId,
              }),
              hideTemporarily: [],
            },
            {
              merge: true,
            },
          );

          await addDocument("messages", {
            category: "group",
            roomId: room.id,
            uid: userInfo.uid,
            displayName: userInfo.displayName,
            photoURL: userInfo.photoURL,
            text: inputValue,
            mentions: mentions,
            images: [],
            infoReply: infoReply,
            emojiList: [
              {
                id: "smile",
                uids: [],
              },
              {
                id: "heart",
                uids: [],
              },
              {
                id: "surprise",
                uids: [],
              },
              {
                id: "cry",
                uids: [],
              },
              {
                id: "angry",
                uids: [],
              },
            ],
          });
          stopLoading();
        };
        createMes();
      }
      // focus to input again after submit
      setIsReplyMessage(false);
      setInfoReply({});
      setInputValue("");
      setMentions([]);

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

  const showError = (message) => {
    setIsShowMessageError(message);
    setTimeout(function () {
      setIsShowMessageError(false);
    }, 3000);
  };

  const MAX_FILES = 10;
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100MB

  const handleUploadImage = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    // 1️⃣ Check số lượng
    if (files.length > MAX_FILES) {
      showError("Chỉ được gửi tối đa 10 ảnh");
      return;
    }

    // 2️⃣ Check size từng file
    if (files.some((file) => file.size > MAX_FILE_SIZE)) {
      showError("Mỗi ảnh không được vượt quá 10MB");
      return;
    }

    // 3️⃣ Check tổng dung lượng
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > MAX_TOTAL_SIZE) {
      showError("Tổng dung lượng ảnh vượt quá 100MB");
      return;
    }

    startLoading();

    try {
      // 4️⃣ Upload song song + chờ xong
      const imgList = await Promise.all(files.map((file) => uploadImage(file)));

      const e = {
        key: "Enter",
        isPreventDefault: true,
      };

      handleKeyDown(imgList, e);
    } catch (error) {
      console.error(error);
      showError("Upload ảnh thất bại, vui lòng thử lại");
    } finally {
      stopLoading();
      event.target.value = ""; // reset input
    }
  };

  const [isShowOverlayModal, setIsShowOverlayModal] = useState(false);

  useEffect(() => {
    if (inputRef) {
      inputRef.current.focus();
    }
    setMessages([]);
    setHasMore(true);
    setLastDoc(null);
  }, [room.id]);

  useEffect(() => {
    setMessages([]);
    let unSubcribe;
    if (room.id) {
      const handleSnapShotMessage = async () => {
        const messagesRef = query(
          collection(db, "messages"),
          where("roomId", "==", room.id),
          orderBy("clientCreatedAt", "desc"),
          limit(PAGE_SIZE_MESSAGES),
        );
        unSubcribe = onSnapshot(
          messagesRef,
          (docsSnap) => {
            const documents = docsSnap.docs.map((doc) => {
              const id = doc.id;
              const data = doc.data();
              return {
                ...data,
                id: id,
              };
            });
            setMessages(documents);
            setLastDoc(docsSnap.docs[docsSnap.docs.length - 1] || null);
          },
          (error) => {
            console.error("🔥 onSnapshot messages error:", error);
          },
        );
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
    if (room.members) {
      const fetchData = async () => {
        const docRef = query(
          collection(db, "users"),
          where("uid", "in", room.members),
        );
        startLoading();
        const reponse = await getDocs(docRef);
        stopLoading();
        const documents = reponse.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
        setInfoUsers(documents);

        documents.forEach((member) => {
          setUsernames((cur) => ({ ...cur, [member.uid]: member.displayName }));
        });
      };
      fetchData();
    }
  }, [room]);

  const [showBtnUpToTop, setShowBtnUpToTop] = useState(false);

  const handleScroll = () => {
    const chatWindow = boxChatRef?.current;
    if (chatWindow) {
      const isNearTop = Math.abs(chatWindow.scrollTop) < 200;
      setShowBtnUpToTop(!isNearTop);
    }
  };

  useEffect(() => {
    const chatWindow = boxChatRef?.current;

    if (chatWindow) {
      chatWindow.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (chatWindow) {
        chatWindow.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const handleUpToBottom = () => {
    const chatWindow = boxChatRef?.current;
    chatWindow.scrollTo({
      top: chatWindow.scrollHeight,
      behavior: "smooth",
    });
  };

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

  const handleCopyText = async (text) => {
    if (!text) {
      setIsShowDropdownOption(false);
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      // showToast("Copied!");
    } catch (err) {
      console.error("COPY_FAILED:", err);
      // showToast("Copy failed");
    } finally {
      setIsShowDropdownOption(false);
    }
  };

  const handleRecallMessage = async ({ id, clientCreatedAt }) => {
    const now = moment();
    const date = moment(clientCreatedAt);

    const diffSeconds = now.diff(date, "seconds");

    startLoading();
    setIsShowDropdownOption(false);

    if (diffSeconds < 30) {
      const messageRef = doc(db, "messages", id);

      await setDoc(messageRef, { isRecall: true }, { merge: true });

      stopLoading();
      return;
    }

    setIsShowAlertRecallRejectMessage(true);
    setTimeout(() => {
      setIsShowAlertRecallRejectMessage(false);
    }, 3000);

    stopLoading();
  };

  const handleDeleteMessage = async ({ message }) => {
    const messageRef = doc(db, "messages", message.id);

    startLoading();
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
      },
    );
    stopLoading();
  };

  const handleAddEmoji = async ({ id, message }) => {
    let emojiList = message.emojiList.map((emojiItem) => {
      const updatedUids = emojiItem.uids.map((uidItem) => {
        if (uidItem.uid === userInfo.uid) {
          return { ...uidItem, isNewest: false };
        }
        return uidItem;
      });

      return { ...emojiItem, uids: updatedUids };
    });

    const myData = emojiList.find((item) => item.id === id);

    const myDataIndex = myData.uids.findIndex(
      (item) => item.uid === userInfo.uid,
    );

    if (myDataIndex !== -1) {
      const updatedEmojiList = emojiList;

      updatedEmojiList
        .find((item) => item.id === id)
        .uids.splice(myDataIndex, 1, {
          ...updatedEmojiList.find((item) => item.id === id).uids[myDataIndex],
          isNewest: true,
          quantity:
            updatedEmojiList.find((item) => item.id === id).uids[myDataIndex]
              ?.quantity + 1,
        });

      const messagesRef = doc(db, "messages", message.id);
      startLoading();
      await setDoc(
        messagesRef,
        {
          emojiList: updatedEmojiList,
        },
        {
          merge: true,
        },
      );
      stopLoading();
      setEmojis();
    } else {
      emojiList
        .find((item) => item.id === id)
        .uids.push({
          uid: userInfo.uid,
          isNewest: true,
          quantity: 1,
        });

      const messagesRef = doc(db, "messages", message.id);
      startLoading();
      await setDoc(
        messagesRef,
        {
          emojiList: emojiList,
        },
        {
          merge: true,
        },
      );
      stopLoading();
      setEmojis();
    }
  };

  const handleRemoveEmojis = async ({ message }) => {
    let newEmojiList = [...message.emojiList];
    newEmojiList = newEmojiList.map((item) => {
      const updatedUids = item.uids
        .map((uid) => {
          if (uid.uid !== userInfo.uid) {
            return uid;
          }
          return null;
        })
        .filter((uid) => uid !== undefined);

      return { ...item, uids: updatedUids };
    });

    const messagesRef = doc(db, "messages", message.id);
    startLoading();
    await setDoc(
      messagesRef,
      {
        emojiList: newEmojiList,
      },
      {
        merge: true,
      },
    );
    stopLoading();
    setEmojis();
  };

  const [clicked, setClicked] = useState("all");

  function startOfDay(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function getDateLabel(clientCreatedAt) {
    const msgDate = startOfDay(clientCreatedAt);
    const today = startOfDay(new Date());

    const diffDays = (today - msgDate) / (1000 * 60 * 60 * 24);

    if (diffDays === 0) return "Hôm nay";
    if (diffDays === 1) return "Hôm qua";

    const sameYear = msgDate.getFullYear() === today.getFullYear();

    if (sameYear) {
      return msgDate.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });
    }

    return msgDate.toLocaleDateString("vi-VN");
  }

  function shouldShowLabel(current, next) {
    if (!current?.clientCreatedAt) return false;
    if (!next?.clientCreatedAt) return true;

    const curDay = startOfDay(current.clientCreatedAt).getTime();
    const nextDay = startOfDay(next.clientCreatedAt).getTime();

    return curDay !== nextDay;
  }

  const getGroupMessageStatus = (room, userInfo) => {
    if (room?.messageLastest?.uid !== userInfo.uid) return;
    const isMe = room.messageLastest.uid === userInfo.uid;
    if (isMe) {
      if (Object.keys(room.messageLastest.seenBy || {}).length) {
        return {
          type: "seen",
          text: (
            <span>
              <i className="fa-solid fa-check"></i>{" "}
              <i className="fa-solid fa-check"></i> &nbsp;Đã xem
            </span>
          ),
        };
      }
      if (Object.keys(room.messageLastest.receivedBy || {}).length) {
        return {
          type: "received",
          text: (
            <span>
              <i className="fa-solid fa-check"></i> &nbsp;Đã nhận
            </span>
          ),
        };
      }
      return {
        type: "sent",
        text: <span>Đã gửi</span>,
      };
    }
  };

  const renderMessages = () => {
    return messages?.map((item, index) => {
      const infoDeleted = room.deleted?.find(
        (item) => item.uid === userInfo.uid,
      );

      if (infoDeleted) {
        const formatDate = moment(item.clientCreatedAt);

        if (formatDate < infoDeleted?.clientCreatedAt) {
          return null;
        }
      }

      const newInfoUser = infoUsers?.find(
        (infoUser) => infoUser.uid === item.uid,
      );

      if (item.isDeleted?.includes(userInfo.uid)) {
        return undefined;
      }

      const nextMsg = messages[index + 1];
      const showLabel = shouldShowLabel(item, nextMsg);
      const label = getDateLabel(item.clientCreatedAt);

      let CREATEDAT_URL;

      const renderCreatedAtMessage = () => {
        if (!item?.clientCreatedAt) return null;

        let formattedDate = "";
        const now = moment();

        const date = moment(item.clientCreatedAt);

        if (date.isSame(now, "day")) {
          formattedDate = `${date.format("HH:mm")} Hôm nay`;
        } else if (date.isSame(now.clone().subtract(1, "day"), "day")) {
          formattedDate = `${date.format("HH:mm")} Hôm qua`;
        } else {
          formattedDate = date.format("HH:mm DD/MM/YYYY");
        }

        CREATEDAT_URL = formattedDate;

        return <div className="format-date-message">{formattedDate}</div>;
      };

      const renderText = () => {
        let text = item.text;
        const mentions = item.mentions;
        if (!mentions?.length) return text;

        const result = [];
        let lastIndex = 0;

        const sortedMentions = [...mentions].sort((a, b) => a.start - b.start);

        sortedMentions.forEach((m) => {
          if (m.start < lastIndex || m.start < 0 || m.end > text.length) {
            return;
          }

          result.push(text.slice(lastIndex, m.start));

          result.push(
            <span key={m.key} className="mention" data-id={m.userId}>
              {text.slice(m.start, m.end)}
            </span>,
          );

          lastIndex = m.end;
        });

        result.push(text.slice(lastIndex));
        return result;
      };

      let statusMsg = null;
      if (index === 0) {
        statusMsg = getGroupMessageStatus(room, userInfo);
      }

      let total = 0;

      item.emojiList?.forEach((element) => {
        element.uids.forEach((item) => {
          total = total + item.quantity;
        });
      });

      const isNewest = item.emojiList?.find((emoji) =>
        emoji.uids.find((item) => item.uid === userInfo.uid && item.isNewest),
      );

      const sortedEmojiList = item.emojiList?.sort((a, b) => {
        const sumQuantityA = a.uids.reduce(
          (total, uid) => total + uid.quantity,
          0,
        );
        const sumQuantityB = b.uids?.reduce(
          (total, uid) => total + uid.quantity,
          0,
        );

        return sumQuantityB - sumQuantityA; // Sắp xếp theo thứ tự giảm dần
      });

      //

      const lastIndex = messages?.reduce((lastIndex, element, index) => {
        if (element.uid !== userInfo.uid) {
          return index; // Lưu lại chỉ mục của phần tử thỏa mãn điều kiện
        }
        return lastIndex; // Nếu không tìm thấy, trả về giá trị trước đó
      }, -1);

      //

      const userInEmojiList = [];

      sortedEmojiList?.forEach((item) =>
        item.uids.forEach((uid) => userInEmojiList.push(uid.uid)),
      );

      const uniqueUserInEmojiList = [...new Set(userInEmojiList)];

      const renderUserNameInEmojiList = () => {
        return uniqueUserInEmojiList?.map((uid, index) => {
          const data = infoUsers?.find((item) => item.uid === uid);
          if (data) {
            return (
              <div key={index} className="reaction-userName">
                {uid === userInfo.uid ? "Bạn" : data.displayName}
              </div>
            );
          }
          return null;
        });
      };

      const renderEmotionList = () => {
        return uniqueUserInEmojiList?.map((uid2, index) => {
          let categoriesId = [];
          sortedEmojiList.forEach((emoji) => {
            const result = emoji.uids.findIndex((uid) => uid.uid === uid2);
            if (result !== -1) {
              categoriesId.push(emoji.id);
            }
          });

          const data = infoUsers?.find((user) => user.uid === uid2);

          if (clicked !== "all" && !categoriesId.includes(clicked)) return null;

          let total = 0;
          sortedEmojiList.forEach((element) => {
            element.uids.forEach((item) => {
              if (item.uid === uid2) {
                total = total + item.quantity;
              }
            });
          });

          let totalHasFilter = 0;
          sortedEmojiList.forEach((element) => {
            if (element.id === clicked) {
              element.uids.forEach((item) => {
                if (item.uid === uid2) {
                  totalHasFilter = totalHasFilter + item.quantity;
                }
              });
            }
          });

          if (data) {
            return (
              <div className="reaction-item" key={uid2}>
                <div className="reaction-item__left">
                  <img src={data.photoURL} alt="" />
                  <span>{data.displayName}</span>
                </div>
                <div className="reaction-item__right">
                  {categoriesId.map(
                    (categoryId) =>
                      (clicked === "all" || categoryId === clicked) && (
                        <img
                          key={categoryId}
                          src={
                            dataIconEmoji.find((item) => item.id === categoryId)
                              .src
                          }
                          alt=""
                        />
                      ),
                  )}

                  <span
                    style={{
                      width: "16px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      textAlign: "center",
                    }}
                  >
                    {clicked !== "all" ? totalHasFilter : total}
                  </span>
                </div>
              </div>
            );
          }
          return null;
        });
      };

      return (
        <React.Fragment key={item.id}>
          <div className="message-item" onMouseLeave={() => setEmojis()}>
            {isShowOverlayModalEmotion?.message?.id === item.id && (
              <div className="modal-emoji-overlay">
                <div className="modal-container">
                  <div className="modal-content" ref={emotionModal}>
                    <div className="modal-content__header">
                      <div className="title">Biểu cảm</div>
                      <div className="icon-close">
                        <i
                          className="fa-solid fa-xmark"
                          onClick={() => {
                            setIsShowOverlayModalEmotion(false);
                            setClicked("all");
                          }}
                        ></i>
                      </div>
                    </div>
                    <div className="modal-content__content">
                      <div className="filter-category-list">
                        <div
                          className={`filter-category-item ${
                            clicked === "all" ? "clicked" : ""
                          }`}
                          onClick={() => setClicked("all")}
                        >
                          Tất cả {total}
                          <div
                            className={`dividing-bottom ${
                              clicked === "all" ? "clicked" : ""
                            }`}
                          ></div>
                        </div>
                        {sortedEmojiList.map(
                          (emoji) =>
                            emoji.uids[0] && (
                              <div
                                className={`filter-category-item ${
                                  clicked === emoji.id ? "clicked" : ""
                                }`}
                                key={emoji.id}
                                onClick={() => setClicked(emoji.id)}
                              >
                                <img
                                  src={
                                    dataIconEmoji.find(
                                      (item) => item.id === emoji.id,
                                    ).src
                                  }
                                  alt=""
                                />
                                {emoji.uids.reduce(
                                  (accumulator, currentValue) =>
                                    accumulator + currentValue.quantity,
                                  0,
                                )}
                                <div
                                  className={`dividing-bottom ${
                                    clicked === emoji.id ? "clicked" : ""
                                  }`}
                                ></div>
                              </div>
                            ),
                        )}
                        <div className="dividing-selected"></div>
                      </div>
                      {renderEmotionList()}
                    </div>
                  </div>
                </div>
              </div>
            )}
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
                                clientCreatedAt: item.clientCreatedAt,
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
                    {isRenderUserNameInEmojiList === item.id && (
                      <div
                        className="dropdown-username-reaction"
                        style={{
                          bottom:
                            messages.length - 1 === index ? "46px" : "auto",
                          top: messages.length - 1 === index ? "auto" : "100%",
                        }}
                      >
                        {renderUserNameInEmojiList()}
                      </div>
                    )}
                    {!item.isRecall ? (
                      <>
                        {item.infoReply?.id && (
                          <div className="reply-content">
                            <div className="reply-content__left"></div>
                            {item.infoReply?.image && (
                              <img
                                src={item.infoReply?.image?.thumbnail}
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
                        {item.images?.length > 0 && (
                          <div
                            className={`image-group count-${Math.min(item.images.length, 6)}`}
                          >
                            {item.images.slice(0, 6).map((image, index) => (
                              <div
                                key={index}
                                className="image-item"
                                onClick={() => {
                                  setMessageSelected({
                                    ...newInfoUser,
                                    URL: image.original,
                                    CREATEDAT_URL,
                                    MESSAGE_ID: item.id,
                                    IMAGE_INDEX: index,
                                  });
                                  setIsShowOverlayModalDetailImage(true);
                                }}
                              >
                                <img src={image.thumbnail} alt="" />

                                {item.images.length > 6 && index === 5 && (
                                  <div className="overlay">
                                    +{item.images.length - 6}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

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
                    {total > 0 && (
                      <div className="reaction-emoji">
                        {isNewest && (
                          <div
                            className="emoji-newest"
                            onClick={() =>
                              handleAddEmoji({ id: isNewest.id, message: item })
                            }
                            onMouseEnter={() => setEmojis(item.id)}
                          >
                            <img
                              src={
                                dataIconEmoji.find(
                                  (item) => item.id === isNewest.id,
                                ).src
                              }
                              alt=""
                              className="emoji-item"
                            />
                          </div>
                        )}

                        <div
                          className="total-emoji"
                          onMouseEnter={() =>
                            setIsRenderUserNameInEmojiList(item.id)
                          }
                          onMouseLeave={() =>
                            setIsRenderUserNameInEmojiList(false)
                          }
                          onClick={() =>
                            setIsShowOverlayModalEmotion({ message: item })
                          }
                        >
                          <span>{total}</span>

                          {sortedEmojiList
                            .slice(0, 3)
                            .map(
                              (emoji, index) =>
                                emoji.uids[0] && (
                                  <img
                                    key={emoji.id}
                                    src={
                                      dataIconEmoji.find(
                                        (item) => item.id === emoji.id,
                                      ).src
                                    }
                                    alt=""
                                  />
                                ),
                            )}
                        </div>
                      </div>
                    )}

                    <div className="box-emoji">
                      {!isNewest && (
                        <div
                          className="btn-emoji btn-emoji-hidden"
                          onMouseEnter={() => setEmojis(item.id)}
                        >
                          <i className="fa-regular fa-thumbs-up"></i>
                        </div>
                      )}
                      {emojis === item.id && (
                        <div
                          className="dropdown-emoji-list"
                          ref={dropdownSelectEmoji}
                          style={{ marginBottom: isNewest ? "30px" : "auto" }}
                        >
                          <img
                            src={smileIcon}
                            alt=""
                            className="emoji-item"
                            onClick={() =>
                              handleAddEmoji({ id: "smile", message: item })
                            }
                          />
                          <img
                            src={heartIcon}
                            alt=""
                            className="emoji-item"
                            onClick={() =>
                              handleAddEmoji({ id: "heart", message: item })
                            }
                          />
                          <img
                            src={surpriseIcon}
                            alt=""
                            className="emoji-item"
                            onClick={() =>
                              handleAddEmoji({ id: "surprise", message: item })
                            }
                          />
                          <img
                            src={cryIcon}
                            alt=""
                            className="emoji-item"
                            onClick={() =>
                              handleAddEmoji({ id: "cry", message: item })
                            }
                          />
                          <img
                            src={angryIcon}
                            alt=""
                            className="emoji-item"
                            onClick={() =>
                              handleAddEmoji({ id: "angry", message: item })
                            }
                          />
                          <i
                            className="fa-solid fa-xmark btn-close"
                            onClick={() =>
                              handleRemoveEmojis({ message: item })
                            }
                          ></i>
                        </div>
                      )}
                    </div>
                  </div>
                  {index === 0 && (
                    <div className="status-msg">{statusMsg?.text}</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="message-item__other">
                <div className="box-image">
                  <img
                    src={item.photoURL?.thumbnail}
                    alt=""
                    className="avatar"
                    onClick={() => {
                      setViewUserDetail(newInfoUser);
                      setIsShowOverlayUserInfoModal(true);
                    }}
                  />
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
                                src={item.infoReply?.image?.thumbnail}
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
                        {item.images?.length > 0 && (
                          <div
                            className={`image-group count-${Math.min(item.images.length, 6)}`}
                          >
                            {item.images.slice(0, 6).map((image, index) => (
                              <div
                                key={index}
                                className="image-item"
                                onClick={() => {
                                  setMessageSelected({
                                    ...newInfoUser,
                                    URL: image.original,
                                    CREATEDAT_URL,
                                    MESSAGE_ID: item.id,
                                    IMAGE_INDEX: index,
                                  });
                                  setIsShowOverlayModalDetailImage(true);
                                }}
                              >
                                <img src={image.thumbnail} alt="" />

                                {item.images.length > 6 && index === 5 && (
                                  <div className="overlay">
                                    +{item.images.length - 6}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

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
                    {total > 0 && (
                      <div className="reaction-emoji">
                        {isNewest && (
                          <div
                            className="emoji-newest"
                            onClick={() =>
                              handleAddEmoji({ id: isNewest.id, message: item })
                            }
                            onMouseEnter={() => setEmojis(item.id)}
                          >
                            <img
                              src={
                                dataIconEmoji.find(
                                  (item) => item.id === isNewest.id,
                                ).src
                              }
                              alt=""
                              className="emoji-item"
                            />
                          </div>
                        )}

                        <div
                          className="total-emoji"
                          onMouseEnter={() =>
                            setIsRenderUserNameInEmojiList(item.id)
                          }
                          onMouseLeave={() =>
                            setIsRenderUserNameInEmojiList(false)
                          }
                          onClick={() =>
                            setIsShowOverlayModalEmotion({ message: item })
                          }
                        >
                          <span>{total}</span>

                          {sortedEmojiList
                            .slice(0, 3)
                            .map(
                              (emoji, index) =>
                                emoji.uids[0] && (
                                  <img
                                    key={emoji.id}
                                    src={
                                      dataIconEmoji.find(
                                        (item) => item.id === emoji.id,
                                      ).src
                                    }
                                    alt=""
                                  />
                                ),
                            )}
                        </div>
                      </div>
                    )}
                    <div className="box-emoji">
                      {lastIndex === index && !isNewest && (
                        <div
                          className="btn-emoji"
                          onMouseEnter={() => setEmojis(item.id)}
                        >
                          <i className="fa-regular fa-thumbs-up"></i>
                        </div>
                      )}

                      {!isNewest && (
                        <div
                          className="btn-emoji btn-emoji-hidden"
                          onMouseEnter={() => setEmojis(item.id)}
                        >
                          <i className="fa-regular fa-thumbs-up"></i>
                        </div>
                      )}
                      {emojis === item.id && (
                        <div
                          className="dropdown-emoji-list"
                          ref={dropdownSelectEmoji}
                          style={{ marginBottom: isNewest ? "30px" : "auto" }}
                        >
                          <img
                            src={smileIcon}
                            alt=""
                            className="emoji-item"
                            onClick={() =>
                              handleAddEmoji({ id: "smile", message: item })
                            }
                          />
                          <img
                            src={heartIcon}
                            alt=""
                            className="emoji-item"
                            onClick={() =>
                              handleAddEmoji({ id: "heart", message: item })
                            }
                          />
                          <img
                            src={surpriseIcon}
                            alt=""
                            className="emoji-item"
                            onClick={() =>
                              handleAddEmoji({ id: "surprise", message: item })
                            }
                          />
                          <img
                            src={cryIcon}
                            alt=""
                            className="emoji-item"
                            onClick={() =>
                              handleAddEmoji({ id: "cry", message: item })
                            }
                          />
                          <img
                            src={angryIcon}
                            alt=""
                            className="emoji-item"
                            onClick={() =>
                              handleAddEmoji({ id: "angry", message: item })
                            }
                          />
                          <i
                            className="fa-solid fa-xmark btn-close"
                            onClick={() =>
                              handleRemoveEmojis({ message: item })
                            }
                          ></i>
                        </div>
                      )}
                    </div>
                    {isRenderUserNameInEmojiList === item.id && (
                      <div
                        className="dropdown-username-reaction"
                        style={{
                          bottom:
                            messages.length - 1 === index ? "46px" : "auto",
                          top: messages.length - 1 === index ? "auto" : "100%",
                        }}
                      >
                        {renderUserNameInEmojiList()}
                      </div>
                    )}
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
          {showLabel && (
            <div className="date-label">
              <div className="format-date"> {label} </div>
            </div>
          )}
        </React.Fragment>
      );
    });
  };

  useClickOutside(pickerEmojiRef, () => {
    setShowEmojiPicker(false);
  });

  const isOverlap = (aStart, aEnd, bStart, bEnd) => {
    return aStart < bEnd && aEnd > bStart;
  };

  const syncMentionsWithText = (prevText, nextText, mentions) => {
    const { start, end } = selectionRef.current;
    const diff = nextText.length - prevText.length;

    const isRangeDelete = start !== end;

    return mentions
      .map((m) => {
        // ============================
        // CASE 1: CÓ BÔI ĐEN (range)
        // ============================
        if (isRangeDelete) {
          // 🔥 bôi đen đụng mention (dù 1 phần hay toàn bộ) → remove
          if (isOverlap(start, end, m.start, m.end)) {
            return null;
          }

          // mention nằm sau vùng delete → shift
          if (m.start >= end) {
            return {
              ...m,
              start: m.start + diff,
              end: m.end + diff,
            };
          }

          // mention trước vùng delete → giữ
          return m;
        }

        // ============================
        // CASE 2: KHÔNG BÔI ĐEN (caret)
        // ============================
        const caret = start;

        // caret nằm TRONG mention → remove
        if (caret > m.start && caret <= m.end) {
          return null;
        }

        // mention nằm sau caret → shift
        if (m.start >= caret) {
          return {
            ...m,
            start: m.start + diff,
            end: m.end + diff,
          };
        }

        return m;
      })
      .filter(Boolean);
  };

  const selectionRef = useRef({ start: 0, end: 0 });

  const handleBeforeInput = () => {
    const input = inputRef.current;
    if (!input) return;

    selectionRef.current = {
      start: input.selectionStart,
      end: input.selectionEnd,
    };
  };

  const handleInputChange = (value) => {
    const prevText = prevValueRef.current ?? "";

    setInputValue(value);

    setMentions((prev) => syncMentionsWithText(prevText, value, prev));

    let shouldOpenDropdown = false;

    // chỉ xét khi vừa gõ thêm 1 ký tự
    if (value.length === prevText.length + 1) {
      const lastChar = value[value.length - 1];

      if (lastChar === "@") {
        // CASE 1: '@' là ký tự đầu tiên
        if (value.length === 1) {
          shouldOpenDropdown = true;
        }
        // CASE 2: trước '@' là khoảng trắng
        else if (value[value.length - 2] === " ") {
          shouldOpenDropdown = true;
        }
      }
    }

    setIsShowDropdownTagName(shouldOpenDropdown);
    prevValueRef.current = value;
  };

  // Hàm xử lý sự kiện khi bấm nút hiển thị/ẩn bảng chọn emoji
  const handleToggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  // Hàm xử lý sự kiện khi chọn emoji từ bảng chọn
  const handleSelectEmoji = (emoji) => {
    setInputValue(inputValue + emoji.native);
  };

  useEffect(() => {
    if (room.id) {
      const fetchData = async () => {
        startLoading();
        const partnerRef = query(
          collection(db, "users"),
          where("uid", "in", room.members),
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
        stopLoading();
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
        (infoUser) => infoUser.uid === item.uid,
      );

      let CREATEDAT_URL;

      const getCreatedAtMessage = () => {
        if (!item?.clientCreatedAt) return;

        let formattedDate = "";
        const now = moment();

        const date = moment(item.clientCreatedAt);

        if (date.isSame(now, "day")) {
          formattedDate = `${date.format("HH:mm")} Hôm nay`;
        } else if (date.isSame(now.clone().subtract(1, "day"), "day")) {
          formattedDate = `${date.format("HH:mm")} Hôm qua`;
        } else {
          formattedDate = date.format("HH:mm DD/MM/YYYY");
        }

        CREATEDAT_URL = formattedDate;
      };

      getCreatedAtMessage();

      return item.images.map((image, index) => {
        return (
          <img
            className="image-item"
            key={index}
            src={image.thumbnail}
            alt=""
            onClick={() =>
              setMessageSelected({
                ...newInfoUser,
                URL: image.original,
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

  const downloadImage = async () => {
    const response = await fetch(messageSelected?.URL);
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `photo-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const getMentionTriggerRange = (text, caretPos) => {
    const before = text.slice(0, caretPos);
    const match = before.match(/(^|\s)@([^\s@]*)$/);
    if (!match) return null;

    return {
      start: caretPos - match[0].length + match[1].length,
      end: caretPos,
    };
  };

  const handleSelectTagname = (member) => {
    const input = inputRef.current;
    if (!input) return;

    const caret = input.selectionStart;
    const range = getMentionTriggerRange(inputValue, caret);
    if (!range) return;

    // ===== CASE: @all =====
    if (!member) {
      let offset = range.start;

      const mentionsToInsert = infoUsers.map((m) => {
        const text = `@${m.displayName} `;
        const start = offset;
        const end = start + text.length - 1;
        offset += text.length;

        return {
          text,
          mention: {
            id: m.id,
            name: m.displayName,
            start,
            end,
          },
        };
      });

      const allText = mentionsToInsert.map((m) => m.text).join("");

      const nextText =
        inputValue.slice(0, range.start) +
        allText +
        inputValue.slice(range.end);

      setInputValue(nextText);
      prevValueRef.current = nextText;

      setMentions((prev) => [
        ...prev,
        ...mentionsToInsert.map((m) => m.mention),
      ]);

      setIsShowDropdownTagName(false);

      // requestAnimationFrame(() => {
      //   input.selectionStart = input.selectionEnd = range.start + allText.length;
      // });
      inputRef.current.focus();

      return;
    }

    // ===== CASE: single member =====
    const mentionText = `@${member.displayName} `;
    const start = range.start;
    const end = start + mentionText.length - 1;

    const nextText =
      inputValue.slice(0, start) + mentionText + inputValue.slice(range.end);

    setInputValue(nextText);
    prevValueRef.current = nextText;

    setMentions((prev) => [
      ...prev,
      {
        id: member.id,
        name: member.displayName,
        start,
        end,
      },
    ]);

    setIsShowDropdownTagName(false);

    // requestAnimationFrame(() => {
    //   input.selectionStart = input.selectionEnd =
    //     start + mentionText.length;
    // });
    inputRef.current.focus();
  };

  const renderMemberList = () => {
    return infoUsers?.map((member) => {
      return (
        <div
          className="member-item"
          key={member.uid}
          onClick={() => handleSelectTagname(member)}
        >
          <img
            src={member.photoURL.thumbnail}
            alt=""
            className="member-item__avatar"
          />
          <div className="member-item__name">{member.displayName}</div>
        </div>
      );
    });
  };

  const formatPlaceholderName = (room, group) => {
    const name = room?.name || group?.name;
    if (!name) return "";
    return name.length <= 40 ? name : `${name.slice(0, 39)}...`;
  };

  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreData = async () => {
    if (!hasMore) return;
    startLoading();
    await loadMoreMessages();
    stopLoading();
  };

  const loadMoreMessages = async () => {
    if (!lastDoc) return;

    const messageRef = query(
      collection(db, "messages"),
      where("roomId", "==", room.id),
      orderBy("clientCreatedAt", "desc"),
      startAfter(lastDoc),
      limit(PAGE_SIZE_MESSAGES),
    );

    const snap = await getDocs(messageRef);
    if (snap.empty) {
      setHasMore(false);
      return;
    }

    let newMessages = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    setMessages((prev) => [...prev, ...newMessages]);

    setLastDoc(snap.docs[snap.docs.length - 1]);
  };

  const userBackground =
    room.settings?.backgroundMembers?.[userInfo.uid]?.background;

  const backgrounds = [
    ...(userBackground ? [userBackground] : []),
    ...backgoundsDefault,
  ];
  const [backgroundOriginalAll, setBackgroundOriginalAll] = useState("");

  const [currentIndex, setCurrentIndex] = useState(null);

  const initInfoBackground = () => {
    const index =
      room?.settings?.backgroundMembers?.[userInfo.uid]?.currentIndex;

    if (typeof index === "number") {
      setCurrentIndex(index);
    } else {
      // null or undefined
      if (room?.settings?.background?.original) {
        setCurrentIndex(null);
        setBackgroundOriginalAll(room?.settings?.background?.original);
      } else {
        setCurrentIndex(BACKGROUND_GROUP_DEFAULT);
      }
    }
  };

  useEffect(() => {
    initInfoBackground();
  }, [room, userInfo.uid]);

  return (
    <S.Wrapper>
      <S.Container
        isReplyMessage={isReplyMessage}
        background={
          typeof currentIndex === "number"
            ? backgrounds?.[currentIndex]?.original
            : backgroundOriginalAll
        }
      >
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
                {selectedGroupMessaging?.room?.avatar?.original ? (
                  <img
                    src={selectedGroupMessaging?.room?.avatar?.original}
                    alt=""
                  />
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
                <div
                  className="display-name"
                  onClick={() => setIsShowOverlayModal(true)}
                >
                  {selectedGroupMessaging?.room?.name
                    ? selectedGroupMessaging?.room?.name
                    : selectedGroupMessaging.name}
                </div>
                <div className="last-time">
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
              {/* <div className="box-icon">
                <i className="fa-solid fa-users"></i>
              </div>
              <div className="box-icon">
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
              <div className="box-icon">
                <i className="fa-solid fa-video"></i>
              </div>
              <div className="box-icon background">
                <i className="fa-solid fa-chart-bar"></i>
              </div> */}
              <div
                className="box-icon"
                onClick={() => setIsShowBackgroundModal(true)}
              >
                <i className="fa-solid fa-paintbrush"></i>
              </div>
              {isShowBackgroundModal && (
                <BackgoundModal
                  text="Đổi hình nền mọi người"
                  initInfoBackground={initInfoBackground}
                  backgrounds={backgrounds}
                  currentIndex={currentIndex}
                  setCurrentIndex={setCurrentIndex}
                  uid={userInfo.uid}
                  members={room.members}
                  roomId={room.id}
                  setIsShowBackgroundModal={setIsShowBackgroundModal}
                />
              )}
            </div>
          </div>
          <div className="container-content">
            <div
              id="parentScrollDiv-boxchat"
              className="box-chat__content"
              ref={boxChatRef}
            >
              <InfiniteScroll
                inverse={true}
                dataLength={messages.length}
                next={fetchMoreData}
                hasMore={hasMore}
                scrollableTarget="parentScrollDiv-boxchat"
                style={{ display: "flex", flexDirection: "column-reverse" }}
              >
                {renderMessages()}
                {showBtnUpToTop && (
                  <div className="up-to-top" onClick={() => handleUpToBottom()}>
                    <i className="fa-solid fa-chevron-up fa-rotate-180"></i>
                  </div>
                )}
                <div className="user-info">
                  <div
                    className="user-info__avatar"
                    onClick={() => setIsShowOverlayModal(true)}
                  >
                    {selectedGroupMessaging?.room?.avatar?.thumbnail ? (
                      <img
                        src={selectedGroupMessaging?.room?.avatar?.thumbnail}
                        alt=""
                      />
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
              </InfiniteScroll>
            </div>
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
                    src={infoReply?.image?.thumbnail}
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
                        onClick={() => handleSelectTagname()}
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
                <RichTextarea
                  id="input-message-text"
                  autoComplete="off"
                  spellCheck="false"
                  ref={inputRef}
                  value={inputValue}
                  onSelect={handleBeforeInput}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={(e) => handleKeyDown([], e)}
                  onFocus={(e) => handleFocus()}
                  onBlur={() => handleBlur()}
                  style={{
                    width: "100%",
                    height: "58px",
                    textShadow: "none",
                    wordBreak: "break-word",
                  }}
                  placeholder={`Nhập @, tin nhắn tới ${formatPlaceholderName(
                    room,
                    selectedGroupMessaging,
                  )}`}
                >
                  {(text) => {
                    if (!mentions?.length) return text;

                    const result = [];
                    let lastIndex = 0;

                    const sortedMentions = [...mentions].sort(
                      (a, b) => a.start - b.start,
                    );

                    sortedMentions.forEach((m) => {
                      // guard CHỈ để tránh crash, KHÔNG validate text
                      if (
                        m.start < lastIndex ||
                        m.start < 0 ||
                        m.end > text.length
                      ) {
                        return;
                      }

                      result.push(text.slice(lastIndex, m.start));

                      result.push(
                        <span
                          key={m.key} // ✅ identity ổn định
                          className="mention"
                          data-id={m.userId}
                        >
                          {text.slice(m.start, m.end)}
                        </span>,
                      );

                      lastIndex = m.end;
                    });

                    result.push(text.slice(lastIndex));
                    return result;
                  }}
                </RichTextarea>
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
              {isShowMessageError}
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
              <div>Ảnh</div>
              <i
                className="fa-solid fa-xmark"
                onClick={() => {
                  setIsShowOverlayModalDetailImage(false);
                  setIsShowContainerImageList(!isMobile);
                }}
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
                    setIsShowContainerImageList(!isMobile);
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
                  src={messageSelected?.photoURL?.thumbnail}
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
        {isShowOverlayUserInfoModal && (
          <ModalAccount
            setIsShowOverlayModal={setIsShowOverlayUserInfoModal}
            accountSelected={viewUserDetail}
            isShowOverlayModal={isShowOverlayUserInfoModal}
            setIsShowOverlayModalAddFriend={setIsShowOverlayModalAddFriend}
          />
        )}
        {isShowOverlayModalAddFriend && (
          <ModalAddFriend
            setIsShowOverlayModalAddFriend={setIsShowOverlayModalAddFriend}
            fullInfoUser={viewUserDetail}
            setIsShowOverlayModal={setIsShowOverlayModal}
          />
        )}
      </S.Container>
    </S.Wrapper>
  );
};

export default BoxChatGroup;
