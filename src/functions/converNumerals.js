export function convertToEasternNumerals(numberString) {
  if (numberString) {
    const westernNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const easternNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

    // Create a map for efficient lookup
    const conversionMap = new Map();
    for (let i = 0; i < westernNumbers.length; i++) {
      conversionMap.set(westernNumbers[i], easternNumbers[i]);
    }

    // Replace western numbers with their eastern equivalents
    const convertedString = String(numberString)
      .split("")
      .map((char) => {
        return conversionMap.get(char) || char; // Return original character if not a number
      })
      .join("");

    return convertedString;
  } else {
    return "";
  }
}
