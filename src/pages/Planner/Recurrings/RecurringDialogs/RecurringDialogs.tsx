// @ts-nocheck
import NewRecurringDialog from "./NewRecurringDialog";
import ModifyRecurringDialog from "./ModifyRecurringDialog";
import DeleteRecurringDialog from "./DeleteRecurringDialog";
import RecurringInfoDialog from "./RecurringInfoDialog";
const RecurringDialogs = () => {
  return (
    <>
      <NewRecurringDialog />
      <ModifyRecurringDialog />
      <DeleteRecurringDialog />
      <RecurringInfoDialog />
    </>
  );
};

export default RecurringDialogs;
