import { useState } from "react";
import { useHabitStore } from "../../../../stores/habit";

import HabitController from "../../../../functions/backend/functions/Habit";

import { useMediaQueries } from "../../../../functions/screenSizes";
import CustomDialog from "../../../../components/CustomDialog/CustomDialog";

import { Grid2 as Grid } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Save } from "@mui/icons-material";
import HabitForm from "../HabitForms/HabitForm";
import { useTranslation } from "react-i18next";

const NewHabitDialog = () => {
  const { xs } = useMediaQueries();
  const { t, i18n } = useTranslation();
  const { createHabit } = HabitController();

  const habitState = useHabitStore((state) => state);
  const { dialogs, setDialog, instance, setInstance } = habitState;

  const [saving, setSaving] = useState(false);

  return (
    <CustomDialog
      state={dialogs.new}
      setState={setDialog}
      dailogType="new"
      fullScreen={xs ? true : false}
      logic={{
        after: () => {
          setDialog("new", false);
          setInstance("new", {});
        },
      }}
      title={t("Add_New_Habit")}
      content={<HabitForm instanceType="new" />}
      buttons={
        <Grid container justifyContent="center" alignItems="center">
          <LoadingButton
            className="app-font"
            variant="contained"
            loading={saving}
            loadingPosition={i18n.language !== "ar" ? "start" : "end"}
            startIcon={i18n.language !== "ar" && <Save />}
            endIcon={i18n.language === "ar" && <Save />}
            onClick={() => {
              setSaving(true);
              createHabit(instance.new)
                .then(() => {
                  setSaving(false);
                  setDialog("new", false);
                  setInstance("new", {});
                })
                .catch((e) => {
                  setSaving(false);
                  console.warn(e);
                });
            }}
          >
            {t("Create_Habit")}
          </LoadingButton>
        </Grid>
      }
    />
  );
};

export default NewHabitDialog;
