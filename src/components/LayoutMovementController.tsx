import { Lock, LockOpen } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useUtilsStore } from "../store";

const LayoutMovementController = () => {
  const utilsState = useUtilsStore((state) => state);
  const { isDraggable, setIsDraggable } = utilsState;

  return (
    <Tooltip title="Arrange" arrow placement="top">
      <IconButton
        size="small"
        onClick={() => setIsDraggable(!isDraggable)}
        sx={{ color: isDraggable ? "var(--main-color)" : "default" }}
      >
        {isDraggable ? (
          <LockOpen fontSize="inherit" />
        ) : (
          <Lock fontSize="inherit" />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default LayoutMovementController;
