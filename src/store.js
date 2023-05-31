import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./redux/sagaCommon";

import userReducer from "redux/user/reducers/user.reducer";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    userReducer,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({ thunk: false, serializableCheck: false }),
    sagaMiddleware,
  ],
});

sagaMiddleware.run(rootSaga);

export default store;
