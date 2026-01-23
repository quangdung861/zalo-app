import imgPhotocover from "assets/photocover/photocover.jpg";
import avatarDefault from "assets/avatar-mac-dinh-1.png";
import { serverTimestamp } from "firebase/firestore";
import { generateKeywords } from "services";
import { categoriesTemplate } from "constants/categoriesTemplate";

export const createUserPayload = (data) => {
  return {
    displayName: data.user.displayName,
    email: data.user.email,
    photoURL: {
      original: data.user.photoURL ? data.user.photoURL : avatarDefault,
      thumbnail: data.user.photoURL ? data.user.photoURL : avatarDefault,
    },
    photoCover: {
      original: imgPhotocover,
      thumbnail: imgPhotocover,
    },
    uid: data.user.uid,
    providerId: data.providerId,
    friends: [],
    groups: [],
    invitationSent: [],
    invitationReceive: [],
    keywords: generateKeywords(data.user.displayName.toLowerCase()),
    phoneNumber: "",
    sex: "",
    dateOfBirth: "",
    categoriesTemplate: categoriesTemplate,
    notificationDowloadZaloPc: {
      value: true,
      updatedAt: serverTimestamp(),
    },
    isOnline: {
      value: true,
      updatedAt: serverTimestamp(),
    },
    clientCreatedAt: Date.now(),
  };
};
