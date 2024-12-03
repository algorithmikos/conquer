import { MenuItem, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useTodoStore, useUtilsStore } from "../../../store";
import { useEffect, useState } from "react";
import { eisenhower } from "../../../functions/eisenhower";

const PrioritySorter = () => {
  const jobState = useTodoStore((state) => state);
  const { filteredJobs, setFilteredJobs } = jobState;

  const utilState = useUtilsStore((state) => state);
  const { userDBDoc } = utilState;

  const [orderSort, setOrderSort] = useState("");

  const { t, i18n } = useTranslation();

  useEffect(() => {
    switch (orderSort) {
      case "asc":
        setFilteredJobs(
          filteredJobs.sort(
            (a, b) =>
              // @ts-ignore
              eisenhower(a.priority).order - eisenhower(b.priority).order
          )
        );
        break;
      case "desc":
        setFilteredJobs(
          filteredJobs.sort(
            (a, b) =>
              // @ts-ignore
              eisenhower(b.priority).order - eisenhower(a.priority).order
          )
        );
        break;
      case "neither":
        setFilteredJobs(
          filteredJobs.sort(
            (a, b) =>
              // @ts-ignore
              userDBDoc?.todosOrder?.indexOf(a.$id) -
              // @ts-ignore
              userDBDoc?.todosOrder?.indexOf(b.$id)
          )
        );
        break;
    }
  }, [orderSort]);

  return (
    <TextField
      select
      size="small"
      value={orderSort}
      onChange={(e) => setOrderSort(e.target.value)}
      sx={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}
    >
      <MenuItem value="asc">{t("ASC")}</MenuItem>
      <MenuItem value="desc">{t("DESC")}</MenuItem>
      <MenuItem value="neither">{t("Neither")}</MenuItem>
    </TextField>
  );
};

export default PrioritySorter;
