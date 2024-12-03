import React from "react";
import { Avatar, Grid2 as Grid, IconButton, Tooltip } from "@mui/material";
import NetworkStatus from "../../NetworkStatus";
import { useTranslation } from "react-i18next";
import useLocalStorageState from "use-local-storage-state";
import { useUtilsStore } from "../../../store";

const UserMenuTrigger = ({ setAnchorElUser }) => {
  const { t, i18n } = useTranslation();

  const utilState = useUtilsStore((state) => state);
  const { profilePic } = utilState;

  const [authState] = useLocalStorageState("authState");

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  return (
    <Grid>
      <Tooltip title={t("MyAccount")} arrow placement="top">
        <IconButton
          sx={{ p: 0 }}
          onClick={(e) => {
            handleOpenUserMenu(e);
          }}
        >
          {profilePic ? (
            <Avatar alt="Thy Profile Picture" src={profilePic} />
          ) : (
            <Avatar sx={{ bgcolor: "skyblue" }}>
              {authState?.name?.[0]?.toUpperCase() || ""}
            </Avatar>
          )}
        </IconButton>
      </Tooltip>
      <NetworkStatus
        style={{
          position: "absolute",
          zIndex: 100,
          marginLeft: i18n.language === "ar" ? 10 : -65,
          marginTop: 15,
        }}
      />
    </Grid>
  );
};

export default UserMenuTrigger;
