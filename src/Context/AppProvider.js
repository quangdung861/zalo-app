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
  where,
} from "firebase/firestore";
import { db } from "firebaseConfig";
import moment from "moment";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const {
    user: { uid },
  } = useContext(AuthContext);

  const [userInfo, setUserInfo] = useState();

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
    return () => unSubcribe && unSubcribe();
  }, [uid]);

  const [strangerList, setStrangerList] = useState([]);
  const [keywords, setKeywords] = useState("");

  useEffect(() => {
    if (userInfo?.friends) {
      const getStrangerList = async () => {
        let strangerListRef;
        const uidFriends = userInfo.friends.map((friend) => friend.uid);

        if (keywords) {
          strangerListRef = query(
            collection(db, "users"),
            where("uid", "not-in", [uid, ...uidFriends]),
            where("keywords", "array-contains", keywords.toLowerCase())
          );
        } else {
          strangerListRef = query(
            collection(db, "users"),
            where("uid", "not-in", [uid, ...uidFriends])
          );
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
        setStrangerList(documents);
      };
      getStrangerList();
    } else {
      setStrangerList([]);
    }
  }, [userInfo, keywords]);

  const [selectedUserMessaging, setSelectedUserMessaging] = useState({});
  const [selectedGroupMessaging, setSelectedGroupMessaging] = useState({});

  const [room, setRoom] = useState({});
  const [rooms, setRooms] = useState({});

  useEffect(() => {
    let unSubcribe;
    if (uid) {
      const roomsRef = query(
        collection(db, "rooms"),
        where("members", "array-contains", uid)
      );

      unSubcribe = onSnapshot(roomsRef, (docsSnap) => {
        const documents = docsSnap.docs.map((doc) => {
          const id = doc.id;
          const data = doc.data();
          return {
            ...data,
            id: id,
          };
        });

        const newDocuments = [...documents].sort(
          (a, b) => b.messageLastest.createdAt - a.messageLastest.createdAt
        );

        setRooms(newDocuments);
      });
    }
    return () => unSubcribe && unSubcribe();
  }, [uid]);

  useEffect(() => {
    if (selectedUserMessaging.uidSelected) {
      const getRoom = async () => {
        const roomsRef = query(
          collection(db, "rooms"),
          where("members", "array-contains", userInfo.uid)
        );
        const responseRooms = await getDocs(roomsRef);

        const rooms = responseRooms.docs.map((doc) => {
          const id = doc.id;
          const data = doc.data();
          return {
            ...data,
            id: id,
          };
        });

        const room = rooms.filter((item) =>
          item.members.includes(selectedUserMessaging.uidSelected)
        );
        if (room[0]) {
          setRoom(room[0]);
        } else {
          setRoom({});
        }
      };
      getRoom();
    }
  }, [selectedUserMessaging, rooms]);

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
