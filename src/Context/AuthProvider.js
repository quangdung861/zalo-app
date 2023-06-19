import React, { createContext, useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import zlogo from "assets/logo/zlogo.png";

export const AuthContext = createContext();

const loading = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "450px",
  flexDirection: "column",
};

const spinner = {
  fontSize: "30px",
  color: "#007bff",
  marginBottom: "24px",
};

const image = {
  width: "100px",
  objectFit: "cover",
  marginBottom: "150px",
};

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribed = auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, email, uid, photoURL } = user;
        setUser({ displayName, email, uid, photoURL });
        setIsLoading(false);
        return navigate("/");
      }
      setIsLoading(false);
      // navigate("/login");
    });

    return () => {
      unsubscribed();
    };
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {isLoading ? (
        <div style={loading}>
          <img src={zlogo} alt="zalo" style={image} />
          <i className="fas fa-spinner fa-spin" style={spinner}></i>
          <span>Đang đăng nhập...</span>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
