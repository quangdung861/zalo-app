import React, { useEffect, useState } from "react";
import { put, takeEvery } from "redux-saga/effects";

import { REQUEST, SUCCESS, FAIL, USER_ACTION } from "../constants";

import { db } from "firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  getCountFromServer,
  doc,
} from "firebase/firestore";

// import { API } from "constants/api";

function* loginSaga(action) {
  try {
    const { uid } = action.payload;
    yield put({
      type: SUCCESS(USER_ACTION.LOGIN),
      payload: {
        data: uid,
      },
    });
  } catch (error) {
    yield put({
      type: FAIL(USER_ACTION.LOGIN),
      payload: {
        error: "Đăng nhập bằng Google không thành công",
      },
    });
  }
}

function* getUserInfoSaga(action) {
  try {
    const { uid } = action.payload;
    const dbRef = query(collection(db, "users"), where("uid", "==", uid));
    const response = yield getDocs(dbRef);
    const documents = response.docs.map((doc) => {
      const id = doc.id;
      const data = doc.data();
      return {
        ...data,
        id,
      };
    });

    yield put({
      type: SUCCESS(USER_ACTION.GET_USER_INFO),
      payload: {
        data: documents[0],
      },
    });
  } catch (error) {
    yield put({
      type: FAIL(USER_ACTION.GET_USER_INFO),
      payload: {
        error: error,
      },
    });
  }
}

function* getUserListSaga(action) {
  try {
    const dbRef = query(collection(db, "users"));
    const response = yield getDocs(dbRef);
    // const toalResponse = yield getCountFromServer(dbRef);
    // console.log('count: ', toalResponse.data().count);
    const documents = response.docs.map((doc) => {
      const id = doc.id;
      const data = doc.data();
      return {
        ...data,
        id,
      };
    });

    yield put({
      type: SUCCESS(USER_ACTION.GET_USER_LIST),
      payload: {
        data: documents,
      },
    });
  } catch (error) {
    yield put({
      type: FAIL(USER_ACTION.GET_USER_LIST),
      payload: {
        error: error,
      },
    });
  }
}

function* getUserInfoSelectedSaga(action) {
  try {
    const { id } = action.payload;
    const dbRef = doc(collection(db, "users"), id);
    const response = yield getDoc(dbRef);
    const documents = response.data();

    yield put({
      type: SUCCESS(USER_ACTION.GET_USER_INFO_SELECTED),
      payload: {
        data: documents,
      },
    });
  } catch (error) {
    yield put({
      type: FAIL(USER_ACTION.GET_USER_INFO_SELECTED),
      payload: {
        error: error,
      },
    });
  }
}

export default function* userSaga() {
  yield takeEvery(REQUEST(USER_ACTION.LOGIN), loginSaga);
  yield takeEvery(REQUEST(USER_ACTION.GET_USER_INFO), getUserInfoSaga);
  yield takeEvery(REQUEST(USER_ACTION.GET_USER_LIST), getUserListSaga);
  yield takeEvery(
    REQUEST(USER_ACTION.GET_USER_INFO_SELECTED),
    getUserInfoSelectedSaga
  );
}
