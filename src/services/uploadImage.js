// uploadImageToCloudinary
export async function uploadImage(file) {
  const formData = new FormData();

  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
  );
  formData.append("folder", "zalo-app");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!res.ok) {
    throw new Error("Upload failed");
  }

  const data = await res.json();

  const original = data.secure_url;

  // tạo thumbnail bằng transform URL
  const thumbnail = original.replace(
    "/upload/",
    "/upload/w_400,h_400,c_fill,q_auto,f_auto/",
  );

  return {
    original,
    thumbnail,
  };
}
