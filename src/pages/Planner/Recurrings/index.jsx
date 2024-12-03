import React, { useEffect } from "react";
import TaskColumn from "../TaskColumn";
import RecurringTabs from "./RecurringTabs";
import { useRecurringStore } from "../../../stores/recurring";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";

const Dailies = () => {
  const recurringState = useRecurringStore((state) => state);
  const {
    filteredDailies,

    areDailiesFetched,
    hasRecurrings,
    setHasRecurrings,
    dailiesCount,
    setDailiesCount,

    tabValue,
    setTabValue,
  } = recurringState;

  const { t } = useTranslation();

  useEffect(() => {
    if (filteredDailies.length > 0) {
      setHasRecurrings(true);
    }
  }, [filteredDailies]);

  return (
    <AnimatePresence>
      <motion.div
        exit={{
          x: "-50vh",
          // opacity: 0,
          transition: { duration: 1, ease: "linear" },
        }}
        style={{ height: "100%" }}
      >
        <TaskColumn
          columnTitle={t("Recurrings")}
          columnTabs={[
            { label: t("Due"), value: "due" },
            { label: t("Not_Due"), value: "not-due" },
            { label: t("All"), value: "all" },
            { label: t("TM"), value: "timemachine" },
          ]}
          columnTabsContainer={<RecurringTabs />}
          items={filteredDailies}
          areItemsFetched={areDailiesFetched}
          userHasItems={hasRecurrings}
          itemsCount={dailiesCount}
          setItemsCount={setDailiesCount}
          tabValue={tabValue}
          setTabValue={setTabValue}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default Dailies;
