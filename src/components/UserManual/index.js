import React from "react";

import "./styles.scss";
const UserManual = ({ selectedGroupMessaging }) => {
  return (
    <div className="user-manual">
      <div className="user-manual__item">
        <div className="left left--users">
          <i className="fa-solid fa-users"></i>
        </div>
        <div className="right">
          <span style={{ color: "#005ae0", cursor: "pointer" }}>
            Mời thêm bạn
          </span>{" "}
          vào nhóm {selectedGroupMessaging.name}
        </div>
      </div>
      <div className="user-manual__item">
        <div className="left left--tag">
          <span>@</span>
        </div>
        <div className="right">
          Gõ @ để{" "}
          <span style={{ color: "#005ae0", cursor: "pointer" }}>
            Nhắc đến và thu hút sự chú ý
          </span>{" "}
          của bạn bè trong nhóm
        </div>
      </div>
      <div className="user-manual__item">
        <div className="left left--forward">
          <i className="fa-solid fa-quote-left fa-rotate-180"></i>
        </div>
        <div className="right">
          Chọn <span style={{ fontWeight: 500 }}>"Trả lời"</span> để trích dẫn
          nội dung tin nhắn
        </div>
      </div>
    </div>
  );
};

export default UserManual;
