import { useNavigate } from "react-router-dom";
import { useMediaQueries } from "../../../functions/screenSizes";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid2 as Grid,
  IconButton,
  Typography,
} from "@mui/material";
// @ts-ignore
import { textDirection } from "../../../functions/textDirection";
import { Circle, Delete, Edit, ReadMore } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import Scroll from "../../../assets/svgs/Scroll.svg";
import TaskInfo from "../TaskTab/TaskInfo";

interface ContainerProps {
  title: string;
  containers: { [key: string]: any }[];
  setInstance: (type: string, instanceObject: { [key: string]: any }) => void;
  setDialog: (type: string, value: boolean) => void;
}

const Container: (props: ContainerProps) => JSX.Element = ({
  title,
  containers,
  setInstance,
  setDialog,
}) => {
  const navigate = useNavigate();

  const { xs } = useMediaQueries();
  const { i18n, t } = useTranslation();

  return (
    <Grid container direction="column">
      <Grid
        container
        gap={2}
        justifyContent="center"
        alignItems="center"
        sx={{ mt: 5, mb: 3 }}
      >
        <Grid>
          <Grid
            container
            gap={0.5}
            justifyContent="center"
            alignItems="center"
            direction={i18n.language === "ar" ? "row-reverse" : "row"}
          >
            <Typography
              variant="h4"
              component="h1"
              className="app-font"
              sx={{ fontWeight: "bold", textTransform: "capitalize" }}
            >
              {t(title)}
            </Typography>
            <Chip label={containers?.length} color="primary" />
          </Grid>
        </Grid>
      </Grid>

      <Grid container justifyContent="center" alignItems="baseline" gap={1}>
        {containers.map((container) => (
          <Card
            key={container.$id}
            sx={{ width: xs ? "100%" : 300 }}
            elevation={6}
          >
            <Grid
              container
              alignItems="center"
              justifyContent="stretch"
              direction={i18n.language === "ar" ? "row-reverse" : "row"}
            >
              <Grid size={3.5}>
                {title === "pillars" ? (
                  <svg
                    width="80"
                    height="150"
                    viewBox="0 0 100 200"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* <!-- Top Capital -->  */}
                    <rect x="10" y="0" width="80" height="20" fill="#A9A9A9" />
                    <rect x="20" y="20" width="60" height="10" fill="#A9A9A9" />

                    {/* <!-- Fluted Column --> */}
                    <rect
                      x="30"
                      y="30"
                      width="10"
                      height="140"
                      fill="#B0C4DE"
                    />
                    <rect
                      x="45"
                      y="30"
                      width="10"
                      height="140"
                      fill="#A9A9A9"
                    />
                    <rect
                      x="60"
                      y="30"
                      width="10"
                      height="140"
                      fill="#B0C4DE"
                    />

                    {/* <!-- Base --> */}
                    <rect
                      x="20"
                      y="170"
                      width="60"
                      height="10"
                      fill="#A9A9A9"
                    />
                    <rect
                      x="10"
                      y="180"
                      width="80"
                      height="20"
                      fill="#A9A9A9"
                    />
                  </svg>
                ) : (
                  <Scroll height={120} style={{ marginLeft: -5 }} />
                )}
              </Grid>

              <Divider orientation="vertical" flexItem />

              <Grid size="grow">
                <CardHeader
                  title={
                    <Grid
                      container
                      justifyContent="center"
                      alignItems="center"
                      gap={0.5}
                      direction={i18n.language === "ar" ? "row-reverse" : "row"}
                    >
                      {container.status === "active" ? (
                        <Circle
                          color="success"
                          titleAccess="This pillar is active"
                        />
                      ) : (
                        <Circle
                          color="warning"
                          titleAccess="This pillar is NOT active"
                        />
                      )}
                      <Typography
                        variant="h5"
                        component="h2"
                        className="app-font"
                      >
                        {container.title}
                      </Typography>
                    </Grid>
                  }
                />
                {container?.details && <Divider />}

                <CardContent>
                  <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    direction="column"
                  >
                    <TaskInfo directInfo={container?.details} />
                  </Grid>
                </CardContent>
                <Divider />
                <CardActions>
                  <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    direction={i18n.language === "ar" ? "row-reverse" : "row"}
                  >
                    <IconButton
                      color="primary"
                      title="Edit pillar"
                      onClick={() => {
                        setInstance("modified", container);
                        setDialog("modify", true);
                      }}
                    >
                      <Edit />
                    </IconButton>

                    <IconButton
                      title="Show pillar tasks"
                      color="secondary"
                      onClick={() => {
                        navigate(`/planner/${title}/${container.$id}`);
                      }}
                    >
                      <ReadMore className="rotating-el" />
                    </IconButton>

                    <IconButton
                      title="Delete pillar"
                      color="error"
                      onClick={() => {
                        setInstance("modified", container);
                        setDialog("delete", true);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Grid>
                </CardActions>
              </Grid>
            </Grid>
          </Card>
        ))}
      </Grid>
    </Grid>
  );
};

export default Container;
