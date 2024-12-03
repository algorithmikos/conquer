import { Box, Grid2 as Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Jobs from "../Planner/Jobs";
import Recurrings from "../Planner/Recurrings/";
import Habits from "../Planner/Habits/Habits";
import { useNavigate } from "react-router-dom";
import { useMediaQueries } from "../../functions/screenSizes";
import Custom from "../Planner/Custom/Custom";
import GreetingMsg from "../../components/GreetingMsg";
import { useTranslation } from "react-i18next";

const Home = () => {
  const navigate = useNavigate();
  const { xs } = useMediaQueries();
  const { i18n } = useTranslation();

  const authState = JSON.parse(localStorage.getItem("authState"));

  const [quote, setQuote] = useState({ quote: "", author: "" });

  useEffect(() => {
    if (xs) {
      navigate("/planner/dailies");
    }
  }, [xs]);

  useEffect(() => {
    const fetchQuote = async () => {
      const result = await fetch(
        "https://api.api-ninjas.com/v1/quotes?category=inspirational",
        {
          headers: {
            "X-Api-Key": "MSAcox01DI7DqVpuq+4omg==YEP14sALSC0txRLk",
          },
        }
      );
      const data = await result.json();
      setQuote({
        quote: data[0].quote,
        author: data[0].author,
      });
    };

    fetchQuote();
  }, []);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flex: 1,
          alignItems: "start",
          justifyContent: "space-between",
          flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
          my: 2,
        }}
      >
        <GreetingMsg sx={{ flexBasis: "50%" }} />
        <Box
          sx={{
            flexBasis: "50%",
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          {/* Random Quote */}
          <Typography
            variant="body1"
            sx={{
              width: 600,
              color: "var(--main-color)",
            }}
          >
            „{quote.quote}“
          </Typography>
          <Typography
            variant="body2"
            sx={{
              width: 600,
              color: "var(--main-color)",
            }}
          >
            — {quote.author}
          </Typography>
        </Box>
      </Box>
      <Grid container justifyContent="center" rowGap={8} columnGap={1}>
        <Box>
          <Jobs />
        </Box>

        <Box>
          <Recurrings />
        </Box>

        <Box>
          <Habits />
        </Box>

        {/* <Box>
        <Custom />
      </Box> */}
      </Grid>
    </Box>
  );
};

export default Home;
