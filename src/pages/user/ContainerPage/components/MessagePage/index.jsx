import React, { useContext } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as S from "./styles";
import { UserLayoutContext } from "layouts/user/UserLayout";
import { AppContext } from "Context/AppProvider";

const MessagePage = () => {
  const { isShowBoxChat } = useContext(UserLayoutContext);
  const { rooms, userInfo } = useContext(AppContext);

  var settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  function NextArrow(props) {
    const { onClick } = props;
    return (
      <div className="next-arrow-slide" onClick={onClick}>
        <i className="fa-solid fa-chevron-right"></i>
      </div>
    );
  }

  function PrevArrow(props) {
    const { onClick } = props;
    return (
      <div className="prev-arrow-slide" onClick={onClick}>
        <i className="fa-solid fa-chevron-left"></i>
      </div>
    );
  }

  const slideList = [
    {
      title: "Nhắn tin nhiều hơn, soạn thảo ít hơn",
      description: (
        <>
          Sử dụng <span style={{ fontWeight: 500 }}>Tin Nhắn Nhanh</span> để lưu
          sẳn các tin nhắn thường dùng và gửi nhanh trong hội thoại bất kỳ.
        </>
      ),
      imageSrc:
        "https://chat.zalo.me/assets/quick-message-onboard.3950179c175f636e91e3169b65d1b3e2.png",
    },
    {
      title: "Tin nhắn tự xóa",
      description: (
        <>Nội dung tin nhắn được mã hóa suốt trong quá trình gửi và nhận</>
      ),
      imageSrc:
        "https://chat.zalo.me/assets/vanish_onboard.95edcd15d875cae4d6d504d739eaa977.png",
    },
    {
      title: "Mã hóa đầu cuối",
      description: (
        <>Từ giờ tin nhắn có thể tự động xóa sau khoảng thời gian nhất định</>
      ),
      imageSrc:
        "https://chat.zalo.me/assets/vanish_onboard.95edcd15d875cae4d6d504d739eaa977.png",
    },
    {
      title: "Gọi nhóm và làm việc hiệu quả với Zalo Group Call",
      description: <>Trao đổi công việc mọi lúc mọi nơi</>,
      imageSrc:
        "https://chat.zalo.me/assets/inapp-welcome-screen-0.19afb7ab96c7506bb92b41134c4e334c.jpg",
    },
    {
      title: "Trải nghiệm xuyên suốt",
      description: (
        <>
          Kết nối và giải quyết công việc trên mọi thiết bị với giữ liệu luôn
          được đồng bộ
        </>
      ),
      imageSrc:
        "https://chat.zalo.me/assets/inapp-welcome-screen-04.ade93b965a968b16f2203e9d63b283a7.jpg",
    },
    {
      title: "Gửi File nặng?",
      description: <>Đã có Zalo PC "xử hết"</>,
      imageSrc:
        "https://chat.zalo.me/assets/inapp-welcome-screen-03.3f97d49ceecb950d95382b3d8fd4f0f1.png",
    },
    {
      title: "Chat nhóm với đồng nghiệp",
      description: (
        <>Tiện lợi hơn nhờ, nhờ các công cụ hổ trợ chat trên máy tính</>
      ),
      imageSrc:
        "https://chat.zalo.me/assets/inapp-welcome-screen-02.7f8cab265c34128a01a19f3bcd5f327a.jpg",
    },
    {
      title: "Giải quyết công việc hiệu quả hơn lên đến 40%",
      description: <>Với Zalo PC</>,
      imageSrc:
        "https://chat.zalo.me/assets/inapp-welcome-screen-04.ade93b965a968b16f2203e9d63b283a7.jpg",
    },
  ];

  const renderRooms = () => {
    return rooms?.map((room) => {
      return (
        <div key={room.id} className="room-item">
          <div className="room-item__left">
            <img src={room.avatar} alt="" />
            <div className="info">
              <div className="room-name">{room.name}</div>
              <div className="new-message">{room.description}</div>
            </div>
          </div>
          <div className="room-item__right">5 giờ</div>
        </div>
      );
    });
  };

  const renderSlideList = () => {
    return slideList.map((item, index) => {
      return (
        <div className="slide-item" key={index}>
          <div className="slide-item__image">
            <img src={item.imageSrc} alt="" />
          </div>
          <div className="slide-item__text">
            <div className="title">{item.title}</div>
            <div className="description">{item.description}</div>
          </div>
        </div>
      );
    });
  };

  return (
    <S.Wrapper>
      <S.Container>
        <div className="message">
          <div className="section-left">
            <div className="section-left__header">
              <div className="search">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input placeholder="Tìm kiếm" />
              </div>
              <div className="add-friend">
                <i className="fa-solid fa-user-plus icon"></i>
              </div>
              <div className="create-groud">
                <i className="fa-solid fa-users icon"></i>
              </div>
            </div>
            <div className="section-left__content">
              <div className="menu">
                <div className="menu__left">
                  <div className="menu-left__item">Tất cả</div>
                  <div className="menu-left__item">Chưa đọc</div>
                </div>
                <div className="menu__right">
                  <div className="menu-right__item">Phân loại icon</div>
                  <div className="menu-right__item">more</div>
                </div>
              </div>
              <div className="room-list">{renderRooms()}</div>
            </div>
          </div>
          {!isShowBoxChat && (
            <div className="section-right">
              <div className="content-welcome">
                <div className="content-welcome__header">
                  <h2>Chào mừng đến với Zalo PC!</h2>
                  <div>
                    khám phá tiện ích hổ trợ làm việc và trò chuyện cùng người
                    thân, bạn bè được tối ưu hóa cho máy tính của bạn.
                  </div>
                </div>
                <Slider {...settings} className="slide-list">
                  {renderSlideList()}
                </Slider>
              </div>
            </div>
          )}
        </div>
      </S.Container>
    </S.Wrapper>
  );
};

export default MessagePage;
