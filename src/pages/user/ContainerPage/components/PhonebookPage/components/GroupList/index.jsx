import React, { useState, useRef, useEffect, useContext, useMemo } from "react";
import * as S from "./styles";
import { AppContext } from "Context/AppProvider";
import { UserLayoutContext } from "layouts/user/UserLayout";
import { collection, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "firebaseConfig";
import AvatarGroup from "components/AvatarGroup";
import { generateKeywords } from "services";
import empty from "assets/empty.png";

const GroupList = ({ setIsShowSectionRight, setIsShowSectionLeft }) => {
  const {
    isShowBoxChat,
    setIsShowBoxChat,
    setTotalUnseenMessage,
    isShowBoxChatGroup,
    setIsShowBoxChatGroup,
    setSidebarSelected,
    setSectionSelected,
  } = useContext(UserLayoutContext);
  const {
    rooms,
    userInfo,
    selectedUserMessaging,
    setSelectedUserMessaging,
    setSelectedGroupMessaging,
    selectedGroupMessaging,
  } = useContext(AppContext);

  const [keywords, setKeywords] = useState("");
  const [dropdownOrderBy, setDropdownOrderBy] = useState(false);
  const [orderBy, setOderBy] = useState("asc");

  const orderByRef = useRef(null);

  const handleSearch = async (value) => {
    setKeywords(value);
  };

  const [infoPartner, setInfoPartner] = useState([]);

  const [newRooms, setNewRoom] = useState([]);

  useEffect(() => {
    if (rooms[0]) {
      const fetchDataAsync = async () => {
        const fetchedData = await fetchData();
        setNewRoom(fetchedData.newRooms);
        setInfoPartner(fetchedData.infoPartner);
      };
      fetchDataAsync();
    }
  }, [rooms]);

  const toogleBoxChatGroup = ({ room, avatars, name }) => {
    setIsShowBoxChat(false);
    setSelectedUserMessaging(false);
    setIsShowBoxChatGroup(true);

    setSelectedGroupMessaging({ room, avatars, name });
  };

  const fetchData = async () => {
    let infoPartner = [];
    let newRooms = [];
    for (const room of rooms) {
      if (room.category === "group") {
        const partnerRef = query(
          collection(db, "users"),
          where("uid", "in", room.members)
        );

        const response = await getDocs(partnerRef);
        const documents = response.docs.map((doc) => {
          const id = doc.id;
          const data = doc.data();
          return {
            id: id,
            displayName: data.displayName,
            photoURL: data.photoURL,
          };
        });

        const avatars = documents.map((item) => item.photoURL);

        const name = documents.map((item) => item.displayName).join(", ");

        // let keywordsName;

        // if (room.name) {
        //   keywordsName = generateKeywords(room.name.toLowerCase());
        // } else {
        //   keywordsName = generateKeywords(name.toLowerCase());
        // }

        infoPartner.push({
          id: room.id,
          photoURL: avatars,
          displayName: name,
          keywordsName: room.name.toLowerCase() || name.toLowerCase(),
        });

        newRooms.push({
          ...room,
          nameSearch: room.name || name,
        });
      }
    }
    return { infoPartner, newRooms };
  };

  const [totalFriends, setTotalFriends] = useState(0);

  const renderGroupList = useMemo(() => {
    if (infoPartner[0]) {
      if (orderBy === "desc") {
        newRooms.sort((a, b) => b.nameSearch.localeCompare(a.nameSearch)); //desc
      } else {
        newRooms.sort((a, b) => a.nameSearch.localeCompare(b.nameSearch)); //asc
      }

      setTotalFriends(0);
      return newRooms?.map((room) => {
        if (room.category === "group") {
          const infoParnerData = infoPartner.find(
            (item) => room.id === item.id
          );

          if (keywords) {
            const isKeywords = infoParnerData.keywordsName.includes(
              keywords.toLowerCase()
            );
            if (!isKeywords) {
              return;
            }
          }

          setTotalFriends((preven) => preven + 1);

          return (
            <div className="item-group" key={room.id}>
              <div
                className="item-group__left"
                onClick={() =>
                  toogleBoxChatGroup({
                    room,
                    avatars: infoParnerData.photoURL,
                    name: infoParnerData.displayName,
                  })
                }
              >
                {room.avatar?.url ? (
                  <img src={room.avatar?.url} alt="" />
                ) : (
                  <AvatarGroup
                    props={{ avatars: infoParnerData.photoURL, room }}
                  />
                )}

                <div className="box-info">
                  <span>{room.name || infoParnerData.displayName}</span>
                </div>
              </div>
              <div className="item-group__right">
                <i
                  className="fa-solid fa-ellipsis"
                  // onClick={() => {
                  //   setIsShowDropdown(item.id);
                  // }}
                ></i>
              </div>
            </div>
          );
        }
      });
    }
    return (
      <div className="container-empty">
        <img src={empty} alt="" />
        <div>Bạn không có nhóm nào</div>
      </div>
    );
  }, [infoPartner, keywords, newRooms, orderBy]);

  const handleComeBack = () => {
    setIsShowBoxChatGroup(false);
    setIsShowSectionRight(false);
    setIsShowSectionLeft(true);
  };

  return (
    <S.Wrapper>
      <S.Container>
        <div className="grouplist">
          <div className="grouplist-header">
            <div className="btn-come-back" onClick={() => handleComeBack()}>
              <i className="fa-solid fa-chevron-left"></i>
            </div>
            <i className="fa-solid fa-users"></i>
            Danh sách nhóm
          </div>
          <div className="grouplist-content">
            <div className="total-groups">Nhóm ({totalFriends})</div>
            <div className="filter-groups">
              <div className="filter-item search">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                  value={keywords}
                  type="text"
                  className="input-search"
                  placeholder="Tìm nhóm"
                  onChange={(e) => setKeywords(e.target.value)}
                />
                {keywords?.length > 0 && (
                  <i
                    className="fa-solid fa-circle-xmark"
                    onClick={() => handleSearch("")}
                    style={{ cursor: "pointer" }}
                  ></i>
                )}
              </div>
              <div className="filter-item asc-desc-order">
                <div
                  className={
                    dropdownOrderBy
                      ? "asc-desc-order__current asc-desc-order__current--active"
                      : "asc-desc-order__current"
                  }
                  onClick={() => setDropdownOrderBy(!dropdownOrderBy)}
                >
                  <i className="fa-solid fa-arrows-up-down"></i>
                  <span>Tên {orderBy === "asc" ? "(A-Z)" : "(Z-A)"}</span>
                  <i className="fa-solid fa-chevron-down"></i>
                </div>
                {dropdownOrderBy && (
                  <div className="asc-desc-order__dropdown" ref={orderByRef}>
                    <div
                      className="asc-filter"
                      onClick={() => {
                        setOderBy("asc");
                        setDropdownOrderBy(false);
                      }}
                    >
                      <span className="pick">
                        {orderBy === "asc" && (
                          <i className="fa-solid fa-check"></i>
                        )}
                      </span>

                      <span>Tên (A-Z)</span>
                    </div>
                    <div
                      className="desc-filter"
                      onClick={() => {
                        setOderBy("desc");
                        setDropdownOrderBy(false);
                      }}
                    >
                      <span className="pick">
                        {orderBy === "desc" && (
                          <i className="fa-solid fa-check"></i>
                        )}
                      </span>
                      <span>Tên (Z-A)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="list-groups">{renderGroupList}</div>
          </div>
        </div>
      </S.Container>
    </S.Wrapper>
  );
};

export default GroupList;
