import useClickOutside from "hooks/useClickOutside";
import { useState, useRef, useEffect } from "react";

const CustomSelect = ({ placeholder, options, value, onChange, width = 120, disabled }) => {
    const [open, setOpen] = useState(false);
    const ModalRef = useRef(null);

    useEffect(() => {
        if (disabled) {
            setOpen(false);
        }
    }, [disabled]);

    useClickOutside(ModalRef, () => {
        setOpen(false);
    });

    const handleToggle = () => {
        if (disabled) return;
        setOpen(!open);
    };

    return (
        <>
            <style>
                {`
.select-wrapper {
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
  background: #fff;
  cursor: pointer;
}

.custom-select.disabled .select-trigger {
  background: #f5f5f5;
  color: #aaa;
  cursor: not-allowed;
}

.custom-select.open .select-trigger {
  border-color: #1677ff;
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.2);
}

.select-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 100%;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 6px 0;
  z-index: 20;
  max-height: 200px;
  overflow-y: auto;
}

.option {
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.option:hover {
  background: #f5f5f5;
}

.option.selected {
  background: #e6f4ff;
  color: #1677ff;
  font-weight: 500;
}
`}
            </style>

            <div className="select-wrapper" style={{ width }} ref={ModalRef}>

                <div
                    className={`custom-select ${open ? "open" : ""} ${disabled ? "disabled" : ""}`}
                    tabIndex={disabled ? -1 : 0}
                    onClick={handleToggle}
                >
                    <div className="select-trigger">
                        <span className="value">{value || placeholder}</span>
                        <i className="fa-solid fa-chevron-down"></i>
                    </div>

                    {open && !disabled && (
                        <div className="select-dropdown">
                            {options.map((opt) => (
                                <div
                                    key={opt}
                                    className={`option ${opt === value ? "selected" : ""}`}
                                    onClick={() => {
                                        onChange(opt);
                                        setOpen(false);
                                    }}
                                >
                                    {opt}
                                    {opt === value && <i className="fa-solid fa-check"></i>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CustomSelect;
