import AvatarGroup from 'components/AvatarGroup';
import React, { useEffect, useRef } from 'react'

const RoomItem = ({
    type,
    roomId,
    uidSelected,
    partner,
    category,
    lastMessage,
    unseenMessages,
    onDeleteRoom,
    room,
    infoGroup,
    formatDate,
    categoryData,
    //
    selectedUserMessaging,
    toogleBoxChat,
    avatarDefault,
    userInfo,
    isShowDropdownOption,
    setIsShowDropdownOption,
    toogleBoxChatGroup,
    selectedGroupMessaging,
    setRoomDelete,
    setIsShowOverlayModalConfirmDelete
}) => {
    const dropdownRef = useRef(null);
  
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsShowDropdownOption(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    let roomItem = <div />;
    if (type === "single") {
        roomItem = <div className="container-room-item " key={roomId}>
            <div
                className={
                    uidSelected === selectedUserMessaging.uidSelected
                        ? "room-item room-item--active"
                        : "room-item"
                }
                onClick={() =>
                    toogleBoxChat({
                        uidSelected: uidSelected,
                        photoURLSelected: partner?.photoURL,
                        displayNameSelected: partner?.displayName,
                    })
                }
            >
                <div className="room-item__left">
                    <img
                        // className="image-with-replacement"
                        src={partner?.photoURL}
                        alt=""
                        onError={(e) => {
                            e.target.src = avatarDefault;
                        }}
                    />

                    <div className="info">
                        <div className="room-name">
                            {partner?.displayName}
                        </div>
                        <div className="new-message">
                            {category && (
                                <i
                                    className="fa-solid fa-bookmark category-icon"
                                    style={{
                                        color: category.color,
                                        marginRight: "8px",
                                    }}
                                    title={category.name}
                                ></i>
                            )}
                            <span className="new-message__author">
                                {lastMessage.uid === userInfo.uid && "Bạn: "}
                            </span>
                            <span className="new-message__text">
                                {lastMessage.text}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="room-item__right">
                    <div className="date">
                        {lastMessage.createdAtText !== "Invalid date" ? lastMessage.createdAtText : "..."}
                    </div>

                    {!!unseenMessages && (
                        <div className="unseen">
                            {unseenMessages <= 99 ? unseenMessages : "N"}
                        </div>
                    )}
                </div>
            </div>
            {isShowDropdownOption?.id === roomId && (
                <div className="dropdown-menu" ref={dropdownRef}>
                    <div
                        className="menu-item"
                        style={{ color: "#d91b1b" }}
                        onClick={onDeleteRoom}
                    >
                        <i
                            className="fa-regular fa-trash-can"
                            style={{ color: "#d91b1b" }}
                        ></i>
                        Xoá hội thoại
                    </div>
                </div>
            )}

            <div
                className={
                    uidSelected === selectedUserMessaging.uidSelected
                        ? "btn-show-option btn-show-option--active"
                        : "btn-show-option"
                }
                onClick={() => setIsShowDropdownOption({ id: roomId })}
            >
                <i className="fa-solid fa-ellipsis"></i>
            </div>
        </div>

    } else if (type === "group") {
        roomItem = <div className="container-room-item" key={room.id}>
            <div
                className={
                    room.id === selectedGroupMessaging?.room?.id
                        ? "room-item room-item--active"
                        : "room-item"
                }
                onClick={() =>
                    toogleBoxChatGroup({
                        room,
                        avatars: infoGroup.photoURL,
                        name: infoGroup.displayName,
                    })
                }
            >
                <div className="room-item__left">
                    {room.avatar?.url && (
                        <img
                            // className="image-with-replacement"
                            src={room.avatar?.url}
                            alt=""
                            onError={(e) => {
                                e.target.src = avatarDefault;
                            }}
                        />
                    )}

                    {!room.avatar?.url && infoGroup?.photoURL && (
                        <AvatarGroup props={{ room, avatars: infoGroup?.photoURL }} />
                    )}

                    <div className="info">
                        <div className="room-name">
                            {room.name || infoGroup?.displayName}
                        </div>
                        <div className="new-message">
                            {categoryData && (
                                <i
                                    className="fa-solid fa-bookmark category-icon"
                                    style={{
                                        color: categoryData.color,
                                        marginRight: "8px",
                                    }}
                                    title={categoryData.name}
                                ></i>
                            )}
                            <span className="new-message__author">
                                {room.messageLastest?.uid === userInfo.uid
                                    ? "Bạn: "
                                    : room?.messageLastest?.displayName &&
                                    `${room?.messageLastest?.displayName}: `}
                            </span>
                            <span className="new-message__text">
                                {room?.messageLastest?.text}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="room-item__right">
                    <div className="date">
                        {formatDate !== "Invalid date" ? formatDate : "..."}
                    </div>
                    {!!unseenMessages && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                            }}
                        >
                            {room?.mentioned?.includes(userInfo.id) && (
                                <div className="icon-tagname">@</div>
                            )}
                            <div className="unseen">
                                {unseenMessages <= 99 ? unseenMessages : "N"}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {isShowDropdownOption?.id === room.id && (
                <div className="dropdown-menu" ref={dropdownRef}>
                    <div
                        className="menu-item"
                        style={{ color: "#d91b1b" }}
                        onClick={() => {
                            setIsShowDropdownOption(false);
                            setRoomDelete(room);
                            setIsShowOverlayModalConfirmDelete(true);
                        }}
                    >
                        <i
                            className="fa-regular fa-trash-can"
                            style={{ color: "#d91b1b" }}
                        ></i>
                        Xoá hội thoại
                    </div>
                </div>
            )}
            <div
                className={
                    room.id === selectedGroupMessaging?.room?.id
                        ? "btn-show-option btn-show-option--active"
                        : "btn-show-option"
                }
                onClick={() => setIsShowDropdownOption({ id: room.id })}
            >
                <i className="fa-solid fa-ellipsis"></i>
            </div>
        </div>
    }
    return roomItem;
}

export default RoomItem