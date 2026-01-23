import avatarCloud from "assets/avatarCloudjpg.jpg";
import avatarDefault from "assets/avatar-mac-dinh-1.png";

export const creatRoomPayload = (data) => {
  return {
    category: "my cloud",
    members: [data.user.uid, "my-cloud"],
    info: [
      {
        avatar: {
          original: avatarCloud,
          thumbnail: avatarCloud,
        },
        name: "Cloud của tôi",
        uid: "my-cloud",
      },
      {
        avatar: {
          original: data.user.photoURL ? data.user.photoURL : avatarDefault,
          thumbnail: data.user.photoURL ? data.user.photoURL : avatarDefault,
        },
        name: data.user.displayName,
        uid: data.user.uid,
      },
    ],
    messageLastest: {
      clientCreatedAt: Date.now(),
    },
    totalMessages: 0,
    unreadCount: { [data.user.uid]: 0 },
    unreadMembers: [],
    deleted: [],
    hideTemporarily: [],
    clientCreatedAt: Date.now(),
  };
};
