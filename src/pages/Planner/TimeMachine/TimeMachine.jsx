import React from "react";
import { Alert, AlertTitle, Grid2 as Grid, TextField } from "@mui/material";
import { useAuthStore } from "../../../store";
import { dateISO } from "../../../functions/dateISO";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import { useRecurringStore } from "../../../stores/recurring";
import moment from "moment";
import { useMediaQueries } from "../../../functions/screenSizes";
import { useTranslation } from "react-i18next";
import { hijriRomanMixedFullDate } from "../../../functions/utils";

const TimeMachine = () => {
  const { xs, sm, md, lg, xl } = useMediaQueries();

  const dailyState = useRecurringStore((state) => state);
  const { dayOfRecord, setTimemachineDate } = dailyState;

  const authState = useAuthStore((state) => state);
  const { userAuthDoc } = authState;

  const { t, i18n } = useTranslation();

  const isRealToday = () => {
    const today = moment().format("YYYY-MM-DD");

    if (today === dayOfRecord) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      gap={1}
      mt={-0.25}
    >
      <Grid>
        <Alert
          variant="outlined"
          icon={<HistoryToggleOffIcon fontSize="inherit" />}
          severity="warning"
          className="app-font"
          sx={{
            textAlign: "justify",
            width: xs ? 320 : "var(--task-card-width)",
            direction: i18n.language === "ar" ? "rtl" : "ltr",
          }}
        >
          <AlertTitle className="app-font">{t("Caution")}</AlertTitle>
          {isRealToday()
            ? t("Today_is")
            : t("Thou_hast_got_back_in_time_to")}{" "}
          <strong>{hijriRomanMixedFullDate(dayOfRecord)}</strong>
          {t("AlertMsg")}
        </Alert>
      </Grid>

      <TextField
        size="small"
        sx={{ mb: 0.5 }}
        fullWidth
        variant="outlined"
        type="date"
        value={dayOfRecord}
        onChange={(e) => {
          const date = moment(e.target.value).format("YYYY-MM-DD");
          setTimemachineDate(date);
        }}
        inputProps={{
          min: dateISO(new Date(userAuthDoc?.metadata?.createdAt)),
          max: dateISO(new Date()),
        }}
      />
    </Grid>
  );
};

export default TimeMachine;
