import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Grid2 as Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import rollOut from "../../assets/roll-out.png";
import {
  account,
  checkUsername,
  collections,
  databases,
  originDatabase,
} from "../../appwrite.config";
import { v4 as uuid } from "uuid";
import { LoadingButton } from "@mui/lab";
import {
  AccountBox,
  Key,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import { useTranslation } from "react-i18next";
import { useMediaQueries } from "../../functions/screenSizes";
import { useNavigate } from "react-router-dom";
import { useUtilsStore } from "../../store";
import ChangeLanguage from "../Settings/ChangeLanguage";

const Landing = () => {
  const { t, i18n } = useTranslation();
  const { xs } = useMediaQueries();
  const navigate = useNavigate();

  const { lang, colors } = useUtilsStore((state) => state);

  const [guestPrefs, setGuestPrefs] = useState({
    lang: localStorage.getItem("lang") ?? "en",
  });

  const [signupForm, setSignupForm] = useState({
    username: "",
    nickname: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  const { username, nickname, email, password, passwordConfirmation } =
    signupForm;

  const [token, setToken] = useState("");
  const [captchaKey, setCaptchaKey] = useState(0);
  const [showPassword, setShowPassword] = useState([false, false]);

  const fields = [
    "username",
    "nickname",
    "email",
    "password",
    "passwordConfirmation",
  ];

  const [errors, setErrors] = useState({
    username: false,
    nickname: false,
    email: false,
    password: false,
    passwordConfirmation: false,
  });

  const [helperTexts, setHelperTexts] = useState({
    usernameHelperText: "",
    nicknameHelperText: "",
    emailHelperText: "",
    passwordHelperText: "",
    passwordConfirmationHelperText: "",
  });

  const {
    usernameHelperText,
    nicknameHelperText,
    emailHelperText,
    passwordHelperText,
    passwordConfirmationHelperText,
  } = helperTexts;

  const [signingUp, setSigningUp] = useState(false);

  const handleSignUp = async () => {
    fields.forEach((field) => {
      if (!signupForm[field]) {
        setErrors({
          ...errors,
          [field]: true,
        });
      }
    });

    if (!username) {
      setHelperTexts({
        ...helperTexts,
        usernameHelperText: "Thou must provide a name!",
      });
      return;
    }

    if (!email) {
      setHelperTexts({
        ...helperTexts,
        emailHelperText: "Thou must provide a posting house!",
      });
      return;
    }

    if (!password) {
      setHelperTexts({
        ...helperTexts,
        passwordHelperText:
          "Thou must provide a password and it better be powerful!",
      });
      return;
    }

    if (!passwordConfirmation) {
      setHelperTexts({
        ...helperTexts,
        passwordConfirmationHelperText: "Thou must confirm thy password!",
      });
      return;
    }

    if (username.length > 20) {
      setErrors({
        ...errors,
        username: true,
      });

      setHelperTexts({
        ...helperTexts,
        usernameHelperText: "Name must not be more than 20 characters long.",
      });

      return;
    }

    const usernameRegex = /^[A-Za-z0-9_-]+$/;
    if (username && !usernameRegex.test(username)) {
      setErrors({
        ...errors,
        username: true,
      });

      setHelperTexts({
        ...helperTexts,
        usernameHelperText: "Name must not contain any special characters!",
      });

      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    if (password && !passwordRegex.test(password)) {
      setErrors({
        ...errors,
        password: true,
      });

      setHelperTexts({
        ...helperTexts,
        passwordHelperText: `Password must be at least 8 characters long & contain at least:\n- One Latin character (lowercase or uppercase)\n- One number\n- One special character`,
      });

      return;
    }

    if (passwordConfirmation && passwordConfirmation !== password) {
      setErrors({
        ...errors,
        passwordConfirmation: true,
      });

      setHelperTexts({
        ...helperTexts,
        passwordConfirmationHelperText:
          "The password confirmation must be identical to the password!",
      });

      return;
    }

    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (email && !emailRegex.test(email)) {
      setErrors({
        ...errors,
        email: true,
      });

      setHelperTexts({
        ...helperTexts,
        emailHelperText: "Posting House Address is invalid!",
      });

      return;
    }

    if (
      (!errors.username,
      !errors.email,
      !errors.password,
      !errors.passwordConfirmation)
    ) {
      setSigningUp(true);
      const isUsernameAvailable = await checkUsername(username);

      if (isUsernameAvailable === "available") {
        const createdAccount = await account
          .create(uuid(), email, password, nickname)
          .catch((e) => {
            setSigningUp(false);

            if (e.code === 409) {
              setErrors({
                ...errors,
                email: true,
              });
              setHelperTexts({
                ...helperTexts,
                emailHelperText:
                  "Posting House Address is already used! if you forgot your password, please reset it.",
              });
            }
            throw new Error(`Error: ${e}, exiting sign up function.`);
          });
        await account.createEmailPasswordSession(email, password);
        await databases.createDocument(
          originDatabase,
          collections.users,
          createdAccount.$id,
          {
            username: username,
          }
        );
        await account.createVerification(
          "https://conquer-matrix.web.app/verify-email"
        );
        localStorage.setItem("lastRequestTime", Date.now().toString());
        setSigningUp(false);
        toast.success("Welcome on board! Thou willst be redirected shortly!");
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        setErrors({
          ...errors,
          username: true,
        });

        setHelperTexts({
          ...helperTexts,
          usernameHelperText:
            "This username is already taken. Please choose another!",
        });

        setSigningUp(false);
      }
    }
  };

  useEffect(() => {
    fields.forEach((field) => {
      if (errors[field] && signupForm[field]) {
        setErrors({
          ...errors,
          [field]: false,
        });
      }
    });

    if (username && !isNaN(username[0])) {
      setErrors({
        ...errors,
        username: true,
      });

      setHelperTexts({
        ...helperTexts,
        usernameHelperText: "Name cannot start with number! Art thou human?!",
      });
    }

    console.log(signupForm);
  }, [signupForm]);

  useEffect(() => setCaptchaKey((prev) => prev + 1), [lang]);

  return (
    <Box mt={xs ? -2 : 7}>
      {xs && (
        <Box
          sx={{
            display: "inline-flex",
            flexGrow: 1,
            width: "90vw",
            gap: 1,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ChangeLanguage
            settingsForm={guestPrefs}
            setSettingsForm={setGuestPrefs}
            props={{
              sx: {
                width: "100%",
              },
            }}
          />

          <Button
            size="large"
            variant="contained"
            // color="inherit"
            startIcon={<Key />}
            fullWidth
            onClick={() => navigate("/login")}
            sx={{ color: "white", background: colors?.main_bg_gradient }}
          >
            {t("Login")}
          </Button>
        </Box>
      )}
      <Grid
        container
        alignItems="start"
        justifyItems="space-between"
        flexGrow={1}
        // flexDirection={i18n.language === "ar" ? "row-reverse" : "row"}
        sx={{
          px: 1,
          direction: i18n.language === "ar" ? "rtl" : "ltr",
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            flexDirection: "column",
            flexGrow: 1,
            gap: 2,
            alignItems: "center",
            flexBasis: "40%",
          }}
        >
          <img src={rollOut} width={250} height={250} />

          <Typography
            variant="h3"
            textAlign={i18n.language === "ar" ? "right" : "left"}
          >
            {t("heroTitle")}
          </Typography>

          <Typography
            variant="body1"
            textAlign={i18n.language === "ar" ? "right" : "left"}
          >
            {t("heroDescription")}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "inline-flex",
            flexDirection: "column",
            gap: 1,
            flexGrow: 1,
            flexBasis: "40%",
          }}
        >
          <Typography variant="h4">{t("registerationInvitation")}</Typography>

          <Typography
            variant="body1"
            textAlign={i18n.language === "ar" ? "right" : "left"}
          >
            {t("usernameSpecs")}
          </Typography>

          <TextField
            label={t("OverseerName")}
            placeholder={t("Username")}
            size="small"
            value={username}
            error={errors.username}
            helperText={usernameHelperText}
            onChange={(e) => {
              setSignupForm({
                ...signupForm,
                username: e.target.value.toLowerCase().trim(),
              });
            }}
            color={username && !errors.username && "success"}
            sx={{ direction: "ltr" }}
          />

          <TextField
            label={t("Ekename")}
            placeholder={t("DisplayName")}
            size="small"
            value={nickname}
            error={errors.nickname}
            helperText={nicknameHelperText}
            onChange={(e) => {
              setSignupForm({
                ...signupForm,
                nickname: e.target.value,
              });
            }}
            color={nickname && !errors.nickname && "success"}
            sx={{ direction: "ltr" }}
          />

          <TextField
            label={t("AetherPostingHouse")}
            placeholder={t("Email")}
            size="small"
            value={email}
            error={errors.email}
            helperText={emailHelperText}
            onChange={(e) => {
              setSignupForm({
                ...signupForm,
                email: e.target.value.toLowerCase().trim(),
              });
            }}
            sx={{ direction: "ltr" }}
          />

          <TextField
            label={t("Password")}
            placeholder={t("Password")}
            size="small"
            value={password}
            error={errors.password}
            helperText={passwordHelperText}
            onChange={(e) => {
              setSignupForm({
                ...signupForm,
                password: e.target.value,
              });
            }}
            onCopy={(event) => event.preventDefault()}
            onPaste={(event) => event.preventDefault()}
            onCut={(event) => event.preventDefault()}
            type={showPassword[0] ? "text" : "password"}
            sx={{ direction: "ltr" }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      edge="end"
                      onClick={() =>
                        setShowPassword((prev) => [!prev[0], prev[1]])
                      }
                    >
                      {showPassword[0] ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            label={t("PasswordConfirm")}
            placeholder={t("PasswordConfirm")}
            size="small"
            value={passwordConfirmation}
            onChange={(e) => {
              setSignupForm({
                ...signupForm,
                passwordConfirmation: e.target.value,
              });
            }}
            error={errors.passwordConfirmation}
            helperText={passwordConfirmationHelperText}
            onCopy={(event) => event.preventDefault()}
            onPaste={(event) => event.preventDefault()}
            onCut={(event) => event.preventDefault()}
            type={showPassword[1] ? "text" : "password"}
            sx={{ direction: "ltr" }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      edge="end"
                      onClick={() =>
                        setShowPassword((prev) => [prev[0], !prev[1]])
                      }
                    >
                      {showPassword[1] ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Box sx={{ m: "auto", width: "100%", alignSelf: "center" }}>
            <ReCAPTCHA
              key={captchaKey}
              hl={i18n.language || "en"}
              sitekey="6LefQmQqAAAAABy2CcnoWSoAwSV-q7w9fl5QIctb"
              onChange={(token) => {
                setToken(token);
              }}
              onExpired={() => {
                setToken("");
              }}
            />
          </Box>

          <Typography
            variant="body1"
            textAlign={i18n.language === "ar" ? "right" : "left"}
          >
            {t("ToSAcceptance")}
          </Typography>

          <LoadingButton
            loading={signingUp}
            loadingPosition="start"
            startIcon={<AccountBox />}
            variant="contained"
            onClick={handleSignUp}
            disabled={!token}
          >
            {t("registerBtnLabel")}
          </LoadingButton>

          <Divider>{t("Or")}</Divider>

          <Button variant="outlined" onClick={() => {}} disabled>
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

            <span style={{ paddingLeft: 5 }}>
              {t("gitHubRegisterBtnLabel")}
            </span>
          </Button>

          <Button variant="outlined" onClick={() => {}} disabled>
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

            <span style={{ paddingLeft: 5 }}>
              {t("googleRegisterBtnLabel")}
            </span>
          </Button>
        </Box>
      </Grid>
    </Box>
  );
};

export default Landing;
