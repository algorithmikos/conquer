import { Timestamp } from "firebase/firestore";

export const todayDateTimestamp = (dayStart = "04:00", timemachine = "") => {
  if (timemachine) {
    const timemachineDate = new Date(timemachine);
    timemachineDate.setHours(0, 0, 0, 0);
    return Timestamp.fromDate(timemachineDate);
  }

  const today = new Date();
  const currentHour = today.getHours(); // Get the current server hour

  // Check if user has a dayStart time and it's valid format
  if (dayStart && isValidTimeFormat(dayStart)) {
    const userDayStartHour = parseInt(dayStart.split(":")[0]);

    // Check if user's day has already passed the server hour based on dayStart
    if (currentHour <= userDayStartHour || (dayStart && currentHour === 0)) {
      // Return yesterday's timestamp
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      const yesterdayTimestamp = Timestamp.fromDate(
        new Date(
          yesterday.getFullYear(),
          yesterday.getMonth(),
          yesterday.getDate()
        )
      );
      return yesterdayTimestamp;
    }
  }

  // Default case: return today's timestamp
  const todayTimestamp = Timestamp.fromDate(
    new Date(today.getFullYear(), today.getMonth(), today.getDate())
  );
  return todayTimestamp;
};

// Helper function to validate time format (HH:MM)
const isValidTimeFormat = (timeString) => {
  const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
  return timeRegex.test(timeString);
};
