import React, { useState } from "react";
import "./BackgoundModal.scss";
import img1 from "assets/backgound/img1.jpg";
import img2 from "assets/backgound/img2.jpg";
import img3 from "assets/backgound/img3.jpg";
import img4 from "assets/backgound/img4.jpg";
import img5 from "assets/backgound/img5.jpg";
import img6 from "assets/backgound/img6.jpg";
import img7 from "assets/backgound/img7.jpg";
import img8 from "assets/backgound/img8.jpg";
import img9 from "assets/backgound/img9.jpg";
import img10 from "assets/backgound/img10.jpg";
import img11 from "assets/backgound/img11.jpg";
import img12 from "assets/backgound/img12.jpg";
import img13 from "assets/backgound/img13.jpg";
import img14 from "assets/backgound/img14.jpg";

export const backgroundImages = [
    img13, img14, img1, img2, img3, img4, img5, img6,
    img7, img8, img9, img10, img11, img12
];

const BackgoundModal = ({ setIsShowBackgroundModal }) => {

    const [isMultiple, setIsMultiple] = useState(true);

    // const setting = {
    //     background: "",
    //     backgroundMember: {
    //         [uid]: {
    //             backgrounds: [],
    //             currentIndex: 0 
    //         }
    //     }
    // }
    // Thay ảnh chỉ phía tôi thì tải ảnh mới vào ví dụ nó sẽ thành ["img3", "img2", "img1"] và set currentIndex thành 1 = img3,
    // Thay ảnh cho mọi người thì tải ảnh mới vào ví dụ nó sẽ thành ["img3", "img2", "img1"] và set currentIndex thành 1 = img3, 
    // có thêm bước xóa tất cả currentIndex của mọi người khác về null, sau đó gán background: "img3"
    // cách hiển thị trên UI ưu tiên hiển thị nếu currentIndex khác null, nếu là null thì hiển thị background
    // xóa ảnh thì background vẫn tồn tại trừ khi set lại 1 ảnh mới, riêng người xóa sẽ bị set lại currentIndex: 0
    // refacetor lại dùng link cả, ko dùng base64 nữa vì nặng k cân đc

    const renderListImg = () => {
        return backgroundImages.map((img, index) => {
            return <img src={img} alt="" key={index} className="img-item" />
        })
    }

    return (
        <div id="background-modal">
            <div className="header">
                <div className="header-left">
                    <i className="fa-solid fa-xmark" onClick={() => setIsShowBackgroundModal(false)}></i>
                    <span>Đổi hình nền</span>
                </div>
                <div className="header-right">
                    <i className="fa-solid fa-check"></i>
                    <span>XONG</span>
                </div>
            </div>
            <div className="content">
                <div className="img-list-wrapper">
                    <div className="img-list">
                        <div className="img-item btn-upload-backgound"><i className="fa-solid fa-camera"></i></div>
                        {renderListImg()}
                    </div>
                </div>
                <div className="option">
                    <i className={`${isMultiple ? "fa-solid fa-circle-check" : "fa-regular fa-circle"} `} onClick={() => setIsMultiple(!isMultiple)}></i>
                    <span>Đổi hình nền cho cả hai bên</span>
                </div>
            </div>
        </div>
    );
};

export default BackgoundModal;
