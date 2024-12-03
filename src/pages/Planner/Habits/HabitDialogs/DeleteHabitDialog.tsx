import { TextField, Typography } from "@mui/material";
import DelDialog from "../../../../components/CustomDialog/DelDialog";
import { useMediaQueries } from "../../../../functions/screenSizes";
import { useHabitStore } from "../../../../stores/habit";
import HabitController from "../../../../functions/backend/functions/Habit";
import { useState } from "react";
import { useTranslation } from "react-i18next";
// @ts-ignore
import { textDirection } from "../../../../functions/textDirection";

const DeleteHabitDialog = () => {
  const { xs } = useMediaQueries();
  const { t } = useTranslation();
  const { deleteHabit } = HabitController();

  const habitState = useHabitStore((state) => state);
  const { dialogs, setDialog, instance, setInstance } = habitState;

  const [confirmation, setConfirmation] = useState("");

  return (
    <DelDialog
      state={dialogs.delete}
      setState={setDialog}
      dailogType="delete"
      logic={{
        after: () => {
          setConfirmation("");
        },
      }}
      fullScreen={xs ? true : false}
      title={t("Delete_Habit")}
      content={
        <>
          <Typography className="app-font">
            {t("Delete_Habit_Confirm")}
          </Typography>
        </>
      }
      contentFields={
        <TextField
          fullWidth
          color="error"
          placeholder={instance.modified.title}
          label={t("Confirmation")}
          value={confirmation}
          dir={
            textDirection(instance.modified.title) === "left" ? "ltr" : "rtl"
          }
          onChange={(e) => {
            setConfirmation(e.target.value);
            e.target.dir =
              textDirection(e.target.value) === "left" ? "ltr" : "rtl";
          }}
        />
      }
      delFunction={() => {
        // @ts-ignore
        deleteHabit(instance.modified.$id);
        setConfirmation("");
        setInstance("modified", {});
        setDialog("delete", false);
      }}
      instanceTitle={{
        original: instance.modified.title,
        confirmation: confirmation,
      }}
    />
  );
};

export default DeleteHabitDialog;
