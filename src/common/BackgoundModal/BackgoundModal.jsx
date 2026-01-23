import React, { useState, useContext } from "react";
import "./BackgoundModal.scss";
import { uploadImage } from "services/uploadImage";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "firebaseConfig";
import { AppContext } from "Context/AppProvider";

const BackgoundModal = ({ initInfoBackground, backgrounds, currentIndex, setCurrentIndex, uid, members, roomId, setIsShowBackgroundModal, text }) => {
    const { startLoading, stopLoading } = useContext(AppContext);
    const [isMultiple, setIsMultiple] = useState(true);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            startLoading();
            const image = await uploadImage(file);
            const roomRef = doc(db, "rooms", roomId);

            const updates = {
                [`settings.backgroundMembers.${uid}.background`]: image,
            }

            await updateDoc(roomRef, updates);
            setCurrentIndex(0);
        } catch (err) {
            console.error("Upload background error:", err);
        } finally {
            stopLoading();
        }
    };

    const handleChangeReal = async () => {
        try {
            startLoading();
            const roomRef = doc(db, "rooms", roomId);

            if (isMultiple) {
                const updates = {
                    "settings.background": backgrounds[currentIndex],
                    [`settings.backgroundMembers.${uid}.currentIndex`]: currentIndex,
                }

                members.forEach((memberId) => {
                    if (memberId !== uid) {
                        updates[`settings.backgroundMembers.${memberId}.currentIndex`] = null;
                    }
                });

                await updateDoc(roomRef, updates);
            } else {
                await updateDoc(roomRef, {
                    [`settings.backgroundMembers.${uid}.currentIndex`]: currentIndex,
                });
            }
            setIsShowBackgroundModal(false)

        } catch (err) {
            console.error("Upload background error:", err);
        } finally {
            stopLoading();
        }
    }

    const renderListImg = () => {
        return backgrounds.map((img, index) => {
            return <img src={img?.thumbnail} alt="" key={index}
                className={currentIndex === index ? "img-item --active" : "img-item"}
                onClick={() => {
                    setCurrentIndex(index)
                }} />
        })
    }

    return (
        <div id="background-modal">
            <div className="header">
                <div className="header-left">
                    <i className="fa-solid fa-xmark" onClick={() => { initInfoBackground(); setIsShowBackgroundModal(false) }}></i>
                    <span>Đổi hình nền</span>
                </div>
                <div className="header-right" onClick={() => handleChangeReal()}>
                    <i className="fa-solid fa-check"></i>
                    <span>XONG</span>
                </div>
            </div>
            <div className="content">
                <div className="img-list-wrapper">
                    <div className="img-list">
                        <label
                            htmlFor="upload-img"
                            className="img-item btn-upload-backgound"
                            style={{ cursor: "pointer" }}
                        >
                            <i className="fa-solid fa-camera"></i>
                        </label>
                        <input
                            id="upload-img"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) => handleUpload(e)}
                        />
                        {renderListImg()}
                    </div>
                </div>
                <div className="option">
                    <i className={`${isMultiple ? "fa-solid fa-circle-check" : "fa-regular fa-circle"} `} onClick={() => setIsMultiple(!isMultiple)}></i>
                    <span>{text}</span>
                </div>
            </div>
        </div>
    );
};

export default BackgoundModal;
