import { MenuItem, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useUtilsStore } from "../../store";
import { Language } from "@mui/icons-material";

interface ChangeLanguageProps {
  settingsForm: { [key: string]: any };
  setSettingsForm: Function;
  props: { [key: string]: any };
}
const ChangeLanguage: React.FC<ChangeLanguageProps> = ({
  settingsForm,
  setSettingsForm,
  props,
}) => {
  const { t, i18n } = useTranslation();
  const { setLang } = useUtilsStore((state) => state);

  return (
    <TextField
      size="small"
      label={t("Language")}
      placeholder="Language"
      select
      value={settingsForm?.lang || ""}
      onChange={(e) => {
        if (setSettingsForm) {
          setSettingsForm({ ...settingsForm, lang: e.target.value });
          setLang(e.target.value);
          localStorage.setItem("lang", e.target.value);
        }
      }}
      sx={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}
      slotProps={{ input: { startAdornment: <Language /> } }}
      {...props}
    >
      <MenuItem value="ar">لسان العرب</MenuItem>
      <MenuItem value="tr">Türkçe</MenuItem>
      <MenuItem value="en">English</MenuItem>
    </TextField>
  );
};

export default ChangeLanguage;
