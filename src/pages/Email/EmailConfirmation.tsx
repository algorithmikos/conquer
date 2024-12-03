import { Alert, Grid2 as Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { account } from "../../appwrite.config";
import useLocalStorageState from "use-local-storage-state";
import { useNavigate } from "react-router-dom";

const EmailConfirmation = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const secret = urlParams.get("secret");
  const userId = urlParams.get("userId");

  const navigate = useNavigate();

  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState(false);
  const [verified, setVerified] = useState(false);
  const [authState, setAuthState] =
    useLocalStorageState<Record<string, any>>("authState");

  const handleUpdateVerification = async () => {
    if (secret && userId) {
      await account
        .updateVerification(userId, secret)
        .catch((e) => {
          setError(true);
          throw new Error(e);
        })
        .finally(() => {
          setVerifying(false);
        });
      const currentUser = await account.get();
      setAuthState({ ...authState, ...currentUser });

      if (currentUser.emailVerification) {
        setVerified(true);
      }
    } else {
      setVerifying(false);
      setError(true);
      throw new Error("Invalid URL parameters");
    }
  };

  useEffect(() => {
    handleUpdateVerification();
  }, []);

  useEffect(() => {
    if (verified) {
      setTimeout(() => navigate("/"), 1500);
    }
  }, [verified]);

  return (
    <Grid>
      {verifying ? (
        <Alert severity="info" sx={{ fontSize: "1rem" }}>
          Please wait while we verify your email address.
        </Alert>
      ) : error ? (
        <Alert severity="error" sx={{ fontSize: "1rem" }}>
          An error occurred while verifying your email address.
        </Alert>
      ) : (
        <Alert severity="success" sx={{ fontSize: "1rem" }}>
          Thy email address has been verified successfully. Thou canst now use
          Conquer. Thou willst be redirected to the homepage shortly.
        </Alert>
      )}
    </Grid>
  );
};

export default EmailConfirmation;
