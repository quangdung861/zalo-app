import { useEffect, useState } from "react";
import "./styles.scss";

export default function ImagePreviewModal({ src, onClose }) {
    const [scale, setScale] = useState(1);
    const [origin, setOrigin] = useState({ x: 50, y: 50 });

    useEffect(() => {
        const onEsc = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onEsc);
        return () => window.removeEventListener("keydown", onEsc);
    }, [onClose]);

    const handleWheel = (e) => {
        e.preventDefault();

        const rect = e.currentTarget.getBoundingClientRect();

        // vị trí chuột trong ảnh (%)
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setOrigin({ x, y });

        const delta = e.deltaY > 0 ? -0.15 : 0.15;

        setScale((prev) => {
            const next = prev + delta;
            return Math.min(Math.max(next, 0.5), 3);
        });
    };

    if (!src) return null;

    return (
        <div className="image-preview-overlay" onClick={onClose}>
            <img
                src={src}
                alt=""
                className="image-preview"
                onClick={(e) => e.stopPropagation()}
                onWheel={handleWheel}
                onDoubleClick={() => setScale(1)}
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: `${origin.x}% ${origin.y}%`,
                    cursor: scale > 1 ? "zoom-out" : "zoom-in",
                }}
            />
        </div>
    );
}
