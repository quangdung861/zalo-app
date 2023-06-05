import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthContext } from "./AuthProvider";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "firebaseConfig";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const {
    user: { uid },
  } = useContext(AuthContext);

  const [userInfo, setUserInfo] = useState();
  console.log(
    "🚀 ~ file: AppProvider.js:20 ~ AppProvider ~ userInfo:",
    userInfo
  );
  useEffect(() => {
    if (uid) {
      const userInfoRef = query(
        collection(db, "users"),
        where("uid", "==", uid)
      );
      const userinfoSnap = onSnapshot(userInfoRef, (docsSnap) => {
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
    if (userInfo) {
      const strangerListRef = query(
        collection(db, "users"),
        where("uid", "not-in", [uid, ...userInfo.friends])
      );

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
  }, [userInfo, uid]);

  const [userList, setUserList] = useState();
  useEffect(() => {
    if (userInfo) {
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
  }, [userInfo, uid]);

  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    if (userInfo) {
      const userInfoRef = query(
        collection(db, "rooms"),
        where("members", "array-contains", userInfo.uid)
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
        setRooms(documents);
      });
    }
  }, [userInfo]);

  const [friends, setFriends] = useState([]);
  useEffect(() => {
    if (userInfo) {
      if (userInfo.friends.length === 0) {
        console.log("Empty age list. No query sent.");
        return;
      }
      const userInfoRef = query(
        collection(db, "users"),
        where("uid", "in", userInfo.friends)
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
        setFriends(documents);
      });
    }
  }, [userInfo]);

  const [invitationSent, setInvitationSent] = useState([]);
  useEffect(() => {
    if (userInfo) {
      if (userInfo.invitationSent.length === 0) {
        console.log("Empty age list. No query sent.");
        setInvitationSent([]);
        return;
      }
      const invitationSentRef = query(
        collection(db, "users"),
        where("uid", "in", userInfo.invitationSent)
      );

      onSnapshot(invitationSentRef, (docsSnap) => {
        const documents = docsSnap.docs.map((doc) => {
          const id = doc.id;
          const data = doc.data();
          return {
            ...data,
            id: id,
          };
        });
        setInvitationSent(documents);
      });
    }
  }, [userInfo]);

  const [invitationReceive, setInvitationReceive] = useState([]);
  useEffect(() => {
    if (userInfo) {
      if (userInfo.invitationReceive.length === 0) {
        console.log("Empty age list. No query sent.");
        setInvitationReceive([]);
        return;
      }
      const invitationReceiveRef = query(
        collection(db, "users"),
        where("uid", "in", userInfo.invitationReceive)
      );

      onSnapshot(invitationReceiveRef, (docsSnap) => {
        const documents = docsSnap.docs.map((doc) => {
          const id = doc.id;
          const data = doc.data();
          return {
            ...data,
            id: id,
          };
        });
        setInvitationReceive(documents);
      });
    }
  }, [userInfo]);

  return (
    <AppContext.Provider
      value={{
        invitationReceive,
        invitationSent,
        userInfo,
        strangerList,
        userList,
        rooms,
        friends,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
