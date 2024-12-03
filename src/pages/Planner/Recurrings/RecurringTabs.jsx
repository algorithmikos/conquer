import React, { useEffect } from "react";
import moment from "moment";

import { TabContext } from "@mui/lab";
import FastCreator from "../../../components/FastCreator/FastCreator";
import { useRecurringStore } from "../../../stores/recurring";
import RecurringTab from "./RecurringTab";
import TimeMachine from "../TimeMachine/TimeMachine";
import { useTranslation } from "react-i18next";

const RecurringTabs = () => {
  const dailyState = useRecurringStore((state) => state);
  const { tabValue, setTimemachineDate, instance, setInstance } = dailyState;

  useEffect(() => {
    setTimemachineDate(moment().format("YYYY-MM-DD"));
  }, [tabValue]);

  const { t } = useTranslation();

  return (
    <>
      <FastCreator
        placeholder={t("Add_a_Recurring_Task")}
        setTaskInstance={setInstance}
        taskInstance={instance.new}
        collection="dailies"
      />

      <TabContext value={tabValue}>
        <RecurringTab tab="due" isDroppable={false} condition={"due"} />
        <RecurringTab tab="not-due" isDroppable={false} condition={"not-due"} />
        <RecurringTab tab="all" isDroppable condition={"all"} />
        <RecurringTab
          tab="timemachine"
          isDroppable={false}
          condition={"timemachine"}
          additions={<TimeMachine />}
        />
      </TabContext>
    </>
  );
};

export default RecurringTabs;
