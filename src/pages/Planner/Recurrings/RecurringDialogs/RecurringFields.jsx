import React from "react";
import {
  Button,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid2 as Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Switch,
  Typography,
} from "@mui/material";
import { useRecurringStore } from "../../../../stores/recurring";
import moment from "moment";
import { useTranslation } from "react-i18next";

const RecurringFields = ({ type }) => {
  const recurringState = useRecurringStore((state) => state);
  const { instance, setInstance } = recurringState;

  const { t, i18n } = useTranslation();

  const weekDays = [
    { name: t("Sun"), value: 0 },
    { name: t("Mon"), value: 1 },
    { name: t("Tue"), value: 2 },
    { name: t("Wed"), value: 3 },
    { name: t("Thu"), value: 4 },
    { name: t("Fri"), value: 5 },
    { name: t("Sat"), value: 6 },
  ];

  const occuranceName = (repeats) => {
    if (repeats === "daily") {
      if (instance[type].repeatOccurance > 1) {
        return t("Days");
      }
      return t("Day");
    } else if (repeats === "weekly") {
      if (instance[type].repeatOccurance > 1) {
        return t("Weeks");
      }
      return t("Week");
    } else if (repeats === "monthly") {
      if (instance[type].repeatOccurance > 1) {
        return t("Months");
      }
      return "Month";
    } else if (repeats === "yearly") {
      if (instance[type].repeatOccurance > 1) {
        return t("Years");
      }
      return t("Year");
    }
  };

  const toggleAll = (value) => {
    setInstance(type, {
      ...instance[type],
      repeatanceDays: value ? weekDays.map((day) => day.value) : [],
    });
  };

  return (
    <>
      {/* Status Field Start */}
      <Grid>
        <FormControl fullWidth>
          <InputLabel>{t("Status")}</InputLabel>
          <Select
            label={t("Status")}
            value={instance[type].status || "none"}
            onChange={(e) =>
              setInstance(type, { ...instance[type], status: e.target.value })
            }
          >
            <MenuItem
              value="active"
              className="app-font"
              sx={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}
            >
              {t("Active")}
            </MenuItem>
            <MenuItem
              value="idle"
              className="app-font"
              sx={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}
            >
              {t("Idle")}
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
      {/* Status Field End */}

      {/* StartDate Field Start */}
      <Grid>
        <TextField
          fullWidth
          label={t("Start_Date")}
          type="date"
          value={
            instance[type].startedAt
              ? moment
                  .unix(instance[type].startedAt / 1000)
                  ?.format("YYYY-MM-DD")
              : null
          }
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => {
            if (e.target.value) {
              setInstance(type, {
                ...instance[type],
                startedAt: moment.utc(e.target.value).startOf("day").valueOf(),
              });
            } else {
              setInstance(type, {
                ...instance[type],
                startedAt: null,
              });
            }
          }}
          // inputProps={{ min: dateISO(new Date()) }}
        />
      </Grid>
      {/* StartDate Field End */}

      <Grid>
        <TextField
          type="time"
          label={t("Time")}
          value={instance[type].time}
          onChange={(e) =>
            setInstance(type, { ...instance[type], time: e.target.value })
          }
          fullWidth
        />
      </Grid>

      <Grid>
        <FormControl fullWidth>
          <InputLabel id="repeats">{t("Repeats")}</InputLabel>
          <Select
            labelId="repeats"
            id="repeatance-rate"
            value={instance[type].repeats || ""}
            label={t("Repeats")}
            onChange={(e) => {
              if (e.target.value === "weekly") {
                setInstance(type, {
                  ...instance[type],
                  repeats: e.target.value,
                  repeatanceDays: weekDays.map((day) => day.value),
                });
              } else {
                setInstance(type, {
                  ...instance[type],
                  repeats: e.target.value,
                });
              }
            }}
          >
            <MenuItem
              value="daily"
              className="app-font"
              sx={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}
            >
              {t("Daily")}
            </MenuItem>
            <MenuItem
              value="weekly"
              className="app-font"
              sx={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}
            >
              {t("Weekly")}
            </MenuItem>
            <MenuItem
              value="monthly"
              className="app-font"
              sx={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}
            >
              {t("Monthly")}
            </MenuItem>
            <MenuItem
              value="yearly"
              className="app-font"
              sx={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}
            >
              {t("Yearly")}
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid>
        <TextField
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="start" sx={{ px: 2 }}>
                <Typography className="app-font">
                  {t(occuranceName(instance[type].repeats))}
                </Typography>
              </InputAdornment>
            ),
          }}
          label={t("Repeats_Every")}
          value={instance[type].repeatOccurance || ""}
          onChange={(e) => {
            if (!isNaN(e.target.value) || e.target.value === "") {
              setInstance(type, {
                ...instance[type],
                repeatOccurance: Number(e.target.value),
              });
            }
          }}
        />
      </Grid>

      {instance[type].repeats === "weekly" && (
        <Grid>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            gap={0.5}
          >
            <FormLabel id="repeats-on">{t("Repeats_On")}</FormLabel>
            <Grid>
              <Button
                disableElevation
                disableRipple
                disableFocusRipple
                disableTouchRipple
                className="app-font"
                variant={
                  instance[type].repeatanceDays?.length === 7
                    ? "contained"
                    : "outlined"
                }
                sx={{ textTransform: "none", mr: 0.25 }}
                onClick={() =>
                  instance[type].repeatanceDays?.length === 7
                    ? toggleAll(false)
                    : toggleAll(true)
                }
              >
                {t("All")}
              </Button>
              <ToggleButtonGroup
                className="app-font"
                size="small"
                color="info"
                value={instance[type].repeatanceDays}
                onChange={(_, value) => {
                  setInstance(type, {
                    ...instance[type],
                    repeatanceDays: value,
                  });
                }}
              >
                {weekDays.map((weekDay) => (
                  <ToggleButton
                    key={weekDay.name}
                    value={weekDay.value}
                    className="app-font"
                  >
                    {weekDay.name}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Grid>
          </Grid>
        </Grid>
      )}

      {instance[type].repeats === "monthly" && (
        <FormControl>
          <FormLabel id="repeats-on">{t("Repeats_On")}</FormLabel>
          <RadioGroup
            row
            aria-labelledby="repeats-on"
            name="repeats-on-buttons-group"
            value={instance[type].repeatsOn || ""}
            onChange={(e) => {
              setInstance(type, {
                ...instance[type],
                repeatsOn: e.target.value,
              });
            }}
          >
            <FormControlLabel
              value="month-day"
              control={<Radio />}
              label={t("Day_of_the_month")}
              componentsProps={{ typography: { className: "app-font" } }}
            />
            <FormControlLabel
              value="week-day"
              control={<Radio />}
              label={t("Day_of_the_week")}
              componentsProps={{ typography: { className: "app-font" } }}
            />
          </RadioGroup>
        </FormControl>
      )}

      <Grid>
        <FormControlLabel
          sx={{ mx: 1 }}
          componentsProps={{ typography: { className: "app-font" } }}
          control={
            <Switch
              checked={instance[type].compensable}
              onChange={(e) => {
                setInstance(type, {
                  ...instance[type],
                  compensable: e.target.checked,
                });
              }}
              inputProps={{
                "aria-label": "controlled",
              }}
            />
          }
          label={`${t("Compensable")}:`}
          labelPlacement="start"
        />
      </Grid>
    </>
  );
};

export default RecurringFields;
