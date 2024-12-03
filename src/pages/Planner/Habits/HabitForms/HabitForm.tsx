// @ts-nocheck
import { useHabitStore } from "../../../../stores/habit";
import { usePillarStore } from "../../../../store";

import {
  Chip,
  FormControlLabel,
  Grid2 as Grid,
  Switch,
  TextField,
  Tooltip,
  Zoom,
} from "@mui/material";

// @ts-ignore
import TagCreator from "../../../../components/TagCreator/TagCreator";
import { useMediaQueries } from "../../../../functions/screenSizes";
import { useTranslation } from "react-i18next";

interface HabitFormProps {
  instanceType: string;
}

const HabitForm: React.FC<HabitFormProps> = ({ instanceType }) => {
  const habitState = useHabitStore((state) => state);
  const { instance, setInstance } = habitState;

  const pillarState = usePillarStore((state) => state);
  const { pillars } = pillarState;

  const { xs } = useMediaQueries();
  const { t } = useTranslation();

  return (
    <Grid container gap={1} justifyContent="center" alignItems="center">
      <TextField
        label={t("Title")}
        fullWidth
        defaultValue={instance[instanceType].title || ""}
        onBlur={(e) => {
          setInstance(instanceType, {
            ...instance[instanceType],
            title: e.target.value,
          });
        }}
      />

      <TextField
        label={t("Description")}
        fullWidth
        defaultValue={instance[instanceType].description || ""}
        onBlur={(e) => {
          setInstance(instanceType, {
            ...instance[instanceType],
            description: e.target.value,
          });
        }}
      />

      <Grid container alignItems="center" gap={1}>
        <FormControlLabel
          label={t("Status")}
          labelPlacement="start"
          componentsProps={{ typography: { className: "app-font" } }}
          control={
            <Switch
              checked={instance[instanceType].status === "active"}
              onChange={(e) =>
                setInstance(instanceType, {
                  ...instance[instanceType],
                  status: e.target.checked ? "active" : "idle",
                })
              }
            />
          }
        />
        <Chip
          className="app-font"
          variant="outlined"
          label={
            instance[instanceType].status === "active" ? t("Active") : t("Idle")
          }
          color={
            instance[instanceType].status === "active" ? "success" : "warning"
          }
        />
      </Grid>

      <TextField
        label={t("Streak")}
        fullWidth
        defaultValue={instance[instanceType].streak || ""}
        onBlur={(e) => {
          // @ts-ignore
          if (!isNaN(e.target.value) || e.target.value === "") {
            setInstance(instanceType, {
              ...instance[instanceType],
              streak: Number(e.target.value),
            });
          }
        }}
      />

      {/* Pillars Field Start */}
      <Grid width="100%">
        <Tooltip
          title={
            !pillars.length
              ? "You've no pillars yet. Start typing a new one title, then click Enter"
              : ""
          }
          placement="top"
          TransitionComponent={Zoom}
          followCursor
        >
          <TagCreator
            taskState={instance[instanceType]}
            setTaskState={setInstance}
            instanceType={instanceType}
            field="pillars"
            label={t("Pillars")}
            placeholder={t("Erect_a_new_pillar")}
            collection={pillars}
            createFunction={() => {}}
            // @ts-ignore
            existingValue={pillars.map((pillar) => pillar.$id)}
          />
        </Tooltip>
      </Grid>
      {/* Pillars Field End */}
    </Grid>
  );
};

export default HabitForm;
