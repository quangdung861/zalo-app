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
  console.log("🚀 ~ file: AppProvider.js:21 ~ AppProvider ~ userInfo:", userInfo)
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
  }, [uid]);

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
  }, [uid]);

  return (
    <AppContext.Provider value={{ userInfo, strangerList }}>{children}</AppContext.Provider>
  );
};

export default AppProvider;
