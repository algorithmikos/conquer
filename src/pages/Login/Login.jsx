import React, { useState } from "react";
import "./Login.css";
import {
  Box,
  Button,
  Divider,
  FormLabel,
  Grid2 as Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import swordSticker from "/sword.png";
import newLogo from "/conquer_logo.png";
import { useNavigate } from "react-router-dom";
import PasswordField from "../../components/PasswordField/PasswordField";
import { useAuthStore, useUtilsStore } from "../../store";
import { useMediaQueries } from "../../functions/screenSizes";
import UpperBar from "../../components/Navigation/UpperBar/UpperBar";
import { account, createUsernamePasswordSession } from "../../appwrite.config";
import { toast } from "react-toastify";
import { auth } from "../../firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { LoadingButton } from "@mui/lab";
import { Key, Visibility, VisibilityOff } from "@mui/icons-material";
import useLocalStorageState from "use-local-storage-state";
import { useTranslation } from "react-i18next";

const Login = () => {
  const [loginForm, setLoginForm] = useState({
    identifier: "",
    password: "",
  });

  const { identifier, password } = loginForm;

  const { t, i18n } = useTranslation();
  const utilsState = useUtilsStore((state) => state);
  const { setIsAppLoading, colors } = utilsState;

  const { setAuthenticated } = useAuthStore((state) => state);

  const [signingIn, setSigningIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [_, setAuthState] = useLocalStorageState("authState");

  const navigate = useNavigate();

  const { xs, sm, md, lg, xl } = useMediaQueries();

  const deleteCurrentSession = async () => {
    try {
      const session = await account.getSession("current");
      if (session) {
        await account.deleteSession("current");
      }
    } catch (e) {
      if (e.code !== 404 && e.code !== 401) {
        console.error("Error fetching or deleting session", e.message);
      }
    }
  };

  const handleSignIn = async () => {
    try {
      if (!identifier || !password) {
        toast.error("Please fill in all the fields");
        return;
      }

      setSigningIn(true);

      await deleteCurrentSession();

      const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

      if (emailRegex.test(identifier)) {
        await account.createEmailPasswordSession(identifier, password);
        // await signInWithEmailAndPassword(auth, identifier, password);
        const currentUser = await account.get();
        setIsAppLoading(false);
        setAuthState({ authenticated: true, ...currentUser });
        setAuthenticated(true);
        setSigningIn(false);
        // window.location.reload();
      } else {
        await createUsernamePasswordSession(identifier, password);
        const currentUser = await account.get();
        setIsAppLoading(false);
        setAuthState({ authenticated: true, ...currentUser });
        setAuthenticated(true);
        setSigningIn(false);
      }

      setSigningIn(false);
    } catch (error) {
      setSigningIn(false);
      console.error(error);
      toast.error(
        <Box>
          An error is thrown with code (<code>{error.code}</code>):{" "}
          <code>{error.message}</code>
        </Box>
      );
    }
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      sx={{
        mt: xs ? 0 : 18,
        height: 550,
        p: 2,
        width: xs ? "100vw" : 400,
        background: colors?.main_bg_gradient,
        borderRadius: 2,
        direction: i18n.language === "ar" ? "rtl" : "ltr",
      }}
      gap={1}
    >
      <img src={newLogo} alt="Sword" height={120} width={120} />

      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          flexDirection: "column",
          gap: 1,
          alignItems: "start",
          textAlign: "start",
          justifyContent: "center",
        }}
      >
        <InputLabel sx={{ color: "white" }}>
          {t("OverseerName")} {t("Or")} {t("PostHouse")}
        </InputLabel>
        <TextField
          fullWidth
          placeholder={`${t("OverseerName")} ${t("Or")} ${t("PostHouse")}`}
          size="small"
          value={identifier}
          sx={{ direction: "ltr" }}
          onChange={(e) => {
            setLoginForm({
              ...loginForm,
              identifier: e.target.value.toLowerCase().trim(),
            });
          }}
        />

        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <InputLabel sx={{ color: "white" }}>{t("Password")}</InputLabel>
          <InputLabel
            // sx={{ textAlign: "left" }}
            onClick={() => {
              navigate("/forgot-password");
            }}
            className="custom-label-link"
          >
            {t("ForgotPassword")}
          </InputLabel>
        </Box>

        <TextField
          fullWidth
          placeholder={t("Password")}
          size="small"
          value={password}
          onChange={(e) => {
            setLoginForm({ ...loginForm, password: e.target.value });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSignIn();
            }
          }}
          type={showPassword ? "text" : "password"}
          sx={{ direction: "ltr" }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    edge="end"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <LoadingButton
          loading={signingIn}
          loadingPosition="start"
          startIcon={<Key />}
          variant="contained"
          onClick={handleSignIn}
          sx={{ m: "auto", direction: "ltr", width: xs ? "100%" : 180 }}
        >
          {t("Login")}
        </LoadingButton>

        <FormLabel
          onClick={() => {
            navigate("/");
          }}
          className="custom-label-link"
          sx={{ color: "white", mt: 1 }}
        >
          {t("ForwardToHomeMsg")} <strong>{t("registerBtnLabel")}</strong>.
        </FormLabel>

        <Divider sx={{ color: "white", m: "auto" }}>{t("Or")}</Divider>

        <Button fullWidth variant="outlined" onClick={() => {}} disabled>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 .999c-6.074 0-11 5.05-11 11.278c0 4.983 3.152 9.21 7.523 10.702c.55.104.727-.246.727-.543v-2.1c-3.06.683-3.697-1.33-3.697-1.33c-.5-1.304-1.222-1.65-1.222-1.65c-.998-.7.076-.686.076-.686c1.105.08 1.686 1.163 1.686 1.163c.98 1.724 2.573 1.226 3.201.937c.098-.728.383-1.226.698-1.508c-2.442-.286-5.01-1.253-5.01-5.574c0-1.232.429-2.237 1.132-3.027c-.114-.285-.49-1.432.107-2.985c0 0 .924-.303 3.026 1.156c.877-.25 1.818-.375 2.753-.38c.935.005 1.876.13 2.755.38c2.1-1.459 3.023-1.156 3.023-1.156c.598 1.554.222 2.701.108 2.985c.706.79 1.132 1.796 1.132 3.027c0 4.332-2.573 5.286-5.022 5.565c.394.35.754 1.036.754 2.088v3.095c0 .3.176.652.734.542C19.852 21.484 23 17.258 23 12.277C23 6.048 18.075.999 12 .999"
            />
          </svg>

          <span style={{ paddingLeft: 5 }}>{t("gitHubLoginBtnLabel")}</span>
        </Button>

        <Button fullWidth variant="outlined" onClick={() => {}} disabled>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="0.98em"
            height="1em"
            viewBox="0 0 256 262"
          >
            <path
              fill="#4285f4"
              d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
            />
            <path
              fill="#34a853"
              d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
            />
            <path
              fill="#fbbc05"
              d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
            />
            <path
              fill="#eb4335"
              d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
            />
          </svg>

          <span style={{ paddingLeft: 5 }}>{t("googleLoginBtnLabel")}</span>
        </Button>
      </Box>
    </Grid>
  );
};

export default Login;
