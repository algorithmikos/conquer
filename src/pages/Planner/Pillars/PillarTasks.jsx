import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePillarStore } from "../../../store";
import { Card, Chip, Grid2 as Grid, Grow, IconButton } from "@mui/material";

import { todayDateTimestamp } from "../../../functions/todayDateTimestamp";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import { ArrowBack } from "@mui/icons-material";
import { useRecurringStore } from "../../../stores/recurring";
import { recordFilter } from "../../../functions/recordFilter";
import moment from "moment";

import TaskHeader from "../../Planner/TaskTab/TaskHeader";
import TaskInfo from "../../Planner/TaskTab/TaskInfo";
import TaskSubTasks from "../../Planner/TaskTab/TaskSubTasks";
import TaskSubTasksCollapse from "../../Planner/TaskTab/TaskSubTasksCollapse";
import { useMediaQueries } from "../../../functions/screenSizes";

const PillarTasks = () => {
  const navigate = useNavigate();

  let { pillarId } = useParams();
  const pillarState = usePillarStore((state) => state);
  const { pillars, getPillarById } = pillarState;
  const pillar = getPillarById(pillarId);

  const dailyState = useRecurringStore((state) => state);
  const {
    dailies,
    dayOfRecord,
    setDailies,
    setInstance,
    setDialog,
    recurringChecklistStatus,
    setRecurringChecklistStatus,
  } = dailyState;

  const todayISO = () => {
    const todayTimestamp = todayDateTimestamp();
    const todayDate = new Date(
      todayTimestamp.seconds * 1000
    ).toLocaleDateString("en-UK"); // Convert seconds to milliseconds
    const parts = todayDate.split("/");
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    return formattedDate;
  };

  const handleDailyCheck = async (daily) => {
    const completionDate = todayISO();
    // Update the state in the frontend for fast checking/unchecking
    const updatedDaily = { ...daily };
    let updatedCompletedDates;

    if (updatedDaily.completedDates) {
      // Create a copy of the completedDates array to avoid modifying the original
      const completedDates = [...updatedDaily.completedDates];

      // Does it already exist?
      const dateExist = completedDates.includes(completionDate);

      if (dateExist) {
        updatedCompletedDates = completedDates.filter(
          (date) => date !== completionDate
        );
      } else {
        // Add the completionDate at the beginning (unshift)
        updatedCompletedDates = [...completedDates];
        updatedCompletedDates.unshift(completionDate);
      }
    } else {
      // If completedDates doesn't exist, create a new array with just the completionDate
      updatedCompletedDates = [completionDate];
    }

    // Update the completedDates property of updatedDaily with the modified array
    updatedDaily.completedDates = updatedCompletedDates;

    const updatedDailies = dailies.map((dailyDoc) => {
      if (dailyDoc.$id === updatedDaily.$id) {
        return { ...updatedDaily };
      } else {
        return dailyDoc;
      }
    });
    setDailies(updatedDailies);

    // Fetch the record from Firestore
    const dailyDocRef = doc(db, "dailies", daily.$id);
    const dailyDocSnap = await getDoc(dailyDocRef);

    if (dailyDocSnap.exists()) {
      // Update the document in Firestore
      try {
        await updateDoc(dailyDocRef, {
          completedDates: updatedCompletedDates,
        });
        console.log("Document updated");
      } catch (e) {
        console.warn(e);
      }
    } else {
      // Handle case where document doesn't exist (less likely scenario)
      console.warn("Document not found in Firestore");
    }
  };

  const handleChecklistItemCheck = async (parent, child) => {
    const completionDate = todayISO();

    let updatedSubDaily;
    let updatedCompletedDates;
    // Update the state in the frontend for fast checking/unchecking

    // Does completedDates exist?
    if (child.completedDates) {
      // Does Date already exist?
      const dateExist = child.completedDates.includes(completionDate);

      if (dateExist) {
        updatedCompletedDates = [...child.completedDates].filter(
          (date) => date !== completionDate
        );
      } else {
        updatedCompletedDates = [...child.completedDates];
        updatedCompletedDates.unshift(completionDate);
      }
    } else {
      updatedCompletedDates = [completionDate];
    }

    updatedSubDaily = { ...child, completedDates: updatedCompletedDates };

    const dailyChecklist = [...parent.checklist].map((item) => {
      if (item.$id === child.$id) {
        return updatedSubDaily;
      } else {
        return item;
      }
    });

    const updatedDaily = { ...parent, checklist: dailyChecklist };

    const updatedDailies = dailies.map((daily) => {
      if (daily.$id === updatedDaily.$id) {
        return updatedDaily;
      } else {
        return daily;
      }
    });

    setDailies(updatedDailies);

    // Fetch the record from Firestore
    const dailyDocRef = doc(db, "dailies", parent.$id);
    const dailyDocSnap = await getDoc(dailyDocRef);

    if (dailyDocSnap.exists()) {
      // Update the document in Firestore
      try {
        await updateDoc(dailyDocRef, {
          checklist: dailyChecklist,
        });
        console.log("Document updated");
      } catch (e) {
        console.warn(e);
      }
    } else {
      // Handle case where document doesn't exist (less likely scenario)
      console.warn("Document not found in Firestore");
    }
  };

  const { xs, sm, md, lg, xl } = useMediaQueries();

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems={xs ? "normal" : "center"}
      gap={1}
      sx={{ mt: 5 }}
    >
      <Grid>
        <Grid container alignItems="center" gap={1}>
          <IconButton
            onClick={() => {
              navigate(`/planner/pillars`);
            }}
          >
            <ArrowBack fontSize="small" />
          </IconButton>

          <h2 style={{ textAlign: "left", marginBottom: 20 }}>
            {pillar?.title}'s Tasks
          </h2>

          <Chip
            label={
              dailies?.filter((daily) => daily.pillars?.includes(pillarId))
                ?.length
            }
            color="primary"
            size="small"
          />
        </Grid>
      </Grid>

      <Grid>
        <Grid
          container
          direction="column"
          className="task-column"
          gap={0.25}
          mt={-2}
        >
          {dailies
            .filter(
              (daily) =>
                daily.pillars?.includes(pillarId) &&
                recordFilter(daily, "all", dayOfRecord)
            )
            .map((daily, index) => (
              <Grow in timeout={1000} key={`${daily.$id}-${index}`}>
                <Card
                  variant="outlined"
                  sx={{
                    width: xs ? "100%" : "var(--task-card-width)",
                    cursor: "pointer",
                    backgroundColor: daily.color || "",
                  }}
                >
                  {/* Card Header */}
                  <TaskHeader
                    task={daily}
                    checkedObserver={daily.completedDates?.includes(
                      moment.utc(dayOfRecord).startOf("day").valueOf()
                    )}
                    handleTaskCheck={handleDailyCheck}
                    setInstance={setInstance}
                    setDialog={setDialog}
                  />
                  {/* End of Card Header */}

                  {/* Card Info */}
                  <TaskInfo task={daily} />
                  {/* End of Card Info */}

                  {/* Daily Sub-Tasks */}
                  <TaskSubTasks
                    task={daily}
                    listFilter={(item) =>
                      item.completedDates?.includes(
                        moment.utc(dayOfRecord).startOf("day").valueOf()
                      )
                    }
                    checklistStatus={recurringChecklistStatus}
                    localStorageChecklistStatus={"localStorageChecklistStatus"}
                    setChecklistStatus={setRecurringChecklistStatus}
                  />
                  <TaskSubTasksCollapse
                    checklistStatus={recurringChecklistStatus}
                    task={daily}
                    parentIndex={index}
                    handleChecklistItemCheck={handleChecklistItemCheck}
                    checkedObserver={(item) =>
                      item.completedDates?.includes(
                        moment.utc(dayOfRecord).startOf("day").valueOf()
                      )
                    }
                  />
                  {/* End of Daily Sub-Tasks */}
                </Card>
              </Grow>
            ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PillarTasks;
