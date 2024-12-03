import {
  Button,
  Grid2 as Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { SxProps } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// @ts-ignore
import { auth, db, storage as firebaseStorage } from "../../firebase.config";
import appInfo from "../../../package.json";
// @ts-ignore
import Explainer from "../../components/Explainer/Explainer";
// @ts-ignore
import HatchLoaderSvg from "../../assets/svgs/HatchLoaderSvg/HatchLoaderSvg";
import { useMediaQueries } from "../../functions/screenSizes";
import { hijriRomanMixedFullDate } from "../../functions/utils";
import { Delete, Logout, PrecisionManufacturing } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import ChangeLanguage from "./ChangeLanguage";
import { toast } from "react-toastify";

import { account, storage } from "../../appwrite.config";
import { AppwriteException, ImageGravity, UploadProgress } from "appwrite";
import useLocalStorageState from "use-local-storage-state";
import {
  convertBlobToBase64,
  convertImageToBase64,
} from "../../functions/cacheImageService";
import { motion } from "framer-motion";
import { useAuthStore, useUtilsStore } from "../../store";
import { CollectionOptions, dbm } from "../../backend/database/dbm";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  // @ts-ignore
  const { xs, sm, md, lg, xl } = useMediaQueries();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const version = appInfo.version;

  const [authState] = useLocalStorageState<Record<string, any>>("authState");
  const [prefs, setPrefs] =
    useLocalStorageState<Record<string, string>>("prefs");

  const { setAuthenticated } = useAuthStore((state) => state);

  const utilState = useUtilsStore((state) => state);
  const { profilePic, setProfilePic } = utilState;

  const [settingsForm, setSettingsForm] = useState({
    dayStart: "00:00",
    lang: "en",
  });

  useEffect(() => {
    if (prefs?.dayStart && localStorage.getItem("lang")) {
      setSettingsForm({
        ...settingsForm,
        /* @ts-ignore */
        lang: localStorage.getItem("lang"),
        dayStart: prefs.dayStart,
      });
    } else if (prefs?.dayStart && !localStorage.getItem("lang")) {
      setSettingsForm({ ...settingsForm, dayStart: prefs.dayStart });
    } else if (!prefs?.dayStart && localStorage.getItem("lang")) {
      /* @ts-ignore */
      setSettingsForm({ ...settingsForm, lang: localStorage.getItem("lang") });
    }
  }, []);

  useEffect(() => {
    /* @ts-ignore */
    dbm.getDocFromCache("localStorage", "profilePic").then((doc) => {
      if (doc && !profilePic) {
        setProfilePic(doc.base64);
      }
    });
  }, []);

  const handleImageUpload = async (event: any) => {
    event.preventDefault();

    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }

    const newImgId = uuid();

    const userFiles = await storage.listFiles(
      "670cdab70027c6802321", // bucketId
      [],
      authState?.$id
    );

    if (userFiles && userFiles.files.length > 0) {
      const deletedFileId = userFiles.files.find(
        (file) => file.name === authState?.$id
      )?.$id;

      if (deletedFileId) {
        await storage.deleteFile("670cdab70027c6802321", deletedFileId);
      }
    }

    // Create a new File object with the new name and same file data
    const renamedFile = new File([selectedFile], authState?.$id, {
      type: selectedFile.type,
    });

    try {
      const uploadedFile = await storage.createFile(
        "670cdab70027c6802321", // bucketId
        newImgId, // fileId
        renamedFile, // file
        [], // permissions (optional)
        (progress: UploadProgress) => {
          alert(`${progress.chunksTotal} / ${progress.chunksUploaded}`); // Progress tracking
        }
      );
      console.log("File uploaded successfully", uploadedFile);

      const profilePic = storage.getFilePreview(
        "670cdab70027c6802321", // bucketId
        newImgId, // fileId
        250,
        250,
        ImageGravity.Center
      );
      const base64 = await convertImageToBase64(profilePic.href);

      if (base64) {
        setProfilePic(base64);
      } else {
        const base64 = await convertBlobToBase64(selectedFile);
        setProfilePic(base64);
      }
      /* @ts-ignore */
      dbm.getDocFromCache("localStorage", "profilePic").then((doc) => {
        if (doc) {
          /* @ts-ignore */
          dbm.updateCacheDoc("localStorage", "profilePic", {
            base64,
            imgId: newImgId,
          });
        } else {
          /* @ts-ignore */
          dbm.createCacheDoc("localStorage", {
            $id: "profilePic",
            base64,
            imgId: newImgId,
          });
        }
      });
    } catch (error: AppwriteException | any) {
      console.log(error.code);

      if (error.code === 409) {
        await storage.deleteFile(
          "670cdab70027c6802321", // bucketId
          authState?.$id // fileId
        );
        handleImageUpload(event);
      } else {
        console.error("Error during file upload:", error);
      }
    }
  };

  const handleImageDelete = async () => {
    const profilePicDoc = await dbm.getDocFromCache(
      /* @ts-ignore */
      "localStorage",
      "profilePic"
    );
    await storage.deleteFile(
      "670cdab70027c6802321", // bucketId
      profilePicDoc.imgId // fileId
    );
    /* @ts-ignore */
    await dbm.deleteCacheDoc("localStorage", "profilePic");
    setProfilePic("");
  };

  const handleLogout = async () => {
    try {
      // Set authenticated state
      setAuthenticated(false);
      // Delete all sessions
      await account.deleteSession("current");
      // Delete all local storage
      localStorage.clear();
      // Delete all local databases
      await dbm.destroyAll();

      // Navigate to home
      navigate("/");

      // Show success toast
      toast.success("Logged Out", {
        hideProgressBar: true,
      });

      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  const MapTableRow: (props: {
    firstCell: string;
    secondCell: string;
    rowsx?: SxProps;
  }) => JSX.Element = ({ firstCell, secondCell, rowsx }) => {
    return (
      <TableRow sx={{ ...rowsx }}>
        {i18n.language === "ar" ? (
          <>
            <TableCell
              className="app-font"
              dir="rtl"
              sx={{ textAlign: "right" }}
            >
              {secondCell}
            </TableCell>
            <TableCell
              dir="rtl"
              sx={{
                borderLeft: 1,
                borderColor: "#515151",
                textAlign: "right",
              }}
              className="app-font"
            >
              {firstCell}
            </TableCell>
          </>
        ) : (
          <>
            <TableCell
              sx={{
                borderRight: 1,
                borderColor: "#515151",
              }}
              className="app-font"
            >
              {firstCell}
            </TableCell>
            <TableCell className="app-font">{secondCell}</TableCell>
          </>
        )}
      </TableRow>
    );
  };

  return (
    <Grid container direction="column">
      <Typography
        variant="h3"
        component="h1"
        className="app-font"
        sx={{ mt: 5, mb: 2.5 }}
      >
        {t("Settings")}
      </Typography>

      <motion.div
        initial={{ x: -250 }}
        animate={{
          direction: i18n.language === "ar" ? "rtl" : "ltr",
          x: 0,
        }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: 30 }}
        whileHover={{
          textShadow: "0px 0px 15px rgb(255, 255, 255)",
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{
            direction: i18n.language === "ar" ? "rtl" : "ltr",
          }}
        >
          {t("Welcome")}
          {i18n.language === "ar" ? "،" : ","} {authState?.name}
        </Typography>
      </motion.div>

      <Grid
        container
        justifyContent="space-around"
        alignItems="center"
        gap={2}
        mb={6}
      >
        <Grid>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Grid>
              <img
                src={profilePic}
                style={{
                  maxWidth: 250,
                  maxHeight: 250,
                  border: "7px solid black",
                  borderRadius: 150,
                  objectFit: "contain",
                }}
              />
            </Grid>

            <Grid
              container
              justifyContent="center"
              alignItems="center"
              direction={i18n.language === "ar" ? "row-reverse" : "row"}
              gap={0.5}
            >
              <Button
                fullWidth={xs}
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                sx={{ textTransform: "none" }}
                className="app-font"
              >
                {t("New_Profile_Picture")}
                <input
                  type="file"
                  style={{ display: "none" }} // Hide it but keep it accessible
                  onChange={handleImageUpload}
                />
              </Button>

              <Button
                fullWidth={xs}
                color="error"
                variant="outlined"
                disabled={!profilePic}
                startIcon={i18n.language === "ar" ? "" : <Delete />}
                endIcon={i18n.language === "ar" ? <Delete /> : ""}
                sx={{ textTransform: "none" }}
                className="app-font"
                onClick={handleImageDelete}
              >
                {t("Delete_Profile_Picture")}
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid
          sx={{
            border: "1px solid black",
            borderRadius: 5,
            p: 3,
            bgcolor: "black",
          }}
        >
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            gap={1}
          >
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="start"
              gap={0.5}
            >
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableBody>
                    <MapTableRow
                      firstCell={t("Post_House_Address")}
                      secondCell={authState?.email}
                    />

                    <MapTableRow
                      firstCell={t("In_The_Fold_since")}
                      secondCell={hijriRomanMixedFullDate(
                        authState?.registration
                      )}
                    />

                    <MapTableRow
                      firstCell={t("Last_seen")}
                      secondCell={hijriRomanMixedFullDate(
                        authState?.accessedAt
                      )}
                    />
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <ChangeLanguage
              settingsForm={settingsForm}
              setSettingsForm={setSettingsForm}
              props={{ fullWidth: true, sx: { direction: "ltr" } }}
            />

            <TextField
              size="small"
              fullWidth
              placeholder="Day Start"
              type="time"
              value={settingsForm.dayStart || ""}
              onChange={(e) => {
                setSettingsForm({ ...settingsForm, dayStart: e.target.value });
              }}
              onClick={(e) => {
                const inputElement = e.target as HTMLInputElement;
                inputElement.showPicker(); // Open the time picker
              }}
              onKeyDown={(e) => {
                e.preventDefault();
              }}
              slotProps={{
                input: {
                  sx: {
                    userSelect: "none", // Prevent text selection
                  },
                },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              className="app-font"
              disabled={
                (!settingsForm.dayStart && !settingsForm.lang) ||
                (prefs?.dayStart === settingsForm.dayStart &&
                  prefs?.lang === settingsForm.lang)
              }
              onClick={async () => {
                try {
                  const userId = JSON.parse(
                    /* @ts-ignore */
                    localStorage.getItem("currentUser")
                  ).$id;

                  await account.updatePrefs({ ...settingsForm });

                  await dbm.updateServerDoc(CollectionOptions.users, userId, {
                    prefs: JSON.stringify(settingsForm),
                  });
                  // await account.updatePrefs({ ...settingsForm });
                  setPrefs({ ...prefs, ...settingsForm });
                  toast.success("Settings Updated");
                } catch (e) {
                  toast.error(`Failed to update settings`);
                  console.error(e);
                }
              }}
            >
              {t("Save")}
            </Button>
          </Grid>

          <Paper
            elevation={2}
            sx={{
              width: "fit-content",
              mx: "auto",
              "&:hover": {
                rotate: "-10deg",
                bgcolor: "darkred",
              },
            }}
          >
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              sx={{ my: 2, p: 1 }}
              direction={i18n.language === "ar" ? "row-reverse" : "row"}
            >
              <PrecisionManufacturing
                sx={{
                  mr: i18n.language === "ar" ? 0 : 0.5,
                  ml: i18n.language === "ar" ? 0.5 : 0,
                }}
              />
              <Typography
                variant="body2"
                className="app-font"
                sx={{ textTransform: "uppercase" }}
              >
                {t("Version")}: {version} — وُفِّقَ إليه عمر الترجمان
              </Typography>
            </Grid>
          </Paper>

          <Button
            variant="contained"
            color="error"
            sx={{ width: "50%" }}
            startIcon={<Logout />}
            onClick={handleLogout}
          >
            {t("Logout")}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Settings;
