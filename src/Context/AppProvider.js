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
} from "firebase/firestore";
import { db } from "firebaseConfig";
import moment from "moment";
import { generateKeywords } from "services";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const {
    user: { uid },
  } = useContext(AuthContext);

  const [userInfo, setUserInfo] = useState();

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
      // REFRESH REMIND MESSAGE
      const currentTime = moment();
      const previousTime = moment(
        userInfo.notificationDowloadZaloPc?.updatedAt?.toDate()
      );
      const duration = moment.duration(currentTime.diff(previousTime));
      const hoursDifference = duration.asHours();
      if (hoursDifference > 1) {
        const docRef = doc(db, "users", userInfo.id);
        setDoc(
          docRef,
          {
            notificationDowloadZaloPc: {
              value: true,
              updatedAt: serverTimestamp(),
            },
          },
          {
            merge: true,
          }
        );
      }
    }
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
    return () => unSubcribe && unSubcribe();
  }, [uid]);

  const [strangerList, setStrangerList] = useState([]);

  const [keywords, setKeywords] = useState("");

  useEffect(() => {
    if (userInfo?.friends) {
      const getStrangerList = async () => {
        // Nơi add thêm trường dữ liệu mới - sau khi add xong thì comment lại!

        /**
       
        const allUsesrRef = query(collection(db, "users"));
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
          const messageRef = doc(db, "users", documents2[i].id);
          await setDoc(
            messageRef,
            {
              groups: [],
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

  const [selectedUserMessaging, setSelectedUserMessaging] = useState({});

  const [selectedGroupMessaging, setSelectedGroupMessaging] = useState({});

  const [room, setRoom] = useState({});
  const [rooms, setRooms] = useState({});

  useEffect(() => {
    let unSubcribe;
    if (uid) {
      let roomsRef;
      roomsRef = query(
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

        let newDocuments = [...documents].sort(
          (a, b) => b.messageLastest.createdAt - a.messageLastest.createdAt
        );

        setRooms(newDocuments);
      });
    }
    return () => unSubcribe && unSubcribe();
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
  }, [selectedUserMessaging, rooms, userInfo]);

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
