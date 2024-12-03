import moment from "moment";

export const dateISO = (date) => {
  return moment(date).format("YYYY-MM-DD");
};
