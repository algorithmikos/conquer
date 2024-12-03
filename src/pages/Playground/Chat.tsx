import {
  Button,
  Divider,
  Grid2 as Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import useNetworkStatus from "../../hooks/useNetworkStatus";
import { Send, Wifi } from "@mui/icons-material";
import { client, databases } from "../../appwrite.config";
import { v4 as uuid } from "uuid";
// @ts-ignore
import { textDirection } from "../../functions/textDirection";

const Chat = () => {
  const [msg, setMsg] = useState<string>("");
  const [messages, setMessages] = useState<Record<string, any>[]>([]);

  const isOnline = useNetworkStatus();

  useEffect(() => {
    databases
      .listDocuments("66e56c8c00229d26bc0d", "66f41633003d9e1aa049")
      .then((response: Record<string, any>) => {
        setMessages(response.documents);
      });

    const unsubscribe = client.subscribe(
      "documents",
      async (response: Record<string, any>) => {
        // Callback will be executed on changes for all files.
        setMessages((prev) => [...prev, response.payload]);
        console.log(response);
      }
    );

    // Closes the subscription.
    return () => {
      unsubscribe();
    };
  }, []);

  const handleSend = () => {
    databases
      .createDocument("66e56c8c00229d26bc0d", "66f41633003d9e1aa049", uuid(), {
        message: msg,
      })
      .then(
        () => {
          setMsg("");
        },
        () => {}
      );
  };

  return (
    <Grid container mt={5} direction="column" gap={1}>
      <Grid>
        <Grid container justifyContent="center" alignItems="center" gap={1}>
          <Typography variant="h3">Chat</Typography>
          <Wifi fontSize="large" color={isOnline ? "success" : "error"} />
        </Grid>
      </Grid>

      <Grid>
        <Grid container direction="column" gap={1}>
          {messages.map((message, index) => (
            <Grid>
              <Typography
                variant="body1"
                className="app-font"
                sx={{
                  textAlign: textDirection(message.message),
                  color: index % 2 === 0 ? "primary.main" : "secondary.main",
                }}
              >
                {message.message}
              </Typography>
              <Divider />
            </Grid>
          ))}
        </Grid>
      </Grid>

      <Grid sx={{ mt: 3 }}>
        <TextField
          label="Message"
          placeholder="Please, write a message!"
          multiline
          minRows={4}
          fullWidth
          value={msg}
          onChange={(e) => {
            textDirection(e.target.value) === "left"
              ? (e.target.dir = "ltr")
              : (e.target.dir = "rtl");
            setMsg(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        />
      </Grid>

      <Grid>
        <Button variant="outlined" startIcon={<Send />} onClick={handleSend}>
          Send
        </Button>
      </Grid>
    </Grid>
  );
};

export default Chat;
