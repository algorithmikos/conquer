import React, { useEffect } from "react";
import { useTodoStore } from "../../../store";
import JobTabs from "./JobTabs";
import TaskColumn from "../TaskColumn";
import { useTranslation } from "react-i18next";
// import addNotification from "react-push-notification";

const Jobs = () => {
  const TodoState = useTodoStore((state) => state);
  const {
    filteredJobs,
    areTodosFetched,
    hasJobs,
    setHasJobs,
    todosCount,
    setTodosCount,

    tabValue,
    setTabValue,
  } = TodoState;

  const { t } = useTranslation();

  useEffect(() => {
    if (filteredJobs.length > 0) {
      setHasJobs(true);
    }
  }, [filteredJobs]);

  return (
    <TaskColumn
      columnTitle={t("Jobs")}
      columnTabs={[
        { label: t("Awaited"), value: "awaited" },
        { label: t("All"), value: "all" },
        { label: t("Done"), value: "done" },
      ]}
      columnTabsContainer={<JobTabs />}
      items={filteredJobs}
      areItemsFetched={areTodosFetched}
      userHasItems={hasJobs}
      itemsCount={todosCount}
      setItemsCount={setTodosCount}
      tabValue={tabValue}
      setTabValue={setTabValue}
    />
  );
};

export default Jobs;
