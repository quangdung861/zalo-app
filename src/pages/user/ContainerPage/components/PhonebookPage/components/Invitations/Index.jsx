import React, { useContext, useEffect, useMemo, useState } from "react";
import * as S from "./styles";
import { AppContext } from "Context/AppProvider";
import {
  collection,
  where,
  query,
  getDocs,
  onSnapshot,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "firebaseConfig";
import useFirestore from "hooks/useFirestore";
import empty from "assets/empty.png";

const Invitations = () => {
  const { userInfo } = useContext(AppContext);

  const [invitationSent, setInvitationSent] = useState([]);
  const [invitationReceive, setInvitationReceive] = useState([]);

  useEffect(() => {
    getInvitationSent();
  }, [userInfo.invitationSent]);

  useEffect(() => {
    getInvitationReceive();
  }, [userInfo.invitationReceive]);

  const getInvitationSent = async () => {
    if (userInfo.invitationSent[0]) {
      const invitationSentRef = query(
        collection(db, "users"),
        where("uid", "in", userInfo.invitationSent)
      );

      const response = await getDocs(invitationSentRef);

      const documents = response.docs?.map((doc) => {
        const id = doc.id;
        const data = doc.data();
        return {
          id,
          ...data,
        };
      });

      setInvitationSent(documents);

      // onSnapshot(invitationSentRef, (docsSnap) => {
      //   const invitationSentList = docsSnap.docs.map((doc) => {
      //     const id = doc.id;
      //     const data = doc.data();
      //     return {
      //       ...data,
      //       id: id,
      //     };
      //   });
      //   setInvitationSent(invitationSentList);
      // });
    } else {
      setInvitationSent([]);
    }
  };

  const getInvitationReceive = async () => {
    if (userInfo.invitationReceive[0]) {
      const invitationReceiveRef = query(
        collection(db, "users"),
        where("uid", "in", userInfo.invitationReceive)
      );

      const response = await getDocs(invitationReceiveRef);

      const documents = response.docs?.map((doc) => {
        const id = doc.id;
        const data = doc.data();
        return {
          id,
          ...data,
        };
      });

      setInvitationReceive(documents);
    } else {
      setInvitationReceive([]);
    }
  };

  // const invitationSentCondition = useMemo(() => {
  //   return {
  //     fieldName: "uid",
  //     operator: "in",
  //     compareValue: userInfo.invitationSent,
  //   };
  // }, [userInfo.invitationSent]);

  // const invitationSent = useFirestore("users", invitationSentCondition);

  const handleInvitationRecall = async ({ uid, invitationReceive, id }) => {
    // USER
    const newInvitationSent = userInfo.invitationSent.filter(
      (item) => item !== uid
    );
    const userInfoRef = doc(db, "users", userInfo.id);
    await setDoc(
      userInfoRef,
      {
        invitationSent: newInvitationSent,
      },
      {
        merge: true,
      }
    );
    // STRANGER
    const newInvitationReceive = invitationReceive.filter(
      (item) => item !== userInfo.uid
    );
    const strangerRef = doc(db, "users", id);
    await setDoc(
      strangerRef,
      {
        invitationReceive: newInvitationReceive,
      },
      {
        merge: true,
      }
    );
  };

  const renderInvitationSent = () => {
    if (invitationSent[0]) {
      return invitationSent?.map((item) => {
        return (
          <div className="sent-item" key={item.uid}>
            <div className="sent-item__content">
              <div className="content__top">
                <div className="info">
                  <div className="info__left">
                    <img src={item.photoURL} alt="" />
                    <div className="detail">
                      <div className="display-name">{item.displayName}</div>
                      <div className="origin">2 ngày - Từ nhóm trò chuyện</div>
                    </div>
                  </div>
                  <i className="fa-regular fa-comment info__right"></i>
                </div>
              </div>

              <div className="content__bottom">
                <div
                  className="btn btn-recall"
                  onClick={() =>
                    handleInvitationRecall({
                      uid: item.uid,
                      invitationReceive: item.invitationReceive,
                      id: item.id,
                    })
                  }
                >
                  Thu hồi lời mời
                </div>
              </div>
            </div>
          </div>
        );
      });
    } else {
      return (
        <div className="container-empty">
          <img src={empty} alt="" />
          <div>Bạn không có lời mời nào</div>
        </div>
      );
    }
  };

  // RECEIVE
  const handleInvitationApprove = async ({
    uid,
    invitationSent,
    id,
    friends,
  }) => {
    const newInvitationSent = invitationSent.filter(
      (item) => item !== userInfo.uid
    );
    const strangerRef = doc(db, "users", id);
    await setDoc(
      strangerRef,
      {
        friends: [userInfo.uid, ...friends],
        invitationSent: newInvitationSent,
      },
      {
        merge: true,
      }
    );
    //
    const newInvitationReceive = userInfo.invitationReceive.filter(
      (item) => item !== uid
    );
    const userInfoRef = doc(db, "users", userInfo.id);
    await setDoc(
      userInfoRef,
      {
        friends: [uid, ...userInfo.friends],
        invitationReceive: newInvitationReceive,
      },
      {
        merge: true,
      }
    );
  };

  const renderInvitationReceive = () => {
    if (invitationReceive[0]) {
      return invitationReceive.map((item) => {
        return (
          <div className="receive-item" key={item.uid}>
            <div className="receive-item__content">
              <div className="content__top">
                <div className="info">
                  <div className="info__left">
                    <img src={item.photoURL} alt="" />
                    <div className="detail">
                      <div className="display-name">{item.displayName}</div>
                      <div className="origin">2 ngày - Từ nhóm trò chuyện</div>
                    </div>
                  </div>
                  <i className="fa-regular fa-comment info__right"></i>
                </div>
              </div>

              <div className="content__center">
                Xin chào. mình là {item.displayName}. kết bạn với mình nhé!
              </div>
              <div className="content__bottom">
                <div className="btn btn-reject">Từ chối</div>
                <div
                  className="btn btn-approve"
                  onClick={() =>
                    handleInvitationApprove({
                      uid: item.uid,
                      invitationSent: item.invitationSent,
                      id: item.id,
                      friends: item.friends,
                    })
                  }
                >
                  Đồng ý
                </div>
              </div>
            </div>
          </div>
        );
      });
    } else {
      return (
        <div className="container-empty">
          <img src={empty} alt="" />
          <div>Bạn không có lời mời nào</div>
        </div>
      );
    }
  };

  return (
    <S.Wrapper>
      <S.Container>
        <div className="invitations">
          <div className="header">
            <i className="fa-regular fa-envelope-open"></i>
            Lời mời kết bạn
          </div>
          <div className="content">
            <div className="invitation__receive">
              <div className="total-count total-count-receive">
                Lời mời đã nhận ({invitationReceive.length})
              </div>
              <div className="receive-list">{renderInvitationReceive()}</div>
            </div>
            <div className="invitation__sent">
              <div className="total-count total-count-sent">
                Lời mời đã gửi ({invitationSent?.length})
              </div>
              <div className="sent-list">{renderInvitationSent()}</div>
            </div>
          </div>
        </div>
      </S.Container>
    </S.Wrapper>
  );
};

export default Invitations;
