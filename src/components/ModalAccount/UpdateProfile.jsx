import React, { useContext, useEffect, useState } from "react";
import CustomSelect from "./CustomSelect";
import { GENDER, GENDER_LABEL } from "constants/backend/gender.enum";
import { parseISODate, toISODate } from "utils/date";
import { doc, setDoc } from "firebase/firestore";
import { AppContext } from "Context/AppProvider";
import { generateKeywords } from "services";
import { db } from "firebaseConfig";

const UpdateProfile = ({ userId, setIsShowUpdateProfile, setIsShowOverlayModal, profile, setProfile, accountSelected }) => {

    const { startLoading, stopLoading } =
        useContext(AppContext);
    const date = parseISODate(profile.dateOfBirth)
    const [day, setDay] = useState(date.day);
    const [month, setMonth] = useState(date.month);
    const [year, setYear] = useState(date.year);
    const [error, setError] = useState({
        displayName: "",
        dateOfBirth: "",
    })

    useEffect(() => {
        if (error.displayName || error.dateOfBirth) {
            setError({ displayName: "", dateOfBirth: "" });
        }
    }, [profile, day, month, year]);

    useEffect(() => {
        if (!day || !month || !year) return;

        const maxDay = new Date(year, month, 0).getDate();
        if (Number(day) > maxDay) {
            setDay("");
        }
    }, [month, year]);

    const getDaysInMonth = (year, month) => {
        if (!year || !month) return [];

        const days = new Date(year, month, 0).getDate();
        return Array.from({ length: days }, (_, i) =>
            String(i + 1).padStart(2, "0")
        );
    };

    const getYears = (start = 1950) => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: currentYear - start + 1 }, (_, i) =>
            String(start + i)
        );
    };

    const handleChange = (key, value) => {
        setProfile((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const currentDateOfBirth =
        day && month && year ? toISODate(day, month, year) : "";

    const isChanged =
        profile.displayName !== (accountSelected.displayName ?? "") ||
        profile.status !== (accountSelected.status ?? "") ||
        profile.phoneNumber !== (accountSelected.phoneNumber ?? "") ||
        profile.sex !== (accountSelected.sex ?? "") ||
        currentDateOfBirth !== (accountSelected.dateOfBirth ?? "");

    const submitUpdateProfile = async () => {
        startLoading();
        const userInfoRef = doc(db, "users", userId);
        let dateOfBirth = null;

        const hasAny = day || month || year;

        const hasAll = day && month && year;

        if (hasAny && !hasAll) {
            setError((prev) => ({ ...prev, dateOfBirth: "Vui lòng chọn đầy đủ ngày, tháng và năm sinh" }));
            return;
        }

        if (hasAll) {
            dateOfBirth = toISODate(day, month, year);
        }

        if (!profile.displayName) {
            setError((prev) => ({ ...prev, displayName: "Vui lòng điền tên hiển thị" }));
            return;
        }

        let keywords = generateKeywords(profile.displayName);
        await setDoc(
            userInfoRef,
            {
                ...profile,
                ...(keywords && { keywords: keywords }),
                ...(dateOfBirth && { dateOfBirth: dateOfBirth }),
            },
            {
                merge: true,
            }
        );
        setProfile(
            {
                displayName: profile.displayName ?? "",
                status: profile.status ?? "",
                phoneNumber: profile.phoneNumber ?? "",
                sex: profile.sex ?? "",
                dateOfBirth: dateOfBirth ?? "",
            });
        setIsShowUpdateProfile(false);
        stopLoading();
    };

    const handleBack = () => {
        setProfile(
            {
                displayName: accountSelected.displayName ?? "",
                status: accountSelected.status ?? "",
                phoneNumber: accountSelected.phoneNumber ?? "",
                sex: accountSelected.sex ?? "",
                dateOfBirth: accountSelected.dateOfBirth ?? "",
            });
        setIsShowUpdateProfile(false);
    }

    return (
        <>
            <style>
                {`
        .title-left {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 6px;
        }
        .btn-back {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
        border-radius: 50px;
        cursor: pointer;
        }
        .btn-back:hover {
        background-color: #f1f1f1;
        }
        .sub-title {
        font-size: 16px;
        font-weight: 500;
        margin: 20px 0;
        }
        .modal-overlay .container-account-info .account-info .box-account-info {
        padding: 20px;
        overflow: visible;
        overflow-y: visible;
        }

             .modal-overlay .container-account-info .account-info .box-account-info .info-item {
             margin-bottom: 16px;
                }
        
        .field-label {
               display: block;
               margin-bottom: 8px;     
        }
        .file-input {
            width: 100%;
            height: 32px;
            padding: 0 12px;
            border-radius: 4px;
            border: 1px solid #ccc;
            &:focus {
                border: none;
                outline: 1px solid #3989ff;
            }
            &:hover {
                background-color: #f1f1f1;
            }
        }
            .error-message {
                    display: inline-block;
                    margin-top: 6px;
                    font-size: 12px;
                    color: red;
            }
            .gender-group {
        display: flex;
        gap: 24px;
        align-items: center;
        margin-bottom: 20px;
        }

        .radio-item {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 14px;
        user-select: none;
        }

        /* Ẩn radio mặc định */
        .radio-item input {
        display: none;
        }

        .custom-radio {
        width: 16px;
        height: 16px;
        border: 2px solid #bdbdbd;
        border-radius: 50%;
        margin-right: 8px;
        position: relative;
        transition: border-color 0.2s ease;
        }

        /* Chấm tròn bên trong */
        .custom-radio::after {
        content: "";
        width: 8px;
        height: 8px;
        background: #1677ff;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: opacity 0.2s ease;
        }

        /* Khi checked */
        .radio-item input:checked + .custom-radio {
        border-color: #1677ff;
        }

        .radio-item input:checked + .custom-radio::after {
        opacity: 1;
        }

        .label-text {
        margin-left: 2px;
        }
        .dob-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
        font-size: 14px;
        }

        .dob-label {
        font-weight: 500;
        color: #333;
        }

        .dob-selects {
        display: flex;
        gap: 12px;
        }

        .dob-selects select {
        width: 96px;
        height: 40px;
        padding: 0 12px;
        border: 1px solid #d9d9d9;
        border-radius: 6px;
        font-size: 14px;
        background-color: #fff;
        cursor: pointer;
        }

        /* Focus */
        .dob-selects select:focus {
        border-color: #1677ff;
        outline: none;
        box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.15);
        }

        .select-wrapper {
  width: 120px;
  font-family: system-ui, sans-serif;
}

.select-label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
}

.custom-select {
  position: relative;
}

.select-trigger {
  height: 40px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  background: #fff;
}

.custom-select:focus .select-trigger,
.custom-select.open .select-trigger {
  border-color: #1677ff;
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.2);
  outline: none;
}

.select-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 100%;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  padding: 6px 0;
  display: none;
  z-index: 10;
}

.custom-select.open .select-dropdown {
  display: block;
}

.option {
  padding: 10px 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.option:hover {
  background: #f5f5f5;
}

.option.selected {
  background: #e6f4ff;
  color: #1677ff;
  font-weight: 500;
}
.action-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #e5e5e5;
}

/* base button */
.btn {
  min-width: 96px;
  height: 40px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

/* Hủy */
.btn-cancel {
  background: #e5e7eb;
  color: #111827;
}

.btn-cancel:hover {
  background: #d1d5db;
}

/* Cập nhật */
.btn-update {
  background: #3b82f6;
  color: #ffffff;
}

.btn-update:hover {
  background: #2563eb;
}

/* disabled giống hình */
.btn-update:disabled {
  background: #93c5fd;
  cursor: not-allowed;
}

            
        `}
            </style>
            <div className="account-info">
                <div className="title">
                    <div className="title-left">
                        <i
                            class="fa-solid fa-angle-left btn-back"
                            onClick={() => handleBack()}
                        ></i>
                        <span>Cập nhật thông tin cá nhân</span>
                    </div>
                    <i className="fa-solid fa-xmark" onClick={() => setIsShowOverlayModal(false)}></i>
                </div>
                <div className="box-account-info">
                    <div className="info-item">
                        <label id="displayName" className="field-label">
                            Tên hiển thị
                        </label>
                        <input
                            type="text"
                            id="displayName"
                            className="file-input"
                            spellCheck="false"
                            value={profile.displayName}
                            onChange={(e) => handleChange("displayName", e.target.value)}
                        />
                        {error && <span className="error-message">{error.displayName}</span>}
                    </div>
                    <div className="info-item">
                        <label id="displayName" className="field-label">
                            Tiểu sử
                        </label>
                        <input
                            type="text"
                            id="status"
                            className="file-input"
                            spellCheck="false"
                            value={profile.status}
                            onChange={(e) => handleChange("status", e.target.value)}
                        />
                    </div>
                    <div className="info-item">
                        <label id="phoneNumber" className="field-label">
                            Số điện thoại
                        </label>
                        <input
                            type="number"
                            id="phoneNumber"
                            className="file-input"
                            spellCheck="false"
                            value={profile.phoneNumber}
                            onChange={(e) => handleChange("phoneNumber", e.target.value)}
                        />
                    </div>
                    <div className="sub-title">Thông tin cá nhân</div>
                    <div class="gender-group">
                        <label class="radio-item">
                            <input type="radio" name="gender" value={GENDER.MALE} checked={profile.sex === GENDER.MALE}
                                onChange={() => handleChange("sex", GENDER.MALE)} />
                            <span class="custom-radio"></span>
                            <span class="label-text">{GENDER_LABEL[GENDER.MALE]}</span>
                        </label>

                        <label class="radio-item">
                            <input type="radio" name="gender" value={GENDER.FEMALE}
                                checked={profile.sex === GENDER.FEMALE}
                                onChange={() => handleChange("sex", GENDER.FEMALE)} />
                            <span class="custom-radio"></span>
                            <span class="label-text">{GENDER_LABEL[GENDER.FEMALE]}</span>
                        </label>
                    </div>
                    <div className="info-item">
                        <label className="field-label">Ngày sinh</label>
                        <div style={{ display: "flex", gap: 12 }}>
                            {/* Ngày */}
                            <CustomSelect
                                options={getDaysInMonth(year, month)}
                                value={day}
                                onChange={setDay}
                                placeholder="Ngày"
                                disabled={!year || !month}
                            />

                            {/* Tháng */}
                            <CustomSelect
                                options={Array.from({ length: 12 }, (_, i) =>
                                    String(i + 1).padStart(2, "0")
                                )}
                                value={month}
                                onChange={setMonth}
                                placeholder="Tháng"
                                disabled={!year}
                            />

                            {/* Năm */}
                            <CustomSelect
                                options={getYears(1950)}
                                value={year}
                                onChange={setYear}
                                placeholder="Năm"
                            />
                        </div>
                        {error && <span className="error-message">{error.dateOfBirth}</span>}
                    </div>
                </div>
                <div className="action-footer">
                    <button className="btn btn-cancel" onClick={() => handleBack()}>Hủy</button>
                    <button className="btn btn-update" onClick={() => submitUpdateProfile()} disabled={!isChanged}>Cập nhật</button>
                </div>
            </div>
        </>
    );
};

export default UpdateProfile;
