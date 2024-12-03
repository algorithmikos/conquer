import DeleteHabitDialog from "./DeleteHabitDialog";
import EditHabitDialog from "./EditHabitDialog";
import NewHabitDialog from "./NewHabitDialog";

const HabitDialogs = () => {
  return (
    <>
      <NewHabitDialog />
      <EditHabitDialog />
      <DeleteHabitDialog />
    </>
  );
};

export default HabitDialogs;
