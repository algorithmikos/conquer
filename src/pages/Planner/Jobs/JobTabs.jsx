import React from "react";
import { useTodoStore } from "../../../store";
import { TabContext } from "@mui/lab";
import FastCreator from "../../../components/FastCreator/FastCreator";
import { useTranslation } from "react-i18next";
import JobTab from "./JobTab";
import { Box } from "@mui/material";

const JobTabs = () => {
  const todoState = useTodoStore((state) => state);
  const { tabValue, instance, setInstance } = todoState;

  const { t } = useTranslation();

  return (
    <>
      <FastCreator
        placeholder={t("Add_a_Job")}
        setTaskInstance={setInstance}
        taskInstance={instance.new}
        collection="jobs"
      />

      <TabContext value={tabValue}>
        <JobTab tab="awaited" isDroppable={false} condition="awaited" />
        <JobTab tab="all" isDroppable condition="all" />
        <JobTab tab="done" isDroppable={false} condition="done" />
      </TabContext>
    </>
  );
};

export default JobTabs;
