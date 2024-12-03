export const generateUniqueId = (value) => {
  if (value) {
    return value;
  } else {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substr(2);
    return randomness + dateString;
  }
};
