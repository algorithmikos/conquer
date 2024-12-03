export async function convertImageToBase64(url: string): Promise<string> {
  return fetch(url, {
    method: "GET",
    mode: "cors", // Handle cross-origin requests
    credentials: "include", // Include cookies if needed
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch image.");
      }
      return response.blob(); // Convert the response to a blob
    })
    .then((blob) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob); // Read the blob as a data URL (base64)
      });
    });
}

export async function convertBlobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () =>
      reject(new Error("Failed to convert Blob to Base64."));
    reader.readAsDataURL(blob);
  });
}

export async function deleteCachedProfilePicture(url: string) {
  const cache = await caches.open("profile-pictures-cache");
  await cache.delete(url);
  localStorage.removeItem("pp");
}
