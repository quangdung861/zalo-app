import React, { useContext, useEffect, useState, useRef } from "react";
import * as S from "./styles";
import { AppContext } from "Context/AppProvider";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "firebaseConfig";
import empty from "assets/empty.png";
import ModalAccount from "components/ModalAccount";
import { UserLayoutContext } from "layouts/user/UserLayout";

const FriendList = () => {
  const { userInfo } = useContext(AppContext);
  const { isShowBoxChat, setIsShowBoxChat, setSelectedUserMessaging, room } =
    useContext(UserLayoutContext);

  const { friends } = useContext(AppContext);

  const [isShowDropdown, setIsShowDropdown] = useState(false);
  const [isShowOverlayModal, setIsShowOverlayModal] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [friendSelected, setFriendSelected] = useState();

  const handleWatchInfo = ({ id, uid }) => {
    setIsShowOverlayModal(true);
    setIsShowDropdown(false);
    const friendSelected = friends.find((item) => item.id === id);
    setFriendSelected(friendSelected);
  };

  // const getFriendList = async () => {
  //   const friendListRef = query(
  //     collection(db, "users"),
  //     where("uid", "in", userInfo.friends)
  //   );

  //   const response = await getDocs(friendListRef);

  //   const documents = response.docs.map((doc) => {
  //     const id = doc.id;
  //     const data = doc.data();
  //     return {
  //       id,
  //       ...data,
  //     };
  //   });
  //   return setFriendList(documents);
  // };

  const handleUnfriend = async ({ id, uid, friends }) => {
    // USER_INFO
    const newUserInfoFriend = userInfo.friends.filter((item) => item !== uid);
    const userInfoRef = doc(db, "users", userInfo.id);
    await setDoc(
      userInfoRef,
      {
        friends: newUserInfoFriend,
      },
      {
        merge: true,
      }
    );
    // FRIEND
    const newFriendsOfFriend = friends.filter((item) => item !== userInfo.uid);
    const FriendRef = doc(db, "users", id);
    await setDoc(
      FriendRef,
      {
        friends: newFriendsOfFriend,
      },
      {
        merge: true,
      }
    );
  };

  const toogleBoxChat = (friendSelected) => {
    setIsShowBoxChat(!isShowBoxChat);
    setSelectedUserMessaging(friendSelected);
  };

  const renderFriendlist = () => {
    if (userInfo?.friends[0]) {
      return friends?.map((item) => {
        return (
          <div
            className="item-friend"
            key={item.id}
            onClick={() => toogleBoxChat(item)}
          >
            <div className="item-friend__left">
              <img src={item.photoURL} alt="" />
              <span>{item.displayName} </span>
            </div>
            <div className="item-friend__right">
              <i
                className="fa-solid fa-ellipsis"
                onClick={() => {
                  setIsShowDropdown(item.id);
                }}
              ></i>
              {isShowDropdown === item.id && (
                <div className="dropdown-menu" ref={dropdownRef}>
                  <div
                    className="dropdown-menu__item"
                    onClick={() =>
                      handleWatchInfo({ id: item.id, uid: item.uid })
                    }
                  >
                    Xem Thông tin
                  </div>
                  <div className="divding-line" />
                  <div className="dropdown-menu__item">Phân loại</div>
                  <div className="dropdown-menu__item">Đặt tên gợi nhớ</div>
                  <div className="divding-line" />
                  <div className="dropdown-menu__item">Chặn người này</div>
                  {userInfo.invitationSent.includes(item.uid) ||
                  userInfo.invitationReceive.includes(item.uid) ? (
                    <></>
                  ) : (
                    <>
                      <div className="divding-line" />
                      <div
                        className="dropdown-menu__item unfriend"
                        onClick={() =>
                          handleUnfriend({
                            uid: item.uid,
                            id: item.id,
                            friends: item.friends,
                          })
                        }
                      >
                        Hủy kết bạn
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      });
    } else {
      return (
        <div className="container-empty">
          <img src={empty} alt="" />
          <div>Bạn không có bạn bè nào</div>
        </div>
      );
    }
  };

  return (
    <S.Wrapper>
      <S.Container>
        <div className="friendlist">
          <div className="friendlist-header">
            <i className="fa-solid fa-user-group"></i>
            Danh sách bạn bè
          </div>
          <div className="friendlist-content">
            <div className="total-friends">
              Bạn bè ({userInfo?.friends?.length})
            </div>
            <div className="filter-friends">Filter</div>
            <div className="list-friends">{renderFriendlist()}</div>
          </div>
        </div>
        {isShowOverlayModal && (
          <ModalAccount
            setIsShowOverlayModal={setIsShowOverlayModal}
            accountSelected={friendSelected}
          />
        )}
      </S.Container>
    </S.Wrapper>
  );
};

export default FriendList;
