import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthContext } from "./AuthProvider";
import useFirestore from "../hooks/useFirestore";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "firebaseConfig";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const {
    user: { uid },
  } = useContext(AuthContext);

  const [userInfo, setUserInfo] = useState();
  useEffect(() => {
    if (uid) {
      const userInfoRef = query(
        collection(db, "users"),
        where("uid", "==", uid)
      );
      onSnapshot(userInfoRef, (docsSnap) => {
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
  }, [userInfo]);

  const [strangerList, setStrangerList] = useState();
  useEffect(() => {
    if (uid) {
      let strangerListRef;
      if (userInfo?.friends[0]) {
        strangerListRef = query(
          collection(db, "users"),
          where("uid", "not-in", [uid, ...userInfo.friends])
        );
      } else {
        strangerListRef = query(
          collection(db, "users"),
          where("uid", "not-in", [uid])
        );
      }

      onSnapshot(strangerListRef, (docsSnap) => {
        const documents = docsSnap.docs.map((doc) => {
          const id = doc.id;
          const data = doc.data();
          return {
            ...data,
            id: id,
          };
        });
        setStrangerList(documents);
      });
    }
  }, [userInfo]);

  const [userList, setUserList] = useState();
  useEffect(() => {
    if (uid) {
      const userListRef = collection(db, "users");
      onSnapshot(userListRef, (docsSnap) => {
        const documents = docsSnap.docs.map((doc) => {
          const id = doc.id;
          const data = doc.data();
          return {
            ...data,
            id: id,
          };
        });
        setUserList(documents);
      });
    }
  }, [userInfo]);

  return (
    <AppContext.Provider value={{ userInfo, strangerList, userList }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
