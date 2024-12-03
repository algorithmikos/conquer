import { DarkMode, LightMode, Square } from "@mui/icons-material";
import { Grid2 as Grid, IconButton } from "@mui/material";
import { useUtilsStore } from "../../store";
import { blue, red, green, orange, purple } from "@mui/material/colors";

const colorsPalette: { [key: string]: string } = {
  main: "var(--column-bg-color)",
  red: "var(--column-bg-color-red)",
  green: "var(--column-bg-color-green)",
  orange: "var(--column-bg-color-orange)",
  purple: "var(--column-bg-color-purple)",
};

const colorBtns: { [key: string]: string } = {
  main: blue[700],
  red: red[700],
  green: green[700],
  orange: orange[700],
  purple: purple[700],
};

const switchTheme = () => {
  const light = document.body.classList.contains("light-mode");
  light
    ? document.body.classList.remove("light-mode")
    : document.body.classList.add("light-mode");
};

const ChangeColor: React.FC<{
  laterFn?: () => void;
  size?: "small" | "medium" | "large";
}> = ({ laterFn, size = "medium" }) => {
  const { setColors } = useUtilsStore((state) => state);

  return (
    <Grid container justifyContent="center" alignItems="center">
      <IconButton
        size="small"
        onClick={switchTheme}
        disabled
        title="Under Construction"
      >
        {true ? <LightMode /> : <DarkMode />}
      </IconButton>
      {Object.keys(colorsPalette)
        .reverse()
        .map((colorVariant, index) => (
          <IconButton
            key={`color-variant-${index}`}
            size={size}
            onClick={() => {
              setColors({
                main_bg_gradient: `var(--main-bg-gradient${
                  colorVariant !== "main" ? `-${colorVariant}` : ""
                })`,
                column_bg_color: `var(--column-bg-color${
                  colorVariant !== "main" ? `-${colorVariant}` : ""
                })`,

                main_color: "var(--main-color)",
                main_bg_color: "var(--main-bg-color)",
              });
              laterFn && laterFn();
            }}
          >
            <Square
              sx={{ color: colorBtns[colorVariant], fontSize: "inherit" }}
            />
          </IconButton>
        ))}
    </Grid>
  );
};

export default ChangeColor;
