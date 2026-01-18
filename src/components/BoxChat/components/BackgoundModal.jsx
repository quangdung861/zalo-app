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


const BackgoundModal = () => {

    const [isMultiple, setIsMultiple] = useState(true);

    const renderListImg = () => {
        return backgroundImages.map((img, index) => {
            return <img src={img} alt="" key={index} className="img-item" />
        })
    }

    return (
        <div id="background-modal">
            <div className="header">
                <div className="header-left">
                    <i className="fa-solid fa-xmark"></i>
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
                        <div className="img-item btn-upload-backgound"></div>
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
