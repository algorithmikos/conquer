import { useState } from "react";
import { useHabitStore } from "../../../../stores/habit";

import HabitController from "../../../../functions/backend/functions/Habit";

import { useMediaQueries } from "../../../../functions/screenSizes";
import CustomDialog from "../../../../components/CustomDialog/CustomDialog";

import { Grid2 as Grid } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Save } from "@mui/icons-material";
import HabitForm from "../HabitForms/HabitForm";
import { compare2Objects } from "../../../../utils/compare2Objects";
import { useTranslation } from "react-i18next";

const EditHabitDialog = () => {
  const { xs } = useMediaQueries();
  const { t, i18n } = useTranslation();
  const { updateHabit } = HabitController();

  const habitState = useHabitStore((state) => state);
  const { dialogs, setDialog, instance, setInstance } = habitState;

  const [saving, setSaving] = useState(false);

  return (
    <CustomDialog
      state={dialogs.modify}
      setState={setDialog}
      dailogType="modify"
      fullScreen={xs ? true : false}
      logic={{
        after: () => {
          setInstance("modified", {});
          setInstance("old", {});
        },
      }}
      title={t("Edit_Habit")}
      content={<HabitForm instanceType="modified" />}
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

              const updatedFields = compare2Objects(
                instance.old,
                instance.modified
              );

              console.log(instance.old, instance.modified, updatedFields);

              updateHabit(
                // @ts-ignore
                updatedFields,
                // @ts-ignore
                instance.modified.$id
              )
                .then(() => {
                  setSaving(false);
                  setDialog("modify", false);
                  setInstance("modified", {});
                })
                .catch((e) => {
                  setSaving(false);
                  console.warn(e);
                });
            }}
          >
            {t("Save_Changes")}
          </LoadingButton>
        </Grid>
      }
    />
  );
};

export default EditHabitDialog;
