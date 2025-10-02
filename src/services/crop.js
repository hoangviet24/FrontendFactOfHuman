export default function getCroppedImg(file, crop) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.src = reader.result;
    };

    img.onload = () => {
      // Dùng vùng crop làm kích thước canvas
      const canvas = document.createElement("canvas");
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");

      // Vẽ ảnh vào canvas với crop
      ctx.drawImage(
        img,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

      // Xác định bán kính ellipse dựa vào tỉ lệ
      let rx, ry;
      if (crop.width > crop.height) {
        rx = crop.width / 2;
        ry = crop.height / 2 * (crop.height / crop.width);
      } else {
        rx = crop.width / 2 * (crop.width / crop.height);
        ry = crop.height / 2;
      }

      // Mask ellipse
      const mask = document.createElement("canvas");
      mask.width = canvas.width;
      mask.height = canvas.height;
      const maskCtx = mask.getContext("2d");

      maskCtx.beginPath();
      maskCtx.ellipse(mask.width / 2, mask.height / 2, rx, ry, 0, 0, Math.PI * 2);
      maskCtx.clip();
      maskCtx.drawImage(canvas, 0, 0);

      mask.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Không thể crop ảnh"));
        },
        "image/jpeg",
        1
      );
    };

    reader.readAsDataURL(file);
  });
}
