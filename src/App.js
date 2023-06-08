import React, { useEffect, useRef, useState, createContext } from "react";
import UserLayout from "layouts/user/UserLayout";
import "_variables.scss";
import { ROUTES } from "routes";
import ContainerPage from "pages/user/ContainerPage";
import RegisterPage from "pages/user/RegisterPage";
import LoginRegisterLayout from "layouts/LoginRegisterLayout";
import { auth } from "firebaseConfig";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import LoginPage from "pages/user/LoginPage";

import AppProvider from "Context/AppProvider";
import AuthProvider from "Context/AuthProvider";
import "moment/locale/vi";
import moment from "moment";

export const DropdownContext = createContext();

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }, [pathname]);

  const exampleMoment = moment().format("HH:mm");
  console.log("🚀 ~ file: App.js:30 ~ App ~ exampleMoment:", exampleMoment)

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
    <AuthProvider>
      <AppProvider>
        <DropdownContext.Provider
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
        </DropdownContext.Provider>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
