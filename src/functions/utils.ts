import moment from "moment-hijri";
import "../utils/ar-cl";
import i18n from "../i18n";

function t(key: string) {
  return i18n.t(key);
}

function getOrdinalNum(number: number) {
  if (i18n.language === "en") {
    switch (number) {
      case 1:
        return "1st";
      case 2:
        return "2nd";
      case 3:
        return "3rd";
      case 21:
        return "21st";
      case 22:
        return "22nd";
      case 23:
        return "23rd";
      case 31:
        return "31st";
      default:
        return `${number}th`;
    }
  } else {
    return number;
  }
}

export const getDayName: (dayNum: number) => string = (dayNum: number) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return t(days[dayNum]);
};

export const shortRomanDate: (date: string) => string = (date: string) => {
  const today = moment(date);
  const year = today.year();
  const month = today.format("MM");
  const day = today.format("DD");

  return `${year}-${month}-${day}`;
};

export const formatRomanDate: (date: string) => string = (date: string) => {
  const today = moment(date);
  const year = today.year();
  const month = today.month();
  const day = today.date();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dateString = `${getOrdinalNum(day)} ${t("of")} ${t(
    months[month]
  )} ${year}`;
  return dateString;
};

export const shortHijriDate: (date: string) => string = (date: string) => {
  const today = moment(date);
  const hijriDay = today.format("iDD"),
    hijriMonth = today.format("iMM"),
    hijriYear = today.format("iYYYY");

  var HijriDate = `${hijriYear}-${hijriMonth}-${hijriDay}`;
  return HijriDate;
};

export const formatHijriDate: (shortHijriDate: string) => string = (
  shortHijriDate
) => {
  const year = shortHijriDate.split("-")[0];
  const month = shortHijriDate.split("-")[1];
  const day = shortHijriDate.split("-")[2];

  const hijriMonths = [
    "",
    "المحرم",
    "صفر",
    "ربيع_أول",
    "ربيع_أخر",
    "جمادى_الأولى",
    "جمادى_الأخرى",
    "رجب",
    "شعبان",
    "رمضان",
    "شوال",
    "ذو_القعدة",
    "ذو_الحجة",
  ];

  const hijriDateString = `${getOrdinalNum(Number(day))} ${t("of")} ${t(
    hijriMonths[Number(month)]
  )} ${year}`;
  return hijriDateString;
};

export const hijriRomanMixedFullDate: (date: string) => string = (
  date: string
) => {
  const today = moment(date);
  const dayName = getDayName(today.day());
  const hijriFullDate = formatHijriDate(today.format("iYYYY-iMM-iDD"));
  const romanFullDate = formatRomanDate(today.format("YYYY-MM-DD"));

  const mixedFullString = `${dayName}، ${hijriFullDate} — ${romanFullDate}`;

  return mixedFullString;
};

export const hijriRomanMixedShortDate: (date: string) => string = (
  date: string
) => {
  const today = moment(date);
  const dayName = getDayName(today.day());
  const hijriShortDate = shortHijriDate(today.format("YYYY-MM-DD"));
  const romanShortDate = shortRomanDate(today.format("YYYY-MM-DD"));
  return `${dayName}\n${hijriShortDate} — ${romanShortDate}`;
};

export const timeNow: () => string = () => {
  const now = moment();
  const meridiem = now.format("A");
  return now.format("hh:mm:ss") + " " + t(meridiem);
};
