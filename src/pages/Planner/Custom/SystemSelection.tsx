import { MenuItem, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useUserStore } from "../../../store";

const SystemSelection = () => {
  const systemState = useUserStore((state) => state);
  const { systems, selectedSystem, setSelectedSystem } = systemState;
  const { i18n } = useTranslation();

  return (
    <TextField
      select
      fullWidth
      size="small"
      sx={{ mb: 0.5, direction: i18n.language === "ar" ? "rtl" : "ltr" }}
      value={selectedSystem}
      onChange={(e) => setSelectedSystem(e.target.value)}
    >
      {systems.map((system) => (
        // @ts-ignore
        <MenuItem key={system?.$id} value={system?.$id}>
          {/* @ts-ignore */}
          {system?.systemData?.systemName}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SystemSelection;
