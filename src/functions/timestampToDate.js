import { Timestamp } from "firebase/firestore";

export const timestampToDate = (timestamp) => {
  if (timestamp) {
    const seconds = timestamp.seconds;
    const nanoseconds = timestamp.nanoseconds;

    const newTimestamp = new Timestamp(seconds, nanoseconds);

    const timestampDate = new Date(newTimestamp.toDate());
    const timestampFormattedDate = timestampDate.toISOString().slice(0, 10);

    return timestampFormattedDate;
  } else {
    return "";
  }
};

export const timestampCompare = (timestamp1, timestamp2) => {
  const firstTimestamp = new Timestamp(
    timestamp1.seconds,
    timestamp1.nanoseconds
  );

  const result = new Timestamp(
    timestamp2.seconds,
    timestamp2.nanoseconds
  ).isEqual(firstTimestamp);

  return result;
};
