import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid2,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useSeedStore } from "../stores/seedStore";
import { useUtilsStore } from "../store";
import { useTranslation } from "react-i18next";
import { Close, Delete, Edit, Save, WaterDrop } from "@mui/icons-material";
import { GiSeedling, GiForest, GiPlantRoots, GiBeech } from "react-icons/gi";
import { PiCoffeeBean } from "react-icons/pi";
import { useRef, useState } from "react";
import PlantController from "../backend/functions/PlantController";
import { SeedDocument } from "../backend/database/schemas/Seed.model";

const RightSidebar = () => {
  const { t, i18n } = useTranslation();
  const { seeds } = useSeedStore();
  const { createPlant, updatePlant, deletePlant } = PlantController();
  const { colors, expandRightSidebar, setExpandRightSidebar } = useUtilsStore();

  const [seedName, setSeedName] = useState<string>("");
  const [editable, setEditable] = useState<{ [key: string]: boolean }>({});

  const titleTextfieldRef = useRef<any>(null);
  const descriptionTextfieldRef = useRef<any>(null);

  const handleSeedPlant = async () => {
    /* @ts-ignore */
    await createPlant({ title: seedName, description: "" });
    setSeedName("");
  };

  const handleDeletePlant = async (plant: SeedDocument) => {
    await deletePlant(plant);
  };

  const seedGroups = seeds.reduce((acc, seed) => {
    if (!acc["seeds"]) {
      acc["seeds"] = [];
    }

    if (!acc["trees"]) {
      acc["trees"] = [];
    }

    if (seed.description) {
      acc["trees"].push(seed);
    } else {
      acc["seeds"].push(seed);
    }

    return acc;
  }, {} as { [key: string]: SeedDocument[] });

  return (
    <Box
      sx={{
        position: "fixed",
        right: 0,
        top: 0,
        bottom: 0,

        visibility: expandRightSidebar ? "visible" : "hidden",
        width: expandRightSidebar ? "50vw" : 0,
        height: "100vh",
        pb: 5,

        background: colors.main_bg_gradient,
        overflow: "scroll",
        zIndex: 2000,

        pointerEvents: "auto",
        transition: "all 0.3s ease-in-out",

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 0.75,
          width: "100%",
          pt: 2,
          px: 3,
          flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 0.5,
            flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
          }}
        >
          <GiSeedling size={35} style={{ marginBottom: 2 }} />
          <Typography variant="h4">{t("Seeds Store")}</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: -5,
          }}
        >
          <IconButton onClick={() => setExpandRightSidebar(false)}>
            <Close />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
        }}
      >
        <TextField
          label={t("Plant Seed")}
          placeholder={`${t("New seed")}...`}
          size="small"
          variant="filled"
          value={seedName}
          onChange={(e) => setSeedName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSeedPlant();
            }
          }}
          sx={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}
        />
        <Button
          variant="contained"
          startIcon={<WaterDrop />}
          onClick={handleSeedPlant}
        >
          {t("Plant")}
        </Button>
      </Box>

      <Typography variant="h5">{t("My Seeds")}</Typography>
      <Grid2 container justifyContent="center" gap={1}>
        {seedGroups?.seeds?.map((seed) => (
          <Card
            elevation={5}
            sx={{
              width: editable[seed.$id] ? 250 : 180,
              zIndex: 2,
              position: "relative",
            }}
          >
            {editable[seed.$id] ? (
              <TextField
                ref={titleTextfieldRef}
                variant="outlined"
                label="Seed Title"
                multiline
                defaultValue={seed.title}
                onChange={(e) => {
                  if (titleTextfieldRef.current) {
                    clearTimeout(titleTextfieldRef.current);
                  }

                  titleTextfieldRef.current = setTimeout(async () => {
                    /* @ts-ignore */
                    await updatePlant({ title: e.target.value }, seed.$id);
                  }, 1000);
                }}
                sx={{
                  my: 2,
                  mx: 1,
                  width: "90%",
                }}
              />
            ) : (
              <CardHeader
                title={seed.title}
                titleTypographyProps={{ fontSize: 20 }}
              />
            )}

            {editable[seed.$id] && (
              <>
                <Divider />
                <CardContent>
                  <TextField
                    ref={descriptionTextfieldRef}
                    variant="outlined"
                    label="Seed Description"
                    multiline
                    defaultValue={seed.description}
                    onChange={(e) => {
                      if (descriptionTextfieldRef.current) {
                        clearTimeout(descriptionTextfieldRef.current);
                      }

                      descriptionTextfieldRef.current = setTimeout(async () => {
                        /* @ts-ignore */
                        await updatePlant(
                          {
                            description: e.target.value,
                          },
                          seed.$id
                        );
                      }, 1000);
                    }}
                    sx={{
                      width: "100%",
                    }}
                  />
                </CardContent>
              </>
            )}

            <Divider />

            <CardActionArea>
              <CardActions
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeletePlant(seed)}
                >
                  <Delete fontSize="inherit" />
                </IconButton>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => {
                    setEditable((prev) => ({
                      ...prev,
                      [seed.$id]: !prev[seed.$id],
                    }));
                  }}
                >
                  {editable[seed.$id] ? (
                    <Save fontSize="inherit" />
                  ) : (
                    <Edit fontSize="inherit" />
                  )}
                </IconButton>
              </CardActions>
            </CardActionArea>

            <PiCoffeeBean
              size={110}
              style={{
                opacity: 0.1,
                position: "absolute",
                top: 0,
                right: 35,
                left: 35,
                zIndex: -1,
              }}
            />
          </Card>
        ))}
      </Grid2>

      <Divider sx={{ width: "100%" }} />

      <Typography variant="h5">{t("My Garden")}</Typography>
      <Grid2 container justifyContent="center" gap={1}>
        {seedGroups?.trees?.map((seed) => (
          <Card
            elevation={5}
            sx={{
              width: 250,
              zIndex: 2,
              position: "relative",
              // height: 250,
            }}
          >
            {editable[seed.$id] ? (
              <TextField
                ref={titleTextfieldRef}
                variant="filled"
                label="Seed Title"
                multiline
                defaultValue={seed.title}
                onChange={(e) => {
                  if (titleTextfieldRef.current) {
                    clearTimeout(titleTextfieldRef.current);
                  }

                  titleTextfieldRef.current = setTimeout(async () => {
                    /* @ts-ignore */
                    await updatePlant({ title: e.target.value }, seed.$id);
                  }, 1000);
                }}
                sx={{
                  my: 2,
                  mx: 1,
                  width: "90%",
                }}
              />
            ) : (
              <CardHeader
                title={
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDeletePlant(seed)}
                      >
                        <Delete />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => {
                          setEditable((prev) => ({
                            ...prev,
                            [seed.$id]: !prev[seed.$id],
                          }));
                        }}
                      >
                        {editable[seed.$id] ? <Save /> : <Edit />}
                      </IconButton>
                    </Box>
                    <Typography>{seed.title}</Typography>
                  </Box>
                }
              />
            )}

            <Divider />

            <CardContent>
              {editable[seed.$id] ? (
                <TextField
                  ref={descriptionTextfieldRef}
                  variant="filled"
                  label="Seed Description"
                  multiline
                  defaultValue={seed.description}
                  onChange={(e) => {
                    if (descriptionTextfieldRef.current) {
                      clearTimeout(descriptionTextfieldRef.current);
                    }

                    descriptionTextfieldRef.current = setTimeout(async () => {
                      /* @ts-ignore */
                      await updatePlant(
                        {
                          description: e.target.value,
                        },
                        seed.$id
                      );
                    }, 1000);
                  }}
                  sx={{
                    width: "100%",
                    direction: "rtl",
                    textAlign: "justify",
                    height: 300,
                    overflow: "auto",
                    scrollBehavior: "smooth",
                  }}
                />
              ) : (
                <Typography
                  sx={{
                    whiteSpace: "pre-line",
                    direction: "rtl",
                    textAlign: "right",
                    height: 200,
                    overflow: "auto",
                    scrollBehavior: "smooth",
                    scrollbarWidth: "thin",
                  }}
                >
                  {seed.description || "No description"}
                </Typography>
              )}
              <IconButton
                color="success"
                sx={{
                  display: editable[seed.$id] ? "default" : "none",
                  mt: 1,
                  mb: -1,
                }}
                onClick={() => {
                  setEditable((prev) => ({
                    ...prev,
                    [seed.$id]: !prev[seed.$id],
                  }));
                }}
              >
                <Save />
              </IconButton>
            </CardContent>
            <GiBeech
              size={150}
              style={{
                opacity: 0.1,
                position: "absolute",
                top: "35%",
                bottom: "35%",
                right: 45,
                left: 45,
                zIndex: -1,
              }}
            />
          </Card>
        ))}
      </Grid2>

      <GiForest
        size={350}
        style={{
          opacity: 0.1,
          position: "absolute",
          bottom: 0,
          right: 30,
          zIndex: 1,
        }}
      />

      <GiPlantRoots
        size={200}
        style={{
          opacity: 0.1,
          position: "absolute",
          top: 60,
          left: 30,
          zIndex: 1,
        }}
      />
    </Box>
  );
};

export default RightSidebar;
