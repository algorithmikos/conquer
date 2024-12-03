import { SxProps, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const GreetingMsg: React.FC<{ sx: SxProps }> = ({ sx }) => {
  const { t, i18n } = useTranslation();
  /* @ts-ignore */
  const authState = JSON.parse(localStorage.getItem("authState"));
  const [greeting, setGreeting] = React.useState("Greetings");

  useEffect(() => {
    const determineGreeting = () => {
      const hour = new Date().getHours();

      if (hour >= 4 && hour < 12) {
        setGreeting("Good Morning");
      } else if (hour >= 12 && hour < 18) {
        setGreeting("Good Afternoon");
      } else if (hour >= 18 && hour <= 24) {
        setGreeting("Good Evening");
      } else {
        setGreeting("Good Night");
      }
    };

    determineGreeting();

    const interval = setInterval(() => determineGreeting(), 3600000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Typography
      variant="h4"
      sx={{ direction: i18n.language === "ar" ? "rtl" : "ltr", ...sx }}
    >
      {t(greeting)}
      {i18n.language === "ar" ? "،" : ","} {authState.name}
    </Typography>
  );
};

export default GreetingMsg;
