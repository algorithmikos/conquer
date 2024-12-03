import { Box, Grid2 as Grid, TextField } from "@mui/material";
import { useRecurringStore } from "../../stores/recurring";
// @ts-ignore
import { databases, originDatabase, collections } from "../../appwrite.config";

// @ts-ignore
import {
  migrateHabits,
  migrateJobs,
  migrateRecurringTaskChecklistOrder,
  migrateProjects,
  migrateSystems,
} from "../../backend/database/firestoreToAppwrite";

import {
  // AsymmetricEncryptionManager,
  decryptMessage,
  encryptMessage,
  generateSecretKey,
  hashPassword,
} from "../../utils/encryption/pubK";
import { AEM2 } from "../../utils/encryption/privK";
import MarkDownEditor from "../../components/Editor/Editor";

const Playground = () => {
  // @ts-ignore
  const {
    dailies,
    dayOfRecord,
    recurringChecklistStatus,
    setRecurringChecklistStatus,
  } = useRecurringStore((state) => state);

  // @ts-ignore
  const userId = JSON.parse(localStorage.getItem("currentUser"))?.$id;

  const handleEncryptionKedDown = async (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const hashedPassword = hashPassword("");
      // console.log("hashedPassword", hashedPassword);

      const secretKey = generateSecretKey();

      const encryptedSecretKey = encryptMessage(secretKey, hashedPassword);

      const decryptedSecretKey = decryptMessage(
        encryptedSecretKey,
        hashedPassword
      );
      console.log("secretKey:", secretKey);
      console.log("encryptedSecretKey:", encryptedSecretKey);
      console.log("decryptedSecretKey:", decryptedSecretKey);

      const encryptedMessage = encryptMessage(
        // @ts-ignore
        e.target.value,
        decryptedSecretKey
      );
      console.log("encryptedMessage:", encryptedMessage);

      const decryptedMessage = decryptMessage(
        encryptedMessage,
        decryptedSecretKey
      );
      console.log("decryptedMessage:", decryptedMessage);
    } else if (e.key === "End") {
      // Example Usage:
      // Generate key pair
      // await AsymmetricEncryptionManager.generateKeyPair();
      // Encrypt a message
      // const cipherText =
      //   await AsymmetricEncryptionManager.encryptMessage(
      //     e.target.value
      //   );
      await AEM2.generateKeyPair();
      // @ts-ignore
      await AEM2.encryptMessage(e.target.value);
      // // Decrypt the message
      // // const originalMessage =
      // //   await AsymmetricEncryptionManager.decryptMessage();
      await AEM2.decryptMessage();
    }
  };

  return (
    <Grid
      container
      sx={{
        width: "100vw",

        flex: 1,
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        px: 5,
      }}
    >
      <Box
        sx={{
          flexBasis: "80%",
          height: "100%",

          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        <h1>Playground</h1>

        {/* Test Only */}
        <TextField
          size="small"
          multiline
          rows={8}
          sx={{ width: "40%" }}
          placeholder="ُEncrypt Message"
          onKeyDown={handleEncryptionKedDown}
        />
        {/* Test Only */}

        <Box sx={{ position: "relative", zIndex: 9999, width: "100%" }}>
          <MarkDownEditor />
        </Box>
      </Box>

      <Box
        sx={{
          flexBasis: "19%",
          height: "100%",
          ml: 1,
          border: "1px solid white",
          borderRadius: 2,

          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0.5,
        }}
      >
        <h2
          style={{
            textAlign: "center",
            borderBottom: "1px solid white",
            paddingBottom: 10,
          }}
        >
          Options
        </h2>
      </Box>
    </Grid>
  );
};

export default Playground;
