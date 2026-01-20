export const convertImagesToBase64 = (files) => {
  return Promise.all(
    files.map((file) => {
      return new Promise((resolve, reject) => {
        if (file && file.type.startsWith("image/")) {
          const fileName = file.name;
          const type = file.type;
          const size = file.size;

          const reader = new FileReader();

          reader.onload = (e) => {
            const imageDataUrl = e.target.result;

            const thumbnail = createThumbnail2(imageDataUrl, fileName, type);

            const imageBase64FullInfo = {
              url: imageDataUrl,
              thumbnailURL: thumbnail,
              fileName,
              type,
              size,
            };

            resolve(imageBase64FullInfo);
          };

          reader.onerror = (error) => {
            reject(error);
          };

          reader.readAsDataURL(file);
        }
      });
    })
  );
};

function createThumbnail1(imageDataUrl) {
  // TẠO THUMBNAIL TỈ LỆ CỐ ĐỊNH NHƯNG KO CÓ OBJECTFIT:COVER ( KO BỊ CẮT NHƯNG BỊ VỞ TỈ LỆ)
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  const thumbnailWidth = 200; // Chiều rộng thumbnail mong muốn
  let thumbnailHeight = 200; // Chiều cao tự động theo tỉ lệ của ảnh gốc

  const image = new Image();
  image.src = imageDataUrl;

  // Đảm bảo ảnh đã được tải hoàn toàn trước khi tạo thumbnail
  image.onload = () => {
    canvas.width = thumbnailWidth;
    canvas.height = thumbnailHeight;

    // Vẽ ảnh lên canvas với kích thước thu nhỏ
    context.drawImage(image, 0, 0, thumbnailWidth, thumbnailHeight);
  };

  return canvas.toDataURL();
}

function createThumbnail2(imageDataUrl) {
  // TẠO THUMBNAIL VỚI TỈ LỆ NHƯ ẢNH GỐC (KHÔNG BỊ CẮT NHƯNG BỊ, NHƯNG ĐÔI KHI QUÁ NHỎ HOẶC QUÁ TO)
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  const thumbnailWidth = 200; // Chiều rộng thumbnail mong muốn
  let thumbnailHeight; // Chiều cao tự động theo tỉ lệ của ảnh gốc

  const image = new Image();
  image.src = imageDataUrl;

  // Đảm bảo ảnh đã được tải hoàn toàn trước khi tạo thumbnail
  image.onload = () => {
    const imageWidth = image.width;
    const imageHeight = image.height;

    // Tính toán chiều cao của thumbnail theo tỉ lệ của ảnh gốc
    thumbnailHeight = (thumbnailWidth / imageWidth) * imageHeight;

    canvas.width = thumbnailWidth;
    canvas.height = thumbnailHeight;

    // Vẽ ảnh lên canvas với kích thước thu nhỏ
    context.drawImage(image, 0, 0, thumbnailWidth, thumbnailHeight);

    // Tạo đường dẫn dữ liệu cho thumbnail
  };

  return canvas.toDataURL();
}

function createThumbnail3(imageDataUrl, fileName, type) {
  // TẠO THUMBNAIL VỚI TỈ LỆ CỐ ĐỊNH NHƯNG LÀ OBJECTFIT: COVER (BỊ CẮT NHƯNG KO BỊ VỠ TỈ LỆ)
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  const thumbnailWidth = 200; // Chiều rộng thumbnail mong muốn
  const thumbnailHeight = 200; // Chiều cao thumbnail mong muốn

  const image = new Image();
  image.src = imageDataUrl;

  // Đảm bảo ảnh đã được tải hoàn toàn trước khi tạo thumbnail
  image.onload = () => {
    const imageWidth = image.width;
    const imageHeight = image.height;

    let offsetX = 0;
    let offsetY = 0;
    let width = imageWidth;
    let height = imageHeight;

    // Tính toán vị trí và kích thước của ảnh trong thumbnail để giữ tỷ lệ và áp dụng object-fit: cover
    if (imageWidth > imageHeight) {
      // Ảnh ngang
      const ratio = thumbnailHeight / imageHeight;
      width = imageWidth * ratio;
      height = thumbnailHeight;
      offsetX = (thumbnailWidth - width) / 2;
    } else {
      // Ảnh dọc hoặc vuông
      const ratio = thumbnailWidth / imageWidth;
      width = thumbnailWidth;
      height = imageHeight * ratio;
      offsetY = (thumbnailHeight - height) / 2;
    }

    canvas.width = thumbnailWidth;
    canvas.height = thumbnailHeight;

    // Vẽ ảnh lên canvas với kích thước thu nhỏ và tỷ lệ giữa chiều rộng và chiều cao
    context.drawImage(image, offsetX, offsetY, width, height);

    // Tạo đường dẫn dữ liệu cho thumbnail
    // const thumbnailDataUrl = canvas.toDataURL();
  };

  return canvas.toDataURL();
}

export function normalizeImages(images) {
  return images.map(img =>
    typeof img === "string"
      ? { original: img, thumb: img }
      : { original: img.original, thumb: img.thumb || img.original }
  );
}