import React, { useContext, useEffect, useMemo, useState } from "react";
import * as S from "./styles";
import {
  collection,
  where,
  query,
  getDocs,
  onSnapshot,
  doc,
  setDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "firebaseConfig";
import useFirestore from "hooks/useFirestore";
import empty from "assets/empty.png";
import { addDocument } from "services";
import { AppContext } from "Context/AppProvider";
import { UserLayoutContext } from "layouts/user/UserLayout";
import ModalAccount from "components/ModalAccount";
import moment from "moment";

const Invitations = ({ setIsShowSectionRight, setIsShowSectionLeft }) => {
  const { userInfo, setSelectedUserMessaging } = useContext(AppContext);
  const { isShowBoxChat, setIsShowBoxChat, setIsShowBoxChatGroup, handleComeBack } =
    useContext(UserLayoutContext);

  const [invitationSent, setInvitationSent] = useState([]);
  const [invitationReceive, setInvitationReceive] = useState([]);
  const [isShowOverlayModal, setIsShowOverlayModal] = useState(false);
  const [userInfoSelected, setUserInfoSelected] = useState();

  useEffect(() => {
    const getInvitationSent = async () => {
      if (userInfo.invitationSent[0]) {
        const invitationSentRef = query(
          collection(db, "users"),
          where(
            "uid",
            "in",
            userInfo.invitationSent.map((item) => item.uid)
          )
        );
        const response = await getDocs(invitationSentRef);
        const documents = response.docs?.map((doc) => {
          const id = doc.id;
          const data = doc.data();
          return {
            id,
            ...data,
            dataInvitationSent: userInfo.invitationSent.find(
              (item) => (item.uid = data.uid)
            ),
          };
        });

        setInvitationSent(documents);
      } else {
        setInvitationSent([]);
      }
    };
    getInvitationSent();
  }, [userInfo.invitationSent]);

  useEffect(() => {
    const getInvitationReceive = async () => {
      if (userInfo.invitationReceive[0]) {
        const invitationReceiveRef = query(
          collection(db, "users"),
          where(
            "uid",
            "in",
            userInfo.invitationReceive.map((item) => item.uid)
          )
        );
        const response = await getDocs(invitationReceiveRef);
        const documents = response.docs?.map((doc) => {
          const id = doc.id;
          const data = doc.data();
          return {
            id,
            ...data,
            dataInvitationReceive: userInfo.invitationReceive.find(
              (item) => (item.uid = data.uid)
            ),
          };
        });

        setInvitationReceive(documents);
      } else {
        setInvitationReceive([]);
      }
    };
    getInvitationReceive();
  }, [userInfo.invitationReceive]);

  const handleInvitationRecall = async ({ uid, invitationReceive, id }) => {
    // STRANGER
    const newInvitationReceive = invitationReceive.filter(
      (item) => item.uid !== userInfo.uid
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
    // ME
    const newInvitationSent = userInfo.invitationSent.filter(
      (item) => item.uid !== uid
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
  };

  const renderInvitationSent = () => {
    if (invitationSent.length !== 0) {
      return invitationSent?.map((item) => {
        return (
          <div className="sent-item" key={item.uid}>
            <div className="sent-item__content">
              <div className="content__top">
                <div className="info">
                  <div className="info__left">
                    <img
                      src={item.photoURL}
                      alt=""
                      onClick={() => {
                        setUserInfoSelected(item);
                        setIsShowOverlayModal(true);
                      }}
                    />
                    <div className="detail">
                      <span
                        className="display-name"
                        onClick={() => {
                          setUserInfoSelected(item);
                          setIsShowOverlayModal(true);
                        }}
                      >
                        {item.displayName}
                      </span>
                      <div className="origin">
                        {item.dataInvitationSent?.from}
                      </div>
                    </div>
                  </div>
                  <i
                    className="fa-regular fa-comment info__right"
                    onClick={() =>
                      toogleBoxChat({
                        uidSelected: item.uid,
                        photoURLSelected: item.photoURL,
                        displayNameSelected: item.displayName,
                      })
                    }
                  ></i>
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
      (item) => item.uid !== userInfo.uid
    );
    const strangerRef = doc(db, "users", id);
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
  };

  const handleInvitationReject = async ({ uid, invitationSent, id }) => {
    const newInvitationSent = invitationSent.filter(
      (item) => item.uid !== userInfo.uid
    );
    const strangerRef = doc(db, "users", id);
    await setDoc(
      strangerRef,
      {
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
        invitationReceive: newInvitationReceive,
      },
      {
        merge: true,
      }
    );
  };

  const renderInvitationReceive = () => {
    if (invitationReceive.length !== 0) {
      return invitationReceive.map((item) => {
        return (
          <div className="receive-item" key={item.uid}>
            <div className="receive-item__content">
              <div className="content__top">
                <div className="info">
                  <div className="info__left">
                    <img
                      src={item.photoURL}
                      alt=""
                      onClick={() => {
                        setUserInfoSelected(item);
                        setIsShowOverlayModal(true);
                      }}
                    />
                    <div className="detail">
                      <span
                        className="display-name"
                        onClick={() => {
                          setUserInfoSelected(item);
                          setIsShowOverlayModal(true);
                        }}
                      >
                        {item.displayName}
                      </span>
                      <div className="origin">
                      {moment(item?.dataInvitationReceive?.createdAt)?.fromNow()} - {item.dataInvitationReceive?.from}
                      </div>
                    </div>
                  </div>
                  <i
                    className="fa-regular fa-comment info__right"
                    onClick={() =>
                      toogleBoxChat({
                        uidSelected: item.uid,
                        photoURLSelected: item.photoURL,
                        displayNameSelected: item.displayName,
                      })
                    }
                  ></i>
                </div>
              </div>

              <div className="content__center">
                {item.dataInvitationReceive?.message
                  ? item.dataInvitationReceive?.message
                  : `  Xin chào, mình là ${item.displayName}. kết bạn với mình nhé!`}
              </div>
              <div className="content__bottom">
                <div
                  className="btn btn-reject"
                  onClick={() =>
                    handleInvitationReject({
                      uid: item.uid,
                      invitationSent: item.invitationSent,
                      id: item.id,
                      friends: item.friends,
                    })
                  }
                >
                  Từ chối
                </div>
                <div
                  className="btn btn-approve"
                  onClick={() =>
                    handleInvitationApprove({
                      uid: item.uid,
                      invitationSent: item.invitationSent,
                      id: item.id,
                      friends: item.friends,
                      displayName: item.displayName,
                      photoURL: item.photoURL,
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

  const toogleBoxChat = ({
    uidSelected,
    photoURLSelected,
    displayNameSelected,
  }) => {
    setIsShowBoxChatGroup(false);
    setIsShowBoxChat(!isShowBoxChat);
    setSelectedUserMessaging({
      uidSelected,
      photoURLSelected,
      displayNameSelected,
    });
  };

  return (
    <S.Wrapper>
      <S.Container>
        <div className="invitations">
          <div className="header">
            <div className="btn-come-back" onClick={() => handleComeBack()}>
              <i className="fa-solid fa-chevron-left"></i>
            </div>
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
                Lời mời đã gửi ({invitationSent.length})
              </div>
              <div className="sent-list">{renderInvitationSent()}</div>
            </div>
          </div>
        </div>
        {isShowOverlayModal && (
          <ModalAccount
            setIsShowOverlayModal={setIsShowOverlayModal}
            accountSelected={userInfoSelected}
          />
        )}
      </S.Container>
    </S.Wrapper>
  );
};

export default Invitations;
