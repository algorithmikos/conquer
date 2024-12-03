// @ts-ignore
import Explainer from "../../../components/Explainer/Explainer";
// @ts-ignore
import UnderConstructionSvg from "../../../assets/svgs/UnderConstructionSvg";
// @ts-ignore
import TaskColumn from "../TaskColumn";
import HabitTabs from "./HabitTabs";
import { useHabitStore } from "../../../stores/habit";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const Habits = () => {
  const habitState = useHabitStore((state) => state);
  const {
    filteredHabits,
    areHabitsFetched,
    hasHabits,
    setHasHabits,
    habitsCount,
    setHabitsCount,
    tabValue,
    setTabValue,
  } = habitState;

  const { t } = useTranslation();

  useEffect(() => {
    if (filteredHabits.length > 0) {
      setHasHabits(true);
    }
  }, [filteredHabits]);

  return (
    <TaskColumn
      columnTitle={t("Habits")}
      columnTabs={[
        { label: t("Active"), value: "active" },
        { label: t("All"), value: "all" },
      ]}
      columnTabsContainer={<HabitTabs />}
      items={filteredHabits}
      areItemsFetched={areHabitsFetched}
      userHasItems={hasHabits}
      itemsCount={habitsCount}
      setItemsCount={setHabitsCount}
      tabValue={tabValue}
      setTabValue={setTabValue}
    />
  );
};

export default Habits;
