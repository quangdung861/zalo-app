import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";
import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
  serverTimestamp,
  startAfter,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "firebaseConfig";
import moment from "moment";
import { PAGE_SIZE } from "constants/public";
import Loading from "components/Loading";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const uid = user?.uid;

  const initialState = {
    strangerList: [],
    keywords: "",
    userInfo: null,
    selectedUserMessaging: {},
    selectedGroupMessaging: {},
    room: {},
    rooms: [],
    loadingCount: 0,
    lastDoc: null,
    hasMore: true,
  };

  const [strangerList, setStrangerList] = useState(initialState.strangerList);
  const [keywords, setKeywords] = useState(initialState.keywords);
  const [userInfo, setUserInfo] = useState(initialState.userInfo);
  const [selectedUserMessaging, setSelectedUserMessaging] = useState(
    initialState.selectedUserMessaging,
  );
  const [selectedGroupMessaging, setSelectedGroupMessaging] = useState(
    initialState.selectedGroupMessaging,
  );
  const [room, setRoom] = useState(initialState.room);
  const [rooms, setRooms] = useState(initialState.rooms);
  const [loadingCount, setLoadingCount] = useState(initialState.loadingCount);
  const [lastDoc, setLastDoc] = useState(initialState.lastDoc);
  const [hasMore, setHasMore] = useState(initialState.hasMore);
  const [totalUnread, setTotalUnread] = useState(0);

  const resetAppState = () => {
    setStrangerList([]);
    setKeywords("");
    setUserInfo(null);
    setSelectedUserMessaging({});
    setSelectedGroupMessaging({});
    setRoom({});
    setRooms([]);
    setLoadingCount(0);
    setLastDoc(null);
    setHasMore(true);
  };

  const loading = loadingCount > 0;

  const startLoading = () => {
    setLoadingCount((c) => c + 1);
  };

  const stopLoading = () => {
    setTimeout(() => {
      setLoadingCount((c) => Math.max(0, c - 1));
    }, 300);
  };

  useEffect(() => {
    if (userInfo?.id) {
      const docRef = doc(db, "users", userInfo.id);
      updateDoc(docRef, {
        isOnline: {
          value: true,
          updatedAt: serverTimestamp(),
        },
      });
    }

    if (!userInfo?.notificationDowloadZaloPc?.updatedAt) return;

    const previousTime = moment(
      userInfo.notificationDowloadZaloPc.updatedAt.toDate(),
    );

    const hoursDifference = moment
      .duration(moment().diff(previousTime))
      .asHours();

    if (hoursDifference <= 1) return;

    const docRef = doc(db, "users", userInfo.id);

    setDoc(
      docRef,
      {
        notificationDowloadZaloPc: {
          value: true,
          updatedAt: serverTimestamp(),
        },
      },
      { merge: true },
    );
  }, [userInfo?.id]);

  useEffect(() => {
    let unSubcribe;

    if (!uid) {
      resetAppState();
      return;
    }

    try {
      const userInfoRef = query(
        collection(db, "users"),
        where("uid", "==", uid),
      );

      unSubcribe = onSnapshot(
        userInfoRef,
        (docsSnap) => {
          if (docsSnap.empty) {
            console.warn("⚠️ User document not found");
            setUserInfo(null);
            return;
          }

          const doc = docsSnap.docs[0];
          setUserInfo({
            ...doc.data(),
            id: doc.id,
          });
        },
        (error) => {
          console.error("🔥 onSnapshot userInfo error:", error);

          // permission error → reset state cho an toàn
          if (error.code === "permission-denied") {
            resetAppState();
          }
        },
      );
    } catch (error) {
      console.error("🔥 subscribe userInfo failed:", error);
      resetAppState();
    }

    return () => {
      if (unSubcribe) unSubcribe();
      resetAppState();
    };
  }, [uid]);

  useEffect(() => {
    if (!userInfo?.uid) {
      setStrangerList([]);
      return;
    }

    let cancelled = false; // 🔥 FLAG HỦY

    const getStrangerList = async () => {
      try {
        let strangerListRef;

        if (keywords) {
          strangerListRef = query(
            collection(db, "users"),
            where("keywords", "array-contains", keywords.toLowerCase()),
          );
        } else {
          strangerListRef = query(collection(db, "users"));
        }

        const response = await getDocs(strangerListRef);

        if (cancelled) return; // 🔥 logout rồi thì bỏ

        const documents = response.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        const uidFriends = [
          userInfo.uid,
          ...(userInfo.friends || []).map((f) => f.uid),
        ];

        const result = documents.filter(
          (item) => !uidFriends.includes(item.uid),
        );

        setStrangerList(result);
      } catch (error) {
        if (!cancelled && error.code !== "permission-denied") {
          console.error("🔥 getStrangerList error:", error);
        }
        setStrangerList([]);
      }
    };

    getStrangerList();

    return () => {
      cancelled = true; // 🔥 cleanup
    };
  }, [userInfo?.uid, userInfo?.friends, keywords]);

  useEffect(() => {
    if (!uid) return;

    try {
      const q = query(
        collection(db, "rooms"),
        where("members", "array-contains", uid),
        orderBy("messageLastest.clientCreatedAt", "desc"),
        limit(PAGE_SIZE),
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          try {
            const docs = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            if (docs.length < 1) setHasMore(false);

            setRooms(docs);
            setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
          } catch (err) {
            console.error("❌ Error processing snapshot:", err);
          }
        },
        (error) => {
          // ❗ BẮT LỖI QUERY / PERMISSION / INDEX
          console.error("🔥 Firestore onSnapshot error:", error);

          if (error.code === "permission-denied") {
            console.error("⛔ Không có quyền đọc rooms");
          }

          if (error.code === "failed-precondition") {
            console.error("⚠️ Thiếu index Firestore");
          }
        },
      );

      return () => unsubscribe();
    } catch (err) {
      // ❗ LỖI SYNTAX / KHỞI TẠO QUERY
      console.error("❌ Setup Firestore listener failed:", err);
    }
  }, [uid]);

  useEffect(() => {
    if (selectedUserMessaging.uidSelected) {
      const getRoom = async () => {
        const room = rooms.filter((item) =>
          selectedUserMessaging.uidSelected === "my-cloud"
            ? item.members.includes(selectedUserMessaging.uidSelected) &&
              item.category === "my cloud"
            : item.members.includes(selectedUserMessaging.uidSelected) &&
              item.category === "single",
        );

        if (room[0]) {
          setRoom(room[0]);
        } else {
          setRoom({});
        }
      };
      getRoom();
    }
  }, [selectedUserMessaging.uidSelected, rooms, userInfo]);

  useEffect(() => {
    if (!uid) {
      setTotalUnread(0);
      return;
    }

    try {
      const q = query(
        collection(db, "rooms"),
        where("unreadMembers", "array-contains", uid),
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          let sum = 0;
          snapshot.forEach((doc) => {
            sum += doc.data().unreadCount?.[uid] || 0;
          });
          setTotalUnread(sum);
        },
        (error) => {
          console.error("🔥 subscribe userInfo failed:", error);
        },
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("❌ Setup Firestore listener failed:", error);
    }
  }, [uid]);

  useEffect(() => {
    if (selectedGroupMessaging?.room?.id) {
      const getRoom = async () => {
        const room = rooms.filter(
          (item) => item.id === selectedGroupMessaging?.room?.id,
        );
        if (room[0]) {
          setRoom(room[0]);
        } else {
          setRoom({});
        }
      };
      getRoom();
    }
  }, [rooms, selectedGroupMessaging?.room?.id, userInfo]);

  const loadMoreRooms = async () => {
    if (!lastDoc) return 0;
    const roomsRef = query(
      collection(db, "rooms"),
      where("members", "array-contains", uid),
      orderBy("messageLastest.clientCreatedAt", "desc"),
      startAfter(lastDoc),
      limit(PAGE_SIZE),
    );

    const snap = await getDocs(roomsRef);

    const newRooms = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    setRooms((prev) => [...prev, ...newRooms]);
    setLastDoc(snap.docs[snap.docs.length - 1] || null);

    // Nếu số doc trả về < PAGE_SIZE => hết dữ liệu
    if (snap.docs.length < PAGE_SIZE) setHasMore(false);

    return newRooms.length;
  };

  const handleLogout = async () => {
    if (!userInfo?.id) return;

    const docRef = doc(db, "users", userInfo.id);
    startLoading();

    try {
      await updateDoc(docRef, {
        isOnline: {
          value: false,
          updatedAt: serverTimestamp(),
        },
      });
      await auth.signOut();
    } catch (error) {
      console.error("🔥 Logout error:", error);
    } finally {
      resetAppState();
      setUserInfo(null);
      stopLoading();
    }
  };

  return (
    <AppContext.Provider
      value={{
        handleLogout,
        userInfo,
        strangerList,
        setSelectedUserMessaging,
        selectedUserMessaging,
        setSelectedGroupMessaging,
        selectedGroupMessaging,
        room,
        setRoom,
        rooms,
        keywords,
        setKeywords,
        loadMoreRooms,
        hasMore,
        setHasMore,
        startLoading,
        stopLoading,
        totalUnread,
      }}
    >
      {children}
      {loading && <Loading />}
    </AppContext.Provider>
  );
};

export default AppProvider;
