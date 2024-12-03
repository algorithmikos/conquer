import { Circle } from "@mui/icons-material";
import useNetworkStatus from "../../hooks/useNetworkStatus";
import "./NetworkStatus.css";
import { Box, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";

interface NetworkStatusProps {
  style?: React.CSSProperties;
}

const NetworkStatus: (props: NetworkStatusProps) => JSX.Element = ({
  style,
}) => {
  const isOnline = useNetworkStatus();
  const { t } = useTranslation();

  return isOnline ? (
    <Tooltip
      title={t("ConnectionIndicator")}
      arrow
      placement="right"
      style={{ ...style }}
    >
      <div className="circle">
        <Circle color="success" sx={{ fontSize: 11 }} />
      </div>
    </Tooltip>
  ) : (
    <Tooltip
      style={{ ...style }}
      title={t("DisconnectionIndicator")}
      arrow
      placement="right"
    >
      <Box
        className="circle"
        sx={{
          "::before": { color: "red" },
          "::after": {
            borderColor: "red",
            animation: "offlinePulse 1.5s infinite",
          },
        }}
      >
        <Circle
          color="error"
          sx={{
            animation: "offlinePulse 2s infinite",
            fontSize: 11,
          }}
        />
      </Box>
    </Tooltip>
  );
};

export default NetworkStatus;
