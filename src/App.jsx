import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";

import Loader from "./components/Loader/Loader";
import useTitleChanger from "./hooks/useTitleChanger";
import useAppLang from "./hooks/useAppLang";
import AppLayoutSwitch from "./layouts/app/Layout.switch";
import AuthLayoutSwitch from "./layouts/auth/Layout.auth.switch";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthStore, useUtilsStore } from "./store";
import useDebounce from "./hooks/useDebounce";
import appInfo from "../package.json";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch((error) => {
      console.warn("Service Worker registration failed:", error);
    });
}

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: `"Roboto Condensed", "Cairo", sans-serif !important`,
  },
});

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
  typography: {
    fontFamily: `"Roboto Condensed", "Cairo", sans-serif !important`,
  },
});

function App() {
  useTitleChanger();
  useAppLang();

  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const { authenticated } = useAuthStore((state) => state);
  const [isLoading, setIsLoading] = useState(true);

  const { colors } = useUtilsStore((state) => state);

  const [clicks, setClicks] = useState(1);

  useEffect(() => {
    if (authenticated) {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleVersionDebugger = () => {
    setClicks((clicks) => clicks + 1);
    if (clicks > 6) {
      navigate("/play");
      setClicks(0);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      {isLoading ? (
        <Loader isLoading={isLoading} />
      ) : authenticated ? (
        <AppLayoutSwitch />
      ) : (
        <AuthLayoutSwitch />
      )}

      <footer
        style={{
          background: colors?.main_bg_gradient,
          padding: "5px 0", // Add padding for spacing
          textAlign: "center",
          color: "white", // Optional styling
          border: `1px solid ${colors?.main_bg_gradient}`,
          borderBottomLeftRadius: 7,
          borderBottomRightRadius: 7,
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
          direction: i18n.language === "ar" ? "rtl" : "ltr",
        }}
      >
        {t("AllRightsReserved")} &copy; 1446 —{" "}
        <span onClick={handleVersionDebugger}>v{appInfo.version}</span>
      </footer>

      <ToastContainer
        theme="dark"
        rtl={i18n.language === "ar"}
        bodyClassName="app-font"
      />
    </ThemeProvider>
  );
}

export default App;
