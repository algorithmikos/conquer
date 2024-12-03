import { TextField } from "@mui/material";
import DelDialog from "../../../../components/CustomDialog/DelDialog";
import { useMediaQueries } from "../../../../functions/screenSizes";
import { useTodoStore } from "../../../../store";
import { useState } from "react";
import JobController from "../../../../functions/backend/functions/Job";
import { useTranslation } from "react-i18next";
// @ts-ignore
import { textDirection } from "../../../../functions/textDirection";

const DeleteJobDialog = () => {
  const { xs } = useMediaQueries();
  const { t } = useTranslation();
  const { deleteJob } = JobController();

  const jobState = useTodoStore((state) => state);
  const { dialogs, setDialog, instance, setInstance, removeJob } = jobState;

  const [confirmation, setConfirmation] = useState("");

  return (
    <DelDialog
      state={dialogs.delete}
      setState={setDialog}
      dailogType="delete"
      logic={{
        after: () => {
          setConfirmation("");
          setDialog("delete", false);
          setInstance("modified", {});
          setInstance("old", {});
        },
      }}
      fullScreen={xs}
      title={t("Delete_Job")}
      content={t("Are_you_sure_you_want_to_delete_this_job")}
      contentFields={
        <>
          <TextField
            label={t("Confirmation")}
            // @ts-ignore
            placeholder={instance.modified.title}
            value={confirmation}
            onChange={(e) => {
              setConfirmation(e.target.value);
              e.target.dir =
                textDirection(e.target.value) === "left" ? "ltr" : "rtl";
            }}
          />
        </>
      }
      delFunction={() => {
        // @ts-ignore
        deleteJob(instance.modified.$id)
          .then(() => {
            setConfirmation("");
            setDialog("delete", false);
            setInstance("modified", {});
            setInstance("old", {});
            removeJob(instance.modified);
          })
          .catch((e) => {
            console.warn(e);
          });
      }}
      instanceTitle={{
        // @ts-ignore
        original: instance.modified.title,
        confirmation: confirmation,
      }}
    />
  );
};

export default DeleteJobDialog;
