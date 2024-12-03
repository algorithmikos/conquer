import { useTranslation } from "react-i18next";
import DelDialog from "../../../../components/CustomDialog/DelDialog";
import { useMediaQueries } from "../../../../functions/screenSizes";
import {
  DialogOptions,
  InstanceOptions,
  useRecurringStore,
} from "../../../../stores/recurring";
import { useState } from "react";
import { TextField } from "@mui/material";
import RecurringTaskController from "../../../../functions/backend/functions/RecurringTask";
import { CollectionOptions, dbm } from "../../../../backend/database/dbm";

const DeleteRecurringDialog = () => {
  const recurringState = useRecurringStore((state) => state);
  const { dialogs, setDialog, instance, setInstance, removeRecurringTask } =
    recurringState;

  const [confirmation, setConfirmation] = useState("");

  const { xs } = useMediaQueries();
  const { t } = useTranslation();
  const { deleteRecurringTask } = RecurringTaskController();

  // Are you sure you want to delete this recurring task?

  return (
    <DelDialog
      state={dialogs.delete}
      // @ts-ignore
      setState={setDialog}
      dailogType="delete"
      logic={{
        before: () => {},
        after: () => {
          setDialog(DialogOptions.Delete, false);
          // @ts-ignore
          setInstance(InstanceOptions.Modified, {});
        },
      }}
      fullScreen={xs}
      title={t("Delete_Recurring_Task")}
      content={t("Recurring_Task_Del_Confirmation_Msg")}
      contentFields={
        <TextField
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          label={t("Confirmation")}
          placeholder={instance.modified?.title}
        />
      }
      delFunction={() => {
        // @ts-ignore
        deleteRecurringTask(instance.modified?.$id);
        dbm.deleteServerDoc(
          CollectionOptions.recurringTasks,
          // @ts-ignore
          instance.modified?.$id
        );
        setConfirmation("");
        setDialog(DialogOptions.Delete, false);
        // @ts-ignore
        setInstance(InstanceOptions.Modified, {});
        removeRecurringTask(instance.modified);
      }}
      // @ts-ignore
      instanceTitle={{
        original: instance.modified?.title,
        confirmation,
      }}
    />
  );
};

export default DeleteRecurringDialog;
