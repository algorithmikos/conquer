//! moment.js locale configuration
//! locale : Arabic (Classic) [ar-cl]
//! author : Umar Al-Jazzar: https://github.com/OmerHanRustem

import moment from "moment";

var pluralForm = function (n) {
    return n === 0
      ? 0
      : n === 1
      ? 1
      : n === 2
      ? 2
      : n % 100 >= 3 && n % 100 <= 10
      ? 3
      : n % 100 >= 11
      ? 4
      : 5;
  },
  plurals = {
    s: [
      "أقل من ثانية",
      "ثانية واحدة",
      ["ثانيتان", "ثانيتين"],
      "%d ثوان",
      "%d ثانية",
      "%d ثانية",
    ],
    m: [
      "أقل من دقيقة",
      "دقيقة واحدة",
      ["دقيقتان", "دقيقتين"],
      "%d دقائق",
      "%d دقيقة",
      "%d دقيقة",
    ],
    h: [
      "أقل من ساعة",
      "ساعة واحدة",
      ["ساعتان", "ساعتين"],
      "%d ساعات",
      "%d ساعة",
      "%d ساعة",
    ],
    d: [
      "أقل من يوم",
      "يوم واحد",
      ["يومان", "يومين"],
      "%d أيام",
      "%d يومًا",
      "%d يوم",
    ],
    M: [
      "أقل من شهر",
      "شهر واحد",
      ["شهران", "شهرين"],
      "%d أشهر",
      "%d شهرا",
      "%d شهر",
    ],
    y: [
      "أقل من عام",
      "عام واحد",
      ["عامان", "عامين"],
      "%d أعوام",
      "%d عامًا",
      "%d عام",
    ],
  },
  pluralize = function (u) {
    return function (number, withoutSuffix, string, isFuture) {
      var f = pluralForm(number),
        str = plurals[u][pluralForm(number)];
      if (f === 2) {
        str = str[withoutSuffix ? 0 : 1];
      }
      return str.replace(/%d/i, number);
    };
  },
  months = [
    "كانون الأخر",
    "شباط",
    "آذار",
    "نيسان",
    "أيار",
    "حزيران",
    "تموز",
    "آب",
    "أيلول",
    "تشرين الأول",
    "تشرين الأخر",
    "كانون الأول",
  ];

export default moment.defineLocale("ar-cl", {
  months: months,
  monthsShort: months,
  weekdays: "الأحد_الاثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),
  weekdaysShort: "أحد_اثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),
  weekdaysMin: "ح_ن_ث_ر_خ_ج_س".split("_"),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: "hh:mm A",
    LTS: "hh:mm:ss A",
    L: "D/\u200FM/\u200FYYYY",
    LL: "D MMMM YYYY",
    LLL: "D MMMM YYYY HH:mm",
    LLLL: "dddd D MMMM YYYY HH:mm",
  },
  meridiemParse: /ص|م/,
  isPM: function (input) {
    return "م" === input;
  },
  meridiem: function (hour, minute, isLower) {
    if (hour < 12) {
      return "ص";
    } else {
      return "م";
    }
  },
  calendar: {
    sameDay: "[اليوم عند الساعة] LT",
    nextDay: "[غدًا عند الساعة] LT",
    nextWeek: "dddd [عند الساعة] LT",
    lastDay: "[أمس عند الساعة] LT",
    lastWeek: "dddd [عند الساعة] LT",
    sameElse: "L",
  },
  relativeTime: {
    future: "بعد %s",
    past: "منذ %s",
    s: pluralize("s"),
    ss: pluralize("s"),
    m: pluralize("m"),
    mm: pluralize("m"),
    h: pluralize("h"),
    hh: pluralize("h"),
    d: pluralize("d"),
    dd: pluralize("d"),
    M: pluralize("M"),
    MM: pluralize("M"),
    y: pluralize("y"),
    yy: pluralize("y"),
  },
  postformat: function (string) {
    return string.replace(/,/g, "،");
  },
  week: {
    dow: 0, // Sunday is the first day of the week.
    doy: 4, // The week that contains Jan 4th is the first week of the year.
  },
});
