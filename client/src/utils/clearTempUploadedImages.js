export function clearTempUploadedImages() {
  const tempImages = JSON.parse(
    localStorage.getItem("temp_uploaded_images") || "[]"
  );

  if (tempImages.length > 0) {
    const url = `${
      import.meta.env.VITE_API_ROUTE
    }/service/delete-service-form-image`;

    tempImages.forEach((img) => {
      const blob = new Blob([JSON.stringify({ public_id: img.public_id })], {
        type: "application/json",
      });

      navigator.sendBeacon(url, blob);
    });

    localStorage.removeItem("temp_uploaded_images");
  }
}
