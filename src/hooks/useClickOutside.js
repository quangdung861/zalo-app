import { AppContext } from "Context/AppProvider";
import { useContext, useEffect } from "react";

const useClickOutside = (ref, handler) => {
  const { isLoading } = useContext(AppContext);

  useEffect(() => {
    const listener = (event) => {
      // 1. Nếu đang loading thì không làm gì cả
      if (isLoading) return;

      // 2. Nếu không có ref hoặc click vào bên trong phần tử của ref thì không làm gì cả
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      // 3. Thực thi hàm callback (ví dụ: đóng modal)
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener); // Hỗ trợ cả thiết bị di động

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, isLoading]); // Re-run nếu isLoading hoặc handler thay đổi
};

export default useClickOutside;
