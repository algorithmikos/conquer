import { BugReport, TipsAndUpdates } from "@mui/icons-material";
import {
  Box,
  Grid2 as Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { useMediaQueries } from "../../functions/screenSizes";
import "./Contributors.css";
import { useTranslation } from "react-i18next";

const contributorFiles = [
  {
    name: "Umar Al-Kashef",
    occupation: "Jurist, trader & real estate consultant",
    image: "https://i.imgur.com/xiMw1Ce.png",
    role: "Tester User",
    contributions: [],
    features: 1,
    bugsDetected: 0,
  },
  // {
  //   name: "Muhammad Abdurrauf",
  //   occupation: "Maintenance Technician",
  //   image: "https://i.imgur.com/fO2to85.jpg",
  //   role: "Tester User",
  //   contributions: [],
  //   features: 1,
  //   bugsDetected: 0,
  // },
  // {
  //   name: "Yusuf Saeed",
  //   occupation: "Network Technician",
  //   image: "https://i.imgur.com/0PCC43P.jpg",
  //   role: "Tester Developer",
  //   contributions: [],
  //   features: 0,
  //   bugsDetected: 2,
  // },
];

const Contributors = () => {
  const { xs } = useMediaQueries();
  const { t } = useTranslation();

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      mt={5}
      mb={3}
    >
      {/* First Row */}
      <Box mb={xs ? 15 : 10}>
        <Typography variant="h3">{t("Contributors")}</Typography>
      </Box>

      {/* Second Row */}
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        gap={xs ? 12 : 2}
      >
        {contributorFiles.map((contributor, index) => (
          <Paper
            elevation={3}
            key={`contributor-${index}`}
            sx={{
              width: xs ? "85%" : "250px",
              borderRadius: xs ? "8px" : "10%",
              display: "inline-flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              position: "relative",
              px: 1,
            }}
          >
            <motion.img
              src={contributor.image}
              loading="lazy"
              alt={`${contributor.name}'s Photo`}
              className="contributor-image"
              style={{
                height: 150,
                width: 150,
                border: "white 3px solid",
                borderRadius: "50%",
                objectFit: "cover",
                position: "absolute",
                top: -70,
              }}
              initial={{
                y: -100,
                opacity: 0.5,
                filter: "blur(10px)",
              }}
              animate={{
                y: 0,
                opacity: 1,
                filter: "blur(0)",
                transition: { duration: 1.5, ease: "easeInOut" },
              }}
              whileHover={{
                top: -90,
                scale: 1.2,
                borderRadius: "20px",
                transition: { duration: 0.75, ease: "easeInOut" },
              }}
            />
            <Typography
              variant="body1"
              sx={{
                // letterSpacing: 2,
                mt: 12,
                mb: -1,
                fontFamily: "Roboto Condensed !important",
                fontSize: "22px !important",
              }}
            >
              {contributor.name}
            </Typography>

            <Typography
              variant="subtitle1"
              sx={{ fontFamily: "Nabla !important" }}
            >
              {contributor.role}
            </Typography>
            <Typography variant="body2" className="contributor-occupation">
              {contributor.occupation}
            </Typography>

            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              {contributor.bugsDetected ? (
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <BugReport color="error" fontSize="small" />
                  {contributor.bugsDetected}
                </Box>
              ) : null}

              {contributor.features ? (
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <TipsAndUpdates color="success" fontSize="small" />
                  {contributor.features}
                </Box>
              ) : null}
            </Box>

            <List>
              {contributor.contributions.map((contribution, index) => (
                <ListItem key={`contribution-${index}`}>
                  <ListItemText>{contribution}</ListItemText>
                </ListItem>
              ))}
            </List>
          </Paper>
        ))}
      </Grid>
    </Grid>
  );
};

export default Contributors;
