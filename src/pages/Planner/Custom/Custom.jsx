import React, { useEffect, useState } from "react";
import { Grid2 as Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import TaskColumn from "../TaskColumn";
import SystemSelection from "./SystemSelection";
import { useUserStore } from "../../../store";
import moment from "moment";
import { hijriRomanMixedShortDate } from "../../../functions/utils";

const Custom = () => {
  const systemState = useUserStore((state) => state);
  const { systems, selectedSystem, systemInstances } = systemState;

  const [selectedSysData, setSelectedSysData] = useState({});

  const { t } = useTranslation();

  const keyLabeliser = (key) => {
    return selectedSysData?.fields?.find((field) => field.key === key)?.label;
  };

  useEffect(() => {
    const system = systems.find((sys) => sys?.$id === selectedSystem);
    system && setSelectedSysData(system);
  }, [selectedSystem]);

  return (
    <TaskColumn
      columnTitle={
        selectedSystem ? selectedSysData?.systemData?.systemName : t("Custom")
      }
      columnTabs={[{ label: t("Tab"), value: "tab" }]}
      columnTabsContainer={
        <>
          <SystemSelection />
          {selectedSystem && (
            <Grid
              container
              sx={{
                width: "var(--task-card-width)",
                mt: 1,
                textAlign: "start",
              }}
              className="app-font"
              gap={1}
            >
              {systemInstances
                .filter((instance) => instance?.system === selectedSystem)
                .map((instance, index) => (
                  <Grid
                    size={12}
                    key={instance?.$id}
                    sx={{
                      border: "1px solid black",
                      borderRadius: 1,
                      p: 2,
                    }}
                  >
                    <Typography className="app-font">
                      {Object.keys(instance)
                        .filter(
                          (key) =>
                            key !== "id" &&
                            key !== "createdAt" &&
                            key !== "updatedAt" &&
                            key !== "system" &&
                            key !== "user"
                        )
                        .map((key) => (
                          <>
                            <li>
                              {keyLabeliser(key)}: {instance[key]}
                            </li>
                          </>
                        ))}
                    </Typography>
                    <Typography
                      className="app-font"
                      sx={{
                        pt: 0.5,
                        textAlign: "center",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      Created @{" "}
                      {hijriRomanMixedShortDate(
                        moment
                          .unix(instance.createdAt.seconds)
                          .format("YYYY-MM-DD")
                      )}
                    </Typography>
                  </Grid>
                ))}
            </Grid>
          )}

          {systems.length === 0 ? (
            <Typography
              sx={{ minWidth: "var(--task-card-width)", p: 5 }}
              className="app-font"
            >
              ليس لديك أي أنظمة للعرض
            </Typography>
          ) : (
            <div style={{ width: "var(--task-card-width)" }} />
          )}
        </>
      }
      items={[]}
      areItemsFetched={true}
      itemsCount={
        systemInstances?.filter(
          (instance) => instance?.system === selectedSystem
        ).length || 0
      }
      setItemsCount={() => {}}
      tabValue={"tab"}
      setTabValue={() => {}}
    />
  );
};

export default Custom;
