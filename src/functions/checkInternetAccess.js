export const checkInternetAccess = async () => {
  try {
    let result;
    if (navigator.onLine) {
      const response = await fetch(
        "https://565e-41-37-27-152.ngrok-free.app"
      );
      if (!response.ok) {
        result = false;
      } else {
        result = true;
      }
    } else {
      result = false;
    }
    return result;
  } catch (error) {
    console.error(error);
  }
};
