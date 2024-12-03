import { capitalize, Chip, Grid2 as Grid, Tooltip } from "@mui/material";
import { usePillarStore, useProjectStore } from "../../../store";
import { Source } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useMediaQueries } from "../../../functions/screenSizes";

interface ContainerNameProps {
  containerCategory: string;
  containerIds: string[];
}

const ContainerName: React.FC<ContainerNameProps> = ({
  containerCategory,
  containerIds,
}) => {
  const projectState = useProjectStore((state) => state);
  const { getProjectById } = projectState;

  const pillarState = usePillarStore((state) => state);
  const { getPillarById } = pillarState;

  const { t, i18n } = useTranslation();
  const { xs } = useMediaQueries();

  const getContainerName = () => {
    switch (containerCategory) {
      case "project":
        const projectNames = [];
        for (let i = 0; i < containerIds.length; i++) {
          projectNames.push(getProjectById(containerIds[i])?.title);
        }
        return projectNames;
      case "pillar":
        const pillarNames = [];
        for (let i = 0; i < containerIds.length; i++) {
          pillarNames.push(getPillarById(containerIds[i])?.title);
        }
        return pillarNames;
      default:
        return [];
    }
  };

  return (
    containerIds?.length > 0 &&
    !xs && (
      <Grid
        container
        direction={i18n.language === "ar" ? "row-reverse" : "row"}
      >
        <Tooltip
          title={
            <>
              {capitalize(t(`${containerCategory}s`))}:{" "}
              {getContainerName()?.map((container) => (
                <Chip
                  key={`${container}-${containerCategory}`}
                  label={container}
                  className="app-font"
                  sx={{ mx: 0.25 }}
                />
              ))}
            </>
          }
          placement={i18n.language === "ar" ? "left" : "right"}
          arrow
          componentsProps={{
            tooltip: {
              sx: {
                padding: 1,
                direction: i18n.language === "ar" ? "rtl" : "ltr",
              },
              className: "app-font",
            },
          }}
        >
          <Source fontSize="small" />
        </Tooltip>
      </Grid>
    )
  );
};

export default ContainerName;
