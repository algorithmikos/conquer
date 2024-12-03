import { TabContext } from "@mui/lab";
// @ts-ignore
import FastCreator from "../../../components/FastCreator/FastCreator";
import HabitTab from "./HabitTab";
import { useHabitStore } from "../../../stores/habit";
import { useTranslation } from "react-i18next";

const RecurringTabs = () => {
  const habitState = useHabitStore((state) => state);
  const { tabValue, instance, setInstance } = habitState;

  const { t } = useTranslation();

  return (
    <>
      <FastCreator
        placeholder={t("Add_a_Habit")}
        setTaskInstance={setInstance}
        taskInstance={instance.new}
        collection="habits"
      />

      <TabContext value={tabValue}>
        <HabitTab tab="active" condition="active" isDroppable={false} />
        <HabitTab tab="all" condition="all" isDroppable />
      </TabContext>
    </>
  );
};

export default RecurringTabs;
