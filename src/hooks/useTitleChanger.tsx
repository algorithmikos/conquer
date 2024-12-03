import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const useTitleChanger = () => {
  const loaction = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    switch (loaction.pathname) {
      case "/planner/tasks":
        document.title = `${t("Tasks")} | ${t("Conquer")}`;
        break;
      case "/planner/pillars":
        document.title = `${t("Pillars")} | ${t("Conquer")}`;
        break;
      case "/planner/projects":
        document.title = `${t("Projects")} | ${t("Conquer")}`;
        break;
      case "/settings":
        document.title = `${t("Settings")} | ${t("Conquer")}`;
        break;
    }
  }, [loaction]);
};

export default useTitleChanger;
