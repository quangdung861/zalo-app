import { useState, useCallback } from "react";

export const useImagePreview = () => {
  const [preview, setPreview] = useState(null);

  const openPreview = useCallback((src) => {
    setPreview(src);
  }, []);

  const closePreview = useCallback(() => {
    setPreview(null);
  }, []);

  return {
    preview,
    openPreview,
    closePreview,
  };
};