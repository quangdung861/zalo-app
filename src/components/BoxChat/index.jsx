import React, { useContext, useState, useRef, useEffect } from "react";
import * as S from "./styles";
import {
  collection,
  query,
  where,
  addDoc,
  onSnapshot,
  doc,
  orderBy,
  getDoc,
  setDoc,
  getDocs,
  limit,
  startAfter,
  runTransaction,
  increment,
  updateDoc,
} from "firebase/firestore";
import { db } from "firebaseConfig";
import { addDocument } from "services";
import { useMediaQuery } from "react-responsive";
import { AppContext } from "Context/AppProvider";
import moment from "moment";
import messageSend from "assets/audio/messageSend.wav";
import data from "@emoji-mart/data/sets/14/facebook.json";
import Picker from "@emoji-mart/react";
import ModalAccount from "components/ModalAccount";
import { UserLayoutContext } from "layouts/user/UserLayout";
import suggestCloudImage from "assets/suggestCloudImage.png";
import ModalSharingMessage from "components/ModalSharingMessage";
import smileIcon from "assets/emoji/smile.png";
import heartIcon from "assets/emoji/heart.png";
import surpriseIcon from "assets/emoji/surprise.png";
import cryIcon from "assets/emoji/cry.png";
import angryIcon from "assets/emoji/angry.png";
import ModalAddFriend from "components/ModalAddFriend";
import BackgoundModal from "../../common/BackgoundModal/BackgoundModal";
import InfiniteScroll from "react-infinite-scroll-component";
import { PAGE_SIZE_MESSAGES } from "constants/public";
import { backgoundsDefault, BACKGROUND_DEFAULT } from "../../common/BackgoundModal/constants";
import { uploadImage } from "services/uploadImage";
import useClickOutside from "hooks/useClickOutside";


const BoxChat = () => {
  const isMobile = useMediaQuery({ maxWidth: 576 });
  const { userInfo, room, selectedUserMessaging, setRoom, startLoading, stopLoading } =
    useContext(AppContext);
  const { setIsShowBoxChat } = useContext(UserLayoutContext);

  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [isReplyMessage, setIsReplyMessage] = useState(false);
  const [infoReply, setInfoReply] = useState({});
  const [isShowContainerImageList, setIsShowContainerImageList] =
    useState(!isMobile);
  const [isShowDropdownOption, setIsShowDropdownOption] = useState(false);
  const [isShowMessageError, setIsShowMessageError] = useState(false);
  const [isShowAlertRecallRejectMessage, setIsShowAlertRecallRejectMessage] =
    useState(false);
  const [fullInfoUser, setFullInfoUser] = useState({});
  const [isShowOverlayModal, setIsShowOverlayModal] = useState(false);
  const [isShowOverlayModalDetailImage, setIsShowOverlayModalDetailImage] =
    useState(false);
  const [
    isShowOverlayModalSharingMessage,
    setIsShowOverlayModalSharingMessage,
  ] = useState(false);
  const [emojis, setEmojis] = useState();
  const [isRenderUserNameInEmojiList, setIsRenderUserNameInEmojiList] =
    useState(false);
  const [isShowOverlayModalEmotion, setIsShowOverlayModalEmotion] =
    useState(false);
  const [isShowOverlayModalAddFriend, setIsShowOverlayModalAddFriend] =
    useState(false);
  const [messages, setMessages] = useState([]);
  const [infoUsers, setInfoUsers] = useState();
  const [inputValue, setInputValue] = useState("");
  const [isShowBackgroundModal, setIsShowBackgroundModal] = useState(false);
  const [showBtnUpToTop, setShowBtnUpToTop] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [infoMessageSharing, setInfoMessageSharing] = useState({});
  const [clicked, setClicked] = useState("all");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [categoryUser, setCategoryUser] = useState({});
  const [messageSelected, setMessageSelected] = useState();
  const [imageFormat, setImageFormat] = useState({
    rotate: 0,
    scale: 1,
  });
  const [backgroundOriginalAll, setBackgroundOriginalAll] = useState("")
  const [currentIndex, setCurrentIndex] = useState(null);

  const pickerEmojiRef = useRef(null);
  const inputRef = useRef();
  const boxChatRef = useRef();
  const categoryRef = useRef();
  const imagesRef = useRef();
  const dropdownRef = useRef();
  const dropdownSelectEmoji = useRef();
  const emotionModal = useRef();

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

  useClickOutside(categoryRef, () => {
    setCategoryDropdown(false);
  });

  useClickOutside(dropdownSelectEmoji, () => {
    setEmojis(false);
  });

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

  useClickOutside(dropdownRef, () => {
    setIsShowDropdownOption(false);
  });

  useClickOutside(emotionModal, () => {
    setIsShowOverlayModalEmotion(false);
    setClicked("all");
  });

  useEffect(() => {
    if (inputRef) {
      inputRef.current.focus();
    }
    setInputValue('');
    setHasMore(true);
    setLastDoc(null)
  }, [room.id]);

  useEffect(() => {
    const clearUnreadCount = async () => {
      if (room?.id && userInfo?.uid) {
        const newUnreadMembers = [...room.unreadMembers].filter(uid => uid !== userInfo.uid);
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

    clearUnreadCount();
  }, [room.totalMessages]);

  useEffect(() => {
    let unSubcribe;

    try {
      const q = query(
        collection(db, "messages"),
        where("roomId", "==", room.id),
        orderBy("clientCreatedAt", "desc"),
        limit(PAGE_SIZE_MESSAGES)
      );

      unSubcribe = onSnapshot(
        q,
        (docsSnap) => {
          const documents = docsSnap.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            };
          });

          setMessages(documents);
          setLastDoc(docsSnap.docs.at(-1) || null);
        },
        (error) => {
          console.error("🔥 onSnapshot messages error:", error);
        }
      );
    } catch (error) {
      console.log(error);
    }
    const chatWindow = boxChatRef?.current;
    if (chatWindow) {
      setTimeout(() => {
        chatWindow.scrollTo({
          top: chatWindow.scrollHeight,
          behavior: "auto",
        });
      }, 100);
    }

    return () => {
      if (unSubcribe) unSubcribe();
    };
  }, [room?.id]);

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
          user =>
            user.isOnline?.value === true &&
            user.uid !== userInfo.uid &&
            !lastMsg.receivedBy?.[user.uid]
        );

        if (arrOnline?.length) {
          const receivedUpdates = {};

          arrOnline.forEach(user => {
            receivedUpdates[`messageLastest.receivedBy.${user.uid}`] =
              Date.now();
          });

          await updateDoc(doc(db, "rooms", room.id), receivedUpdates);
        }
      }

      // ======================
      // 2️⃣ SEEN (chỉ receiver làm)
      // ======================
      if (
        lastMsg.uid !== userInfo.uid &&
        !lastMsg.seenBy?.[userInfo.uid]
      ) {
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
    if (messages.length > 0 && userInfo?.uid) {
      const allUser = messages.map((item) => item.uid);
      var uniqueArr = [...new Set(allUser)];

      const fetchData = async () => {
        startLoading();
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
        stopLoading();
      };
      fetchData();
    }
  }, [messages, userInfo?.uid]);

  useEffect(() => {
    let unSubcribe;
    if (selectedUserMessaging?.uidSelected) {
      const fullInfoUserMessagingRef = query(
        collection(db, "users"),
        where("uid", "==", selectedUserMessaging.uidSelected)
      );

      unSubcribe = onSnapshot(fullInfoUserMessagingRef, (docsSnap) => {
        const documents = docsSnap.docs.map((doc) => {
          const id = doc.id;
          const data = doc.data();
          return {
            ...data,
            id: id,
          };
        });
        setFullInfoUser(documents[0]);
      },
        (error) => {
          console.error("🔥 onSnapshot messages error:", error);
        });
    }
    return () => unSubcribe && unSubcribe();
  }, [selectedUserMessaging?.uidSelected]);

  useEffect(() => {
    // focus to input again after submit
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      });
    }
  }, []);

  useEffect(() => {
    const infoFriend = userInfo.friends.find(
      (item) => item.uid === selectedUserMessaging.uidSelected
    );

    const categoryResult = userInfo.categoriesTemplate.find(
      (item) => item.name === infoFriend?.category
    );

    setCategoryUser(categoryResult);
  }, [selectedUserMessaging, userInfo]);

  useClickOutside(pickerEmojiRef, () => {
    setShowEmojiPicker(false);
  });

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  useEffect(() => {
    setImageFormat({
      rotate: 0,
      scale: 1,
    });
  }, [messageSelected]);

  useEffect(() => {
    initInfoBackground();
  }, [room, userInfo.uid]);

  const handleScroll = () => {
    const chatWindow = boxChatRef?.current;
    if (chatWindow) {
      const isNearTop = Math.abs(chatWindow.scrollTop) < 200;
      setShowBtnUpToTop(!isNearTop)
    }
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

  const handleUpToBottom = () => {
    const chatWindow = boxChatRef?.current;
    chatWindow.scrollTo({
      top: chatWindow.scrollHeight,
      behavior: "smooth",
    });
  };

  const isFriend = userInfo.friends.findIndex(
    (item) => item.uid === selectedUserMessaging.uidSelected
  );

  const isReceive = userInfo.invitationReceive.find(
    (item) => item.uid === selectedUserMessaging.uidSelected
  );
  const isSent = userInfo.invitationSent.find(
    (item) => item.uid === selectedUserMessaging.uidSelected
  );

  const handleKeyDown = (imgList, e) => {
    if (e?.key === "Enter") {
      if (!e?.isPreventDefault) {
        e.preventDefault();
      }
      if (inputValue || imgList[0]) {
        if (room.id) { // Đã có room
          audio.play();
          const createMes = async () => {
            await runTransaction(db, async (tx) => {
              const roomRef = doc(db, "rooms", room.id);
              const msgRef = doc(collection(db, "messages"));

              const roomSnap = await tx.get(roomRef);
              if (!roomSnap.exists()) throw new Error("Room not found");

              const roomData = roomSnap.data();
              const members = roomData.members || [];

              const newUnreadCount = {};
              members.forEach(uid => {
                newUnreadCount[uid] =
                  uid === userInfo.uid ? 0 : (roomData.unreadCount?.[uid] || 0) + 1;
              });

              tx.update(roomRef, {
                messageLastest: {
                  text: inputValue || "Hình ảnh",
                  displayName: userInfo.displayName,
                  uid: userInfo.uid,
                  receivedBy: null,
                  seenBy: null,
                  clientCreatedAt: Date.now(),
                },
                totalMessages: (roomData.totalMessages || 0) + 1,
                unreadCount: newUnreadCount,
                hideTemporarily: [],
              }
              );

              tx.set(msgRef, {
                roomId: room.id,
                uid: userInfo.uid,
                text: inputValue || "",
                images: imgList || [],
                infoReply: infoReply,
                clientCreatedAt: Date.now(),
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
            });
          };
          createMes();
        } else { // Chưa có room
          const createRoomAndMes = async () => {
            try {
              startLoading();
              const roomPayload = {
                category: "single",
                members: [userInfo.uid, selectedUserMessaging.uidSelected],
                messageLastest: {
                  text: inputValue || (imgList && "Hình ảnh"),
                  displayName: userInfo.displayName,
                  uid: userInfo.uid,
                  receivedBy: null,
                  seenBy: null,
                  clientCreatedAt: Date.now(),
                },
                totalMessages: 1,
                unreadCount: {
                  [userInfo.uid]: 0,
                  [selectedUserMessaging.uidSelected]: 1,
                },
                unreadMembers: [selectedUserMessaging.uidSelected],
                deleted: [],
                hideTemporarily: [],
                clientCreatedAt: Date.now(),
              }

              const roomRef = await addDocument("rooms", roomPayload);
              const roomId = roomRef.id; // 🔥 ID Ở ĐÂY

              if (roomId) {
                await addDocument("messages", {
                  category: "single",
                  roomId: roomId,
                  uid: userInfo.uid,
                  text: inputValue,
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
                  clientCreatedAt: Date.now(),
                });

                setRoom(prev => prev?.roomId === roomId ? prev : { id: roomId, ...roomPayload });
              } else {
                console.log("false");
              }
            } catch (error) {
              console.error("Error creating room:", error);
            } finally {
              stopLoading();
            }
          };

          createRoomAndMes();
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

  const handleClickSentMessage = async () => {
    if (!inputValue) return;

    audio.play();
    startLoading();

    try {
      // ==============================
      // CASE 1: ROOM ĐÃ TỒN TẠI
      // ==============================
      if (room?.id) {
        const roomRef = doc(db, "rooms", room.id);

        await runTransaction(db, async (transaction) => {
          const snap = await transaction.get(roomRef);
          if (!snap.exists()) return;

          const roomData = snap.data();
          const members = roomData.members || [];
          const unreadCount = roomData.unreadCount || {};

          const newUnreadMembers = [...members].filter(uid => uid !== userInfo.uid);
          const nextUnread = { ...unreadCount };

          members.forEach((uid) => {
            if (uid === userInfo.uid) {
              nextUnread[uid] = 0;
            } else {
              nextUnread[uid] = (nextUnread[uid] || 0) + 1;
            }
          });

          transaction.set(
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
              totalMessages: increment(1),
              unreadCount: nextUnread,
              unreadMembers: newUnreadMembers,
              hideTemporarily: [],
              clientCreatedAt: Date.now(),
            },
            { merge: true }
          );
        });

        await addDocument("messages", {
          category: "single",
          roomId: room.id,
          uid: userInfo.uid,
          text: inputValue,
          images: [],
          infoReply,
          clientCreatedAt: Date.now(),
          emojiList: [
            { id: "smile", uids: [] },
            { id: "heart", uids: [] },
            { id: "surprise", uids: [] },
            { id: "cry", uids: [] },
            { id: "angry", uids: [] },
          ],
        });
      }

      // ==============================
      // CASE 2: CHƯA CÓ ROOM → TẠO MỚI
      // ==============================
      else {
        const members = [userInfo.uid, selectedUserMessaging.uidSelected];

        const roomRef = await addDoc(collection(db, "rooms"), {
          category: "single",
          members,
          messageLastest: {
            text: inputValue,
            displayName: userInfo.displayName,
            uid: userInfo.uid,
            receivedBy: null,
            seenBy: null,
            clientCreatedAt: Date.now(),
          },
          clientCreatedAt: Date.now(),
          totalMessages: 1,
          unreadCount: {
            [userInfo.uid]: 0,
            [selectedUserMessaging.uidSelected]: 1,
          },
          unreadMembers: [selectedUserMessaging.uidSelected],
          deleted: [],
          hideTemporarily: [],
        });

        const response = await getDoc(roomRef);
        if (response.exists()) {
          setRoom({ id: response.id, ...response.data() });

          await addDocument("messages", {
            category: "single",
            roomId: response.id,
            uid: userInfo.uid,
            text: inputValue,
            images: [],
            infoReply,
            emojiList: [
              { id: "smile", uids: [] },
              { id: "heart", uids: [] },
              { id: "surprise", uids: [] },
              { id: "cry", uids: [] },
              { id: "angry", uids: [] },
            ],
            clientCreatedAt: Date.now(),
          });
        }
      }
    } catch (err) {
      console.error("Send message error:", err);
    } finally {
      stopLoading();

      // reset UI
      setIsReplyMessage(false);
      setInfoReply({});
      setInputValue("");

      if (inputRef?.current) {
        setTimeout(() => inputRef.current.focus());
      }

      const chatWindow = boxChatRef?.current;
      setTimeout(() => {
        chatWindow?.scrollTo({
          top: chatWindow.scrollHeight,
          behavior: "smooth",
        });
      }, 200);
    }
  };




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
      limit(PAGE_SIZE_MESSAGES)
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

  const handleRecallMessage = async ({ id, clientCreatedAt }) => {
    const now = moment();
    const date = moment(clientCreatedAt);

    const diffSeconds = now.diff(date, "seconds");

    startLoading();
    setIsShowDropdownOption(false);

    if (diffSeconds < 30) {
      const messageRef = doc(db, "messages", id);

      await setDoc(
        messageRef,
        { isRecall: true },
        { merge: true }
      );

      stopLoading();
      return;
    }

    setIsShowAlertRecallRejectMessage(true);
    setTimeout(() => {
      setIsShowAlertRecallRejectMessage(false);
    }, 3000);

    stopLoading();
  };

  const handleSharingMessage = ({ infoMessage }) => {
    let infoSend = {
      text: infoMessage.text,
      images: infoMessage.images,
    };
    setInfoMessageSharing(
      infoSend
    );
    setIsShowOverlayModalSharingMessage(true);
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
      }
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
    })

    const myData = emojiList.find((item) => item.id === id);

    const myDataIndex = myData.uids.findIndex(
      (item) => item.uid === userInfo.uid
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
        }
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
        }
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
      }
    );
    stopLoading();
    setEmojis();
  };

  function startOfDay(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function getDateLabel(clientCreatedAt) {
    const msgDate = startOfDay(clientCreatedAt);
    const today = startOfDay(new Date());

    const diffDays =
      (today - msgDate) / (1000 * 60 * 60 * 24);

    if (diffDays === 0) return "Hôm nay";
    if (diffDays === 1) return "Hôm qua";

    const sameYear =
      msgDate.getFullYear() === today.getFullYear();

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

    return (
      startOfDay(new Date(current.clientCreatedAt)).getTime() !==
      startOfDay(new Date(next.clientCreatedAt)).getTime()
    );
  }

  const getGroupMessageStatus = (room, userInfo) => {
    if (room?.messageLastest?.uid !== userInfo.uid) return;
    const isMe = room.messageLastest.uid === userInfo.uid;
    if (isMe) {
      if (Object.keys(room.messageLastest.seenBy || {}).length) {
        return {
          type: "seen",
          text: <span><i className="fa-solid fa-check"></i> <i className="fa-solid fa-check"></i> &nbsp;Đã xem</span>
        };
      }
      if (Object.keys(room.messageLastest.receivedBy || {}).length) {
        return {
          type: "received",
          text: <span><i className="fa-solid fa-check"></i> &nbsp;Đã nhận</span>
        };
      }
      return {
        type: "sent",
        text: <span>Đã gửi</span>
      };
    }
  };

  const renderMessages = () => {
    return messages?.map((item, index) => {
      const infoDeleted = room.deleted?.find(
        (item) => item.uid === userInfo.uid
      );

      if (infoDeleted) {
        const formatDate = moment(item.clientCreatedAt)

        if (formatDate < infoDeleted?.clientCreatedAt) {
          return null;
        }
      }

      const newInfoUser = infoUsers?.find(
        (infoUser) => infoUser.uid === item.uid
      );

      if (item.isDeleted?.includes(userInfo.uid)) {
        return undefined;
      }

      const nextMsg = messages[index + 1];
      const showLabel = shouldShowLabel(item, nextMsg);
      const label = getDateLabel(item.clientCreatedAt);

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


      let statusMsg = null
      if (index === 0) {
        statusMsg = getGroupMessageStatus(room, userInfo);
      }

      let total = 0;

      item?.emojiList?.forEach((element) => {
        element.uids.forEach((uidItem) => {
          total = total + uidItem.quantity;
        });
      });

      const isNewest = item?.emojiList?.find((emoji) =>
        emoji.uids.find((item) => item.uid === userInfo.uid && item.isNewest)
      );

      //

      const sortedEmojiList = item?.emojiList?.sort((a, b) => {
        const sumQuantityA = a.uids.reduce(
          (total, uid) => total + uid.quantity,
          0
        );
        const sumQuantityB = b.uids.reduce(
          (total, uid) => total + uid.quantity,
          0
        );

        return sumQuantityB - sumQuantityA; // Sắp xếp theo thứ tự giảm dần
      });

      //

      const lastIndex = messages.reduce((lastIndex, element, index) => {
        if (element.uid !== userInfo.uid) {
          return index; // Lưu lại chỉ mục của phần tử thỏa mãn điều kiện
        }
        return lastIndex; // Nếu không tìm thấy, trả về giá trị trước đó
      }, -1);

      //

      const userInEmojiList = [];

      sortedEmojiList?.forEach((item) =>
        item.uids.forEach((uid) => userInEmojiList.push(uid.uid))
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
                  <img src={data.photoURL.thumbnail} alt="" />
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
                      )
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
        });
      };

      return (
        <React.Fragment key={item.id}>
          <div
            className="message-item"
            onMouseLeave={() => setEmojis()}
          >
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
                          className={`filter-category-item ${clicked === "all" ? "clicked" : ""
                            }`}
                          onClick={() => setClicked("all")}
                        >
                          Tất cả {total}
                          <div
                            className={`dividing-bottom ${clicked === "all" ? "clicked" : ""
                              }`}
                          ></div>
                        </div>
                        {sortedEmojiList.map(
                          (emoji) =>
                            emoji.uids[0] && (
                              <div
                                className={`filter-category-item ${clicked === emoji.id ? "clicked" : ""
                                  }`}
                                key={emoji.id}
                                onClick={() => setClicked(emoji.id)}
                              >
                                <img
                                  src={
                                    dataIconEmoji.find(
                                      (item) => item.id === emoji.id
                                    ).src
                                  }
                                  alt=""
                                />
                                {emoji.uids.reduce(
                                  (accumulator, currentValue) =>
                                    accumulator + currentValue.quantity,
                                  0
                                )}
                                <div
                                  className={`dividing-bottom ${clicked === emoji.id ? "clicked" : ""
                                    }`}
                                ></div>
                              </div>
                            )
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
                          bottom: messages.length - 1 === index ? "46px" : "auto",
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
                        {item.text}
                      </>
                    ) : (
                      <span
                        style={{ color: "rgba(0,0,0,0.3)", userSelect: "none" }}
                      >
                        Tin nhắn đã được thu hồi
                      </span>
                    )}

                    <div className="box-date">
                      <div className="format-date-message">{CREATEDAT_URL}</div>
                    </div>
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
                                  (item) => item.id === isNewest.id
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
                                        (item) => item.id === emoji.id
                                      ).src
                                    }
                                    alt=""
                                  />
                                )
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
                            onClick={() => handleRemoveEmojis({ message: item })}
                          ></i>
                        </div>
                      )}
                    </div>
                  </div>
                  {index === 0 && <div className="status-msg">
                    {statusMsg?.text}
                  </div>}
                </div>
              </div>
            ) : (
              <div className="message-item__other">
                <div className="box-image">
                  <img
                    src={newInfoUser?.photoURL?.thumbnail}
                    alt=""
                    className="avatar"
                    onClick={() => setIsShowOverlayModal(true)}
                  />
                  <div className="text">
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
                        {item.text}
                      </>
                    ) : (
                      <span
                        style={{ color: "rgba(0,0,0,0.3)", userSelect: "none" }}
                      >
                        Tin nhắn đã được thu hồi
                      </span>
                    )}

                    <div className="box-date">
                      <div className="format-date-message">{CREATEDAT_URL}</div>
                    </div>
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
                                  (item) => item.id === isNewest.id
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
                                        (item) => item.id === emoji.id
                                      ).src
                                    }
                                    alt=""
                                  />
                                )
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
                            onClick={() => handleRemoveEmojis({ message: item })}
                          ></i>
                        </div>
                      )}
                    </div>
                    {isRenderUserNameInEmojiList === item.id && (
                      <div
                        className="dropdown-username-reaction"
                        style={{
                          bottom: messages.length - 1 === index ? "46px" : "auto",
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



  // Hàm xử lý sự kiện khi bấm nút hiển thị/ẩn bảng chọn emoji
  const handleToggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  // Hàm xử lý sự kiện khi chọn emoji từ bảng chọn
  const handleSelectEmoji = (emoji) => {
    setInputValue(inputValue + emoji.native);
  };



  const handleCategoryUser = async (value) => {
    const friendIndex = userInfo.friends.findIndex(
      (item) => item.uid === selectedUserMessaging.uidSelected
    );

    const newFriends = userInfo.friends;

    if (userInfo.friends[friendIndex].category === value) {
      newFriends.splice(friendIndex, 1, {
        uid: selectedUserMessaging.uidSelected,
        category: "",
      });

      const userInfoRef = doc(db, "users", userInfo.id);
      startLoading();
      await setDoc(
        userInfoRef,
        {
          friends: newFriends,
        },
        {
          merge: true,
        }
      );
      stopLoading();
      return;
    }

    newFriends.splice(friendIndex, 1, {
      uid: selectedUserMessaging.uidSelected,
      category: value,
    });

    const userInfoRef = doc(db, "users", userInfo.id);
    startLoading();
    await setDoc(
      userInfoRef,
      {
        friends: newFriends,
      },
      {
        merge: true,
      }
    );
    stopLoading();
    setCategoryDropdown(false);
  };

  const date = moment(
    fullInfoUser?.isOnline?.updatedAt?.seconds * 1000
  )?.fromNow();

  const handleComeBack = () => {
    setIsShowBoxChat(false);
  };

  const showError = (message) => {
    setIsShowMessageError(message);
    setTimeout(function () {
      setIsShowMessageError(false);
    }, 3000);
  }

  const MAX_FILES = 10;
  const MAX_FILE_SIZE = 10 * 1024 * 1024;   // 10MB
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
    if (files.some(file => file.size > MAX_FILE_SIZE)) {
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
      const imgList = await Promise.all(
        files.map(file => uploadImage(file))
      );

      // 5️⃣ Fake Enter để gửi message
      handleKeyDown(imgList, {
        key: "Enter",
        isPreventDefault: true,
      });

    } catch (error) {
      console.error(error);
      showError("Upload ảnh thất bại, vui lòng thử lại");
    } finally {
      stopLoading();
      event.target.value = ""; // reset input
    }
  };

  const renderContainerImages = () => {
    return messages.map((item) => {
      const newInfoUser = infoUsers?.find(
        (infoUser) => infoUser.uid === item.uid
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

  const handleOpenModalAddFriend = () => {
    setIsShowOverlayModalAddFriend(true);
  };

  const handleInvitationApprove = async () => {
    const { uid, invitationSent, id, friends } = fullInfoUser;
    const newInvitationSent = invitationSent.filter(
      (item) => item.uid !== userInfo.uid
    );
    const strangerRef = doc(db, "users", id);
    startLoading();
    await setDoc(
      strangerRef,
      {
        friends: [{ uid: userInfo.uid, category: "" }, ...friends],
        invitationSent: newInvitationSent,
      },
      {
        merge: true,
      }
    );
    //
    const newInvitationReceive = userInfo.invitationReceive.filter(
      (item) => item.uid !== uid
    );
    const userInfoRef = doc(db, "users", userInfo.id);
    await setDoc(
      userInfoRef,
      {
        friends: [{ uid, category: "" }, ...userInfo.friends],
        invitationReceive: newInvitationReceive,
      },
      {
        merge: true,
      }
    );
    stopLoading();
  };

  const userBackground =
    room.settings?.backgroundMembers?.[userInfo.uid]?.background;

  const backgrounds = [
    ...(userBackground ? [userBackground] : []),
    ...backgoundsDefault,
  ];

  const initInfoBackground = () => {
    const index =
      room?.settings?.backgroundMembers?.[userInfo.uid]?.currentIndex;

    if (typeof index === "number") {
      setCurrentIndex(index);
    } else { // null or undefined
      if (room?.settings?.background?.original) {
        setCurrentIndex(null)
        setBackgroundOriginalAll(room?.settings?.background?.original);
      } else {
        setCurrentIndex(BACKGROUND_DEFAULT);
      }
    }
  }

  return (
    <S.Wrapper>
      <S.Container
        isCloud={
          selectedUserMessaging.uidSelected === "my-cloud" ? true : false
        }
        isReplyMessage={isReplyMessage}
        isSuggest={isFriend}
        background={typeof currentIndex === "number" ? backgrounds?.[currentIndex]?.original : backgroundOriginalAll}
      >
        <div className="box-chat">
          <div className="box-chat__header">
            <div className="left">
              <div className="btn-come-back" onClick={() => handleComeBack()}>
                <i className="fa-solid fa-chevron-left"></i>
              </div>
              <div className="avatar">
                <img
                  src={selectedUserMessaging?.photoURLSelected?.thumbnail}
                  alt=""
                  onClick={() => setIsShowOverlayModal(true)}
                />
                {fullInfoUser?.isOnline?.value && (
                  <i className="fa-solid fa-circle"></i>
                )}
              </div>
              <div className="user-info">
                <div className="display-name"
                  onClick={() => setIsShowOverlayModal(true)}
                >
                  {selectedUserMessaging?.displayNameSelected}
                </div>

                <div className="last-time">
                  {selectedUserMessaging.uidSelected === "my-cloud" ? (
                    <>Lưu và đồng bộ dữ liệu giữa các thiết bị</>
                  ) : isFriend !== -1 ? (
                    <>
                      <>
                        {fullInfoUser?.isOnline?.value ? (
                          <div className="online">
                            <span>Vừa truy cập</span>
                          </div>
                        ) : (
                          <div className="offline">
                            <span>Truy cập {date} </span>
                          </div>
                        )}{" "}
                      </>
                      <span className="new-seperator"></span>
                      <div className="category">
                        {categoryUser ? (
                          <div
                            style={{ cursor: "pointer" }}
                            onClick={() => setCategoryDropdown(true)}
                          >
                            <i
                              className="fa-solid fa-bookmark category-icon"
                              style={{
                                color: categoryUser.color,
                                marginRight: "8px",
                              }}
                            ></i>
                            <span
                              style={{
                                color: categoryUser.color,
                              }}
                            >
                              {categoryUser.name}
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
                            {userInfo?.categoriesTemplate?.map(
                              (item, index) => (
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
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div
                      style={{
                        backgroundColor: "#B1B5B9",
                        color: "#fff",
                        padding: "0px 6px",
                        fontSize: "12px",
                        borderRadius: "3px",
                        height: "20px",
                        lineHeight: "20px",
                      }}
                    >
                      Người lạ
                    </div>
                  )}
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
              {(room.category !== "my cloud" && isFriend !== -1 && room.id) && <div className="box-icon" onClick={() => setIsShowBackgroundModal(true)} >
                <i className="fa-solid fa-paintbrush"></i>
              </div>}
            </div>
            {isShowBackgroundModal && <BackgoundModal text="Đổi hình nền cho cả hai bên" initInfoBackground={initInfoBackground} backgrounds={backgrounds} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} uid={userInfo.uid} members={room.members} roomId={room.id} setIsShowBackgroundModal={setIsShowBackgroundModal} />}
          </div>
          <div className="container-content" >
            {isFriend === -1 &&
              !isSent &&
              !isReceive &&
              selectedUserMessaging.uidSelected !== "my-cloud" ? (
              <div
                className="suggest-add-friend"
                style={{ userSelect: "none" }}
              >
                <div className="left">
                  <i className="fa-solid fa-user-plus icon"></i>
                  <span>Gửi yêu cầu kết bạn đến người này</span>
                </div>
                <div className="right">
                  <div
                    className="btn-add-friend"
                    onClick={() => handleOpenModalAddFriend()}
                  >
                    Gửi kết bạn
                  </div>
                  <div className="btn-more"></div>
                </div>
              </div>
            ) : isSent && selectedUserMessaging.uidSelected !== "my-cloud" ? (
              <div
                className="suggest-add-friend"
                style={{ justifyContent: "center", userSelect: "none" }}
              >
                <span style={{ color: "#7589a3", userSelect: "none" }}>
                  Đã gửi yêu cầu kết bạn
                </span>
              </div>
            ) : (
              isReceive &&
              selectedUserMessaging.uidSelected !== "my-cloud" && (
                <div
                  className="suggest-add-friend"
                  style={{ userSelect: "none" }}
                >
                  <div className="left">
                    <i className="fa-solid fa-user-plus icon"></i>
                    <span>Đang chờ được đồng ý kết bạn</span>
                  </div>
                  <div className="right">
                    <div
                      className="btn-add-friend"
                      style={{ color: "#005ae0", backgroundColor: "#E5EFFF" }}
                      onClick={() => handleInvitationApprove()}
                    >
                      Đồng ý
                    </div>
                  </div>
                </div>
              )
            )}
            <div id="parentScrollDiv-boxchat" className="box-chat__content" ref={boxChatRef}>
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
                  {selectedUserMessaging.uidSelected !== "my-cloud" && (
                    <>
                      <img
                        src={selectedUserMessaging.photoURLSelected?.thumbnail}
                        alt=""
                        className="user-info__avatar"
                        onClick={() => setIsShowOverlayModal(true)}
                      />
                      <div className="user-info__name">
                        {selectedUserMessaging.displayNameSelected}
                      </div>
                    </>
                  )}

                  {userInfo.friends.find(
                    (item) => item.uid === selectedUserMessaging.uidSelected
                  ) ? (
                    <div className="user-info__description">
                      {selectedUserMessaging.displayNameSelected} là bạn bè của bạn
                      trên Zalo
                    </div>
                  ) : selectedUserMessaging.uidSelected === "my-cloud" ? (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <div
                        style={{
                          maxWidth: "380px",
                          padding: "14px",
                          borderRadius: "8px",
                          backgroundColor: "#F5F9FC",
                          margin: "20px 12px 20px"
                        }}
                      >
                        <img
                          src={suggestCloudImage}
                          alt=""
                          style={{ width: "100%", marginBottom: "12px" }}
                        />
                        <div
                          className="user-info__description"
                          style={{ padding: "0 40px", fontSize: "13px" }}
                        >
                          Dữ liệu trong Cloud của tôi được lưu trữ và đồng bộ giữa các
                          thiết bị của bạn.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="user-info__description">
                      {selectedUserMessaging.displayNameSelected} không phải bạn bè
                      của bạn trên Zalo
                    </div>
                  )}
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
                  onClick={(e) => (e.target.value = null)}
                  style={{ display: "none" }}
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

                <textarea
                  className="input-message-text"
                  type="text"
                  // style={{ textTransform: "capitalize" }}z
                  autoComplete="off"
                  spellCheck="false"
                  placeholder={`Nhắn tin tới ${selectedUserMessaging.displayNameSelected?.length < 40
                    ? selectedUserMessaging?.displayNameSelected
                    : selectedUserMessaging?.displayNameSelected?.slice(
                      0,
                      39
                    ) + "..."
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
          <ModalAccount
            setIsShowOverlayModal={setIsShowOverlayModal}
            accountSelected={
              fullInfoUser ? fullInfoUser : { myCloud: selectedUserMessaging }
            }
            isShowOverlayModal={isShowOverlayModal}
            setIsShowOverlayModalAddFriend={setIsShowOverlayModalAddFriend}
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
        {isShowOverlayModalAddFriend && (
          <ModalAddFriend
            setIsShowOverlayModalAddFriend={setIsShowOverlayModalAddFriend}
            fullInfoUser={fullInfoUser}
            setIsShowOverlayModal={setIsShowOverlayModal}
          />
        )}
      </S.Container>
    </S.Wrapper>
  );
};

export default BoxChat;
