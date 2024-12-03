import { EmailOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, Grid2 as Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import { account } from "../../appwrite.config";
import { useMediaQueries } from "../../functions/screenSizes";

const Email = () => {
  const { xs } = useMediaQueries();
  const [authState] = useLocalStorageState("authState");
  const [lastRequestTime, setLastRequestTime] =
    useLocalStorageState("lastRequestTime");
  const [requesting, setRequesting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleVerificationRequest = async () => {
    setRequesting(true);
    setLastRequestTime(Date.now().toString());
    setIsDisabled(true);
    setTimeLeft(300000);
    await account
      .createVerification("https://conquer-matrix.web.app/verify-email")
      .catch((e) => {
        throw new Error(e);
      })
      .finally(() => {
        setRequesting(false);
      });
  };

  useEffect(() => {
    // Check if a previous request was made
    if (lastRequestTime) {
      const timeElapsed = Date.now() - parseInt(lastRequestTime, 10);
      if (timeElapsed < 300000) {
        setIsDisabled(true);
        setTimeLeft(300000 - timeElapsed);

        // Start timer to re-enable button after 5 minutes
        const timer = setInterval(() => {
          const newTimeLeft = Math.max(
            0,
            300000 - (Date.now() - parseInt(lastRequestTime, 10))
          );
          setTimeLeft(newTimeLeft);
          if (newTimeLeft === 0) {
            setIsDisabled(false);
            clearInterval(timer);
          }
        }, 1000);

        return () => clearInterval(timer); // Clean up on unmount
      }
    }
  }, []);

  return (
    <Grid
      container
      direction="column"
      gap={2}
      justifyContent="center"
      sx={{ width: xs ? "90%" : "50%" }}
    >
      <Alert severity="warning">
        Please check thy post house at address{" "}
        <strong>
          <code>{authState?.email}</code>
        </strong>{" "}
        for the verification letter.
      </Alert>

      <Alert severity="info">
        <Grid container direction="column" gap={2}>
          <Typography>
            Didn't receive a letter? Request another verification by clicking
            the button below.
          </Typography>
          <LoadingButton
            loading={requesting}
            loadingPosition="start"
            startIcon={<EmailOutlined />}
            variant="contained"
            onClick={handleVerificationRequest}
            disabled={isDisabled}
          >
            {isDisabled
              ? `Thou canst ask for another letter in ${Math.ceil(
                  timeLeft / 1000
                )} seconds`
              : "Send Another Letter"}
          </LoadingButton>
        </Grid>
      </Alert>
    </Grid>
  );
};

export default Email;
