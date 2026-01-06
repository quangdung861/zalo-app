import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthContext } from "./AuthProvider";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
  serverTimestamp,
  startAfter,
} from "firebase/firestore";
import { db } from "firebaseConfig";
import moment from "moment";
import { generateKeywords } from "services";
import { PAGE_SIZE } from "constants/public";
import Loading from "components/Loading";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const {
    user: { uid },
  } = useContext(AuthContext);

  const [strangerList, setStrangerList] = useState([]);
  const [keywords, setKeywords] = useState("");
  const [userInfo, setUserInfo] = useState();
  const [selectedUserMessaging, setSelectedUserMessaging] = useState({});
  const [selectedGroupMessaging, setSelectedGroupMessaging] = useState({});
  const [room, setRoom] = useState({});
  const [rooms, setRooms] = useState([]);
  const [loadingCount, setLoadingCount] = useState(0);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

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
      setDoc(
        docRef,
        {
          isOnline: {
            value: true,
            updatedAt: serverTimestamp(),
          },
        },
        {
          merge: true,
        }
      );
    }

    if (!userInfo?.notificationDowloadZaloPc?.updatedAt) return;

    const previousTime = moment(
      userInfo.notificationDowloadZaloPc.updatedAt.toDate()
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
      { merge: true }
    );
  }, [userInfo?.id]);

  useEffect(() => {
    let unSubcribe;
    if (uid) {
      const userInfoRef = query(
        collection(db, "users"),
        where("uid", "==", uid)
      );
      unSubcribe = onSnapshot(userInfoRef, (docsSnap) => {
        const documents = docsSnap.docs.map((doc) => {
          const id = doc.id;
          const data = doc.data();
          return {
            ...data,
            id: id,
          };
        });
        setUserInfo(documents[0]);
      });
    }
    return () => {
      unSubcribe && unSubcribe();
    };
  }, [uid]);

  useEffect(() => {
    if (userInfo?.friends) {
      const getStrangerList = async () => {
        // Nơi add thêm trường dữ liệu mới - sau khi add xong thì comment lại!

        /**
         * 
        
        const allUsesrRef = query(collection(db, "messages"));
        const response2 = await getDocs(allUsesrRef);
        const documents2 = response2.docs.map((doc) => {
          const id = doc.id;
          const data = doc.data();
          return {
            ...data,
            id: id,
          };
        });

        for (let i = 0; i < documents2.length; i++) {
          const messageRef = doc(db, "messages", documents2[i].id);
          await setDoc(
            messageRef,
            {
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
            },
            {
              merge: true,
            }
          );
        }
        * 
         */
        //

        let strangerListRef;
        if (keywords) {
          strangerListRef = query(
            collection(db, "users"),
            where("keywords", "array-contains", keywords.toLowerCase())
          );
        } else {
          strangerListRef = query(collection(db, "users"));
        }

        const response = await getDocs(strangerListRef);
        const documents = response.docs.map((doc) => {
          const id = doc.id;
          const data = doc.data();
          return {
            ...data,
            id: id,
          };
        });

        const uidFriends = [
          uid,
          ...userInfo.friends.map((friend) => friend.uid),
        ];

        const result = documents.filter(
          (item) => !uidFriends.includes(item.uid)
        );
        return setStrangerList(result);
      };
      getStrangerList();
    } else {
      setStrangerList([]);
    }
  }, [userInfo, keywords, uid]);

  useEffect(() => {
    if (!uid) return;
    const q = query(
      collection(db, "rooms"),
      where("members", "array-contains", uid),
      orderBy("messageLastest.createdAt", "desc"),
      limit(PAGE_SIZE)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      if (docs.length < 1) setHasMore(false);

      const sortedRooms = [...docs].sort((a, b) => {
        const aTime =
          a.messageLastest?.clientCreatedAt ??
          a.messageLastest?.createdAt?.seconds * 1000 ??
          0;

        const bTime =
          b.messageLastest?.clientCreatedAt ??
          b.messageLastest?.createdAt?.seconds * 1000 ??
          0;

        return bTime - aTime;
      });

      setRooms(sortedRooms);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
    });

    return () => {
      unsubscribe();
    };
  }, [uid, keywords, userInfo]);
  


  useEffect(() => {
    if (selectedUserMessaging.uidSelected) {
      const getRoom = async () => {
        const room = rooms.filter((item) =>
          selectedUserMessaging.uidSelected === "my-cloud"
            ? item.members.includes(selectedUserMessaging.uidSelected) &&
              item.category === "my cloud"
            : item.members.includes(selectedUserMessaging.uidSelected) &&
              item.category === "single"
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
    if (selectedGroupMessaging?.room?.id) {
      const getRoom = async () => {
        const room = rooms.filter(
          (item) => item.id === selectedGroupMessaging?.room?.id
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
      orderBy("messageLastest.createdAt", "desc"),
      startAfter(lastDoc),
      limit(PAGE_SIZE)
    );

    const snap = await getDocs(roomsRef);

    const newRooms = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    setRooms((prev) => [...prev, ...newRooms]);
    setLastDoc(snap.docs[snap.docs.length - 1] || null);

    // Nếu số doc trả về < PAGE_SIZE => hết dữ liệu
    if (snap.docs.length < PAGE_SIZE) setHasMore(false);

    return newRooms.length;
  };

  return (
    <AppContext.Provider
      value={{
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
      }}
    >
      {children}
      {loading && <Loading />}
    </AppContext.Provider>
  );
};

export default AppProvider;
