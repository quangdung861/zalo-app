import React, { useEffect, useRef, useState, createContext } from "react";
import UserLayout from "layouts/user/UserLayout";
import "_variables.scss";
import { ROUTES } from "routes";
import ContainerPage from "pages/user/ContainerPage";
import RegisterPage from "pages/user/RegisterPage";
import LoginRegisterLayout from "layouts/LoginRegisterLayout";
import { useDispatch } from "react-redux";
import { getUserInfoAction } from "redux/user/actions";
import { auth } from "firebaseConfig";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import LoginPage from "pages/user/LoginPage";

export const AppContext = createContext();

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const unsubscribed = auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(getUserInfoAction({ uid: user.uid }));
      } else {
        navigate(ROUTES.LOGIN);
      }
    });
    return () => {
      unsubscribed();
    };
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }, [pathname]);

  const dropdownRef = useRef(null);

  const [isShowDropdown, setIsShowDropdown] = useState(false);

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

  return (
    <AppContext.Provider
      value={{ setIsShowDropdown, isShowDropdown, dropdownRef }}
    >
      <Routes>
        <Route element={<UserLayout />}>
          <Route path={ROUTES.USER.HOME} element={<ContainerPage />} />
        </Route>
        <Route element={<LoginRegisterLayout />}>
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        </Route>
      </Routes>
    </AppContext.Provider>
  );
}

export default App;
