import RecurringDialogs from "../../pages/Planner/Recurrings/RecurringDialogs/RecurringDialogs";
import HabitDialogs from "../../pages/Planner/Habits/HabitDialogs/HabitDialogs";
import PillarDialogs from "../../pages/Planner/Pillars/PillarDialogs/PillarDialogs";
import ProjectDialogs from "../../pages/Planner/Projects/ProjectDialogs/ProjectDialogs";
import JobDialogs from "../../pages/Planner/Jobs/JobDialogs/JobDialogs";

const AppDialogs = () => {
  return (
    <>
      <RecurringDialogs />
      <JobDialogs />
      <HabitDialogs />
      <PillarDialogs />
      <ProjectDialogs />
    </>
  );
};

export default AppDialogs;
