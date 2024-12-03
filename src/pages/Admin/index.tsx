import { useEffect, useState } from "react";
import {
  databases,
  originDatabase,
  collections,
  account,
} from "../../appwrite.config";
import { Models, Query } from "appwrite";
import { shortHijriDate, shortRomanDate } from "../../functions/utils";
import TaskHeader from "../Planner/TaskTab/TaskHeader";
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid2 as Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  AdminPanelSettings,
  PersonSearch,
  Security,
} from "@mui/icons-material";
import { toast } from "react-toastify";

const Admin = () => {
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });
  const [adminReauthenticated, setAdminReauthenticated] = useState(false);

  const [users, setUsers] = useState<Models.Document[]>([]);
  const [selectedUser, setSelectedUser] = useState<Record<string, any> | null>(
    null
  );

  const [sort, setSort] = useState<{
    column: string;
    direction: "asc" | "desc";
  }>({
    column: "",
    direction: "desc",
  });

  useEffect(() => {
    setTimeout(() => {
      setAdminReauthenticated(false);
    }, 900000);
  }, []);

  const handleFetchUsers = async () => {
    const queryOptions = [
      Query.select(["$id", "username"]),
      Query.limit(1),
      ...(users.length > 0
        ? [Query.cursorAfter(users[users.length - 1].$id)]
        : []),
    ];

    const res: any = await databases
      .listDocuments(originDatabase, collections.users, queryOptions)
      .catch((err) => console.log(err));

    setUsers((prev) => [...prev, ...res?.documents]);
    console.log(res?.documents);
  };

  const handleFetchUserById = async (id: string) => {
    databases.getDocument(originDatabase, collections.users, id).then((res) => {
      setSelectedUser(res);
      console.log(res);
    });
  };

  const createSortHandler = () => {
    if (sort.direction === "asc") {
      setUsers((prev) => [
        ...prev.sort((a, b) => b.username.localeCompare(a.username)),
      ]);
    } else {
      setUsers((prev) => [
        ...prev.sort((a, b) => a.username.localeCompare(b.username)),
      ]);
    }

    setSort((prev) => ({
      column: "Username",
      direction: prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleFindUser = async (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.target.disabled = true;
      databases
        .listDocuments(originDatabase, collections.users, [
          Query.equal("username", e.target.value),
        ])
        .then((res) => {
          setSelectedUser(res.documents[0]);
          e.target.value = "";
          e.target.disabled = false;
        });
    }
  };

  const reauthenticate = async () => {
    if (!credentials.email || !credentials.password) return;

    setLoading(true);

    await account.deleteSession("current").catch((e) => {
      console.error(e);
      setLoading(false);
      toast.error(`Reauthentication failed: ${e.message}`);
    });

    const session = await account
      .createEmailPasswordSession(credentials.email, credentials.password)
      .catch((e) => {
        console.error(e);
        setLoading(false);
        toast.error(`Reauthentication failed: ${e.message}`);
      });

    if (session) {
      const currentUser = await account.get();
      if (currentUser.labels.includes("admin")) {
        setAdminReauthenticated(true);
        toast("Reauthenticated successfully! Welcome to the Admin Panel", {
          hideProgressBar: true,
          theme: "colored",
          type: "success",
        });
      } else {
        toast.error(
          "You are not authorized to access the Admin Panel. Please contact the admin.",
          {
            hideProgressBar: true,
          }
        );
      }
      setCredentials({ email: "", password: "" });
      setLoading(false);
    }
  };

  const columnStyle = {
    display: "flex",
    flexDirection: "column",
    gap: 1,
    px: 2,
    border: "1px solid gray",
    borderRadius: 2,
    width: "calc(var(--task-card-width))",
  };

  if (!adminReauthenticated)
    return (
      <Grid
        container
        sx={{
          mt: 5,
          flexDirection: "column",
          placeItems: "center",
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            placeItems: "center",
            gap: 1,
          }}
        >
          <Security fontSize="large" color="warning" />
          <Typography variant="h4">Protected Path</Typography>
        </Box>
        <Typography variant="h5">Please Reauthenticate!</Typography>

        <Paper
          elevation={3}
          sx={{
            width: "100%",
            py: 2,
            display: "flex",
            flexDirection: "column",
            placeItems: "center",
            gap: 1,
          }}
        >
          <TextField
            sx={{ width: "80%" }}
            size="small"
            label="E-Mail"
            placeholder="E-Mail"
            type="email"
            onChange={(e) =>
              setCredentials((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <TextField
            sx={{ width: "80%" }}
            size="small"
            label="Password"
            placeholder="Password"
            type="password"
            onChange={(e) =>
              setCredentials((prev) => ({ ...prev, password: e.target.value }))
            }
          />
          <LoadingButton
            variant="contained"
            loading={loading}
            loadingPosition="start"
            startIcon={<AdminPanelSettings />}
            onClick={reauthenticate}
            disabled={!credentials.email || !credentials.password}
          >
            Reauthenticate
          </LoadingButton>
        </Paper>
      </Grid>
    );

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
        <h1>Admin Panel</h1>

        <TextField
          label="Search by username"
          placeholder="Find a user..."
          onKeyDown={handleFindUser}
        />

        <Table
          size="small"
          stickyHeader
          sx={{
            width: "50%",
            border: "1px solid gray",
            borderRadius: 2,
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>
                Username
                <TableSortLabel
                  active={sort.column ? true : false}
                  direction={sort.direction}
                  onClick={createSortHandler}
                />
              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.length > 0 &&
              users.map((user: any) => (
                <TableRow key={user.$id}>
                  <TableCell sx={{ borderRight: "1px solid gray" }}>
                    {user.username}
                  </TableCell>
                  <TableCell sx={{ borderRight: "1px solid gray" }}>
                    {user.$id}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleFetchUserById(user.$id)}
                    >
                      Fetch
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {selectedUser && (
          <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
            <Box sx={columnStyle}>
              <h3>Recurring Tasks</h3>
              <Divider />
              {selectedUser.recurringTasks.map((task: any) => (
                <Box key={task.$id}>
                  <Chip
                    label={`${shortHijriDate(
                      task.$createdAt
                    )} | ${shortRomanDate(task.$createdAt)}`}
                  />
                  <TaskHeader
                    task={task}
                    checkedObserver={false}
                    handleTaskCheck={() => {}}
                    setInstance={() => {}}
                    setDialog={() => {}}
                  />
                  <Divider />
                </Box>
              ))}
            </Box>

            <Box sx={columnStyle}>
              <h3>Jobs</h3>
              <Divider />
              {selectedUser.jobs.map((task: any) => (
                <Box key={task.$id}>
                  <Chip
                    label={`${shortHijriDate(
                      task.$createdAt
                    )} | ${shortRomanDate(task.$createdAt)}`}
                  />
                  <TaskHeader
                    task={task}
                    checkedObserver={false}
                    handleTaskCheck={() => {}}
                    setInstance={() => {}}
                    setDialog={() => {}}
                  />
                  <Divider />
                </Box>
              ))}
            </Box>

            <Box sx={columnStyle}>
              <h3>Habits</h3>
              <Divider />
              {selectedUser.habits.map((task: any) => (
                <Box key={task.$id}>
                  <Chip
                    label={`${shortHijriDate(
                      task.$createdAt
                    )} | ${shortRomanDate(task.$createdAt)}`}
                  />
                  <TaskHeader
                    key={task.$id}
                    task={task}
                    checkedObserver={false}
                    handleTaskCheck={() => {}}
                    setInstance={() => {}}
                    setDialog={() => {}}
                  />
                  <Divider />
                </Box>
              ))}
            </Box>
          </Box>
        )}
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
        <Button
          variant="contained"
          startIcon={<PersonSearch />}
          onClick={handleFetchUsers}
        >
          {users.length ? "Fetch More Users" : "Fetch Users"}
        </Button>
      </Box>
    </Grid>
  );
};

export default Admin;
