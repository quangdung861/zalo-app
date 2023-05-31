import { fork } from "redux-saga/effects";

import userSaga from "./user/sagas/user.saga";

export default function* rootSaga() {
  yield fork(userSaga);
}
