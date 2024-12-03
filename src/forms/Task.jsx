import React, { useEffect, useState } from "react";
import "./Task.css";
import {
  Box,
  Button,
  Collapse,
  Grid2 as Grid,
  IconButton,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useMediaQueries } from "../functions/screenSizes";
import DeleteIcon from "@mui/icons-material/Delete";
import ChecklistIcon from "@mui/icons-material/Checklist";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import TagCreator from "../components/TagCreator/TagCreator";

import { textDirection } from "../functions/textDirection";

import "react-datepicker/dist/react-datepicker.css";
import {
  ArrowDownward,
  ArrowUpward,
  Block,
  Circle,
  DragIndicator,
  Lock,
  LockOpen,
} from "@mui/icons-material";
import OptionsMenu from "../components/OptionsMenu/OptionsMenu";
import { useTranslation } from "react-i18next";
// import EmojiPicker, { Emoji } from "emoji-picker-react";
import useDebounce from "../hooks/useDebounce";
import { v4 as uuid } from "uuid";
import { useSubRecurringStore } from "../stores/subRecurring";
import { Reorder } from "framer-motion";
// import { compare2Objects } from "../utils/compare2Objects";

const Task = ({
  taskState,
  setTaskState,
  taskType,
  instanceType,
  inputFields,
}) => {
  const { xs } = useMediaQueries();
  const { t, i18n } = useTranslation();

  const [collapse, setCollapse] = useState(true);
  // const [emoji, setEmoji] = useState(null);
  // const [showEmoji, setShowEmoji] = useState(false);

  const subRTsState = useSubRecurringStore((state) => state);
  const { subRTs } = subRTsState;

  const [task, setTask] = useState({ ...taskState, checklistChanges: [] });
  const [checklist, setChecklist] = useState(task.checklist ?? []);
  const [draggable, setDraggable] = useState(false);

  useEffect(() => {
    if (task.checklist && task.checklist.length > 0) {
      if (typeof task.checklist[0] === "string") {
        const targetedChecklist = task.checklist.map((itemId) => {
          const subRT = subRTs.find((subRT) => subRT.$id === itemId);
          return subRT;
        });
        setChecklist(targetedChecklist);
      }
    }
  }, [subRTs]);

  useDebounce({
    callback: () => {
      setTaskState(instanceType, task);
    },
    value: task,
  });

  return (
    <Grid container direction="column" p={0}>
      <Grid py={1}>
        <Grid
          container
          direction="column"
          gap={xs ? 2 : 1}
          sx={{ my: 1, px: xs ? 5 : 2.5 }}
        >
          <Grid>
            <TextField
              label={t("Title")}
              value={task.title}
              onChange={(e) => {
                setTask({ ...task, title: e.target.value });

                textDirection(e.target.value) === "left"
                  ? (e.target.dir = "ltr")
                  : (e.target.dir = "rtl");
              }}
              sx={{
                direction:
                  textDirection(task.title) === "right" ? "rtl" : "ltr",
                textAlign: textDirection(task.title),
              }}
              fullWidth
              multiline
            />
          </Grid>

          <Grid>
            <TextField
              label={t("Description")}
              value={task.description}
              onChange={(e) => {
                setTask({ ...task, description: e.target.value });

                textDirection(e.target.value) === "left"
                  ? (e.target.dir = "ltr")
                  : (e.target.dir = "rtl");
              }}
              fullWidth
              multiline
              sx={{
                direction:
                  textDirection(task.description) === "right" ? "rtl" : "ltr",
                textAlign: textDirection(task.description),
              }}
              // maxRows={3}
              // InputProps={{
              //   endAdornment: (
              //     <IconButton onClick={() => setShowEmoji(!showEmoji)}>
              //       <EmojiEmotions />
              //     </IconButton>
              //   ),
              // }}
            />
            {/* <EmojiPicker
              open={showEmoji}
              hiddenEmojis={["1f4a9"]}
              onEmojiClick={(emoji) => {
                setTaskState(instanceType, {
                  ...taskState,
                  description:
                    taskState.description +
                    " " +
                    <Emoji unified={emoji.unified} />,
                });
              }}
              theme="dark"
              lazyLoadEmojis
              width="100%"
              style={{ marginTop: 20 }}
            /> */}
          </Grid>
        </Grid>
      </Grid>

      {/* Second Form Section */}
      <Grid sx={{ backgroundColor: "#444444", py: 1 }}>
        <Grid
          container
          direction="column"
          gap={xs ? 2 : 1}
          sx={{ px: xs ? 5 : 2.5 }}
        >
          {/******* Checklist Section *******/}

          {/* Checklist Header & Collapse */}
          {checklist?.length > 0 && (
            <Grid
              container
              gap={1}
              mb={collapse ? 1 : 0}
              className="checklist-header"
              alignItems="center"
              justifyContent="space-between"
            >
              <ChecklistIcon />

              <Typography
                variant="subtitle1"
                fontWeight="bold"
                className="app-font"
              >
                {t("Checklist")}
              </Typography>

              <Grid>
                <IconButton onClick={() => setDraggable((prev) => !prev)}>
                  {draggable ? <LockOpen /> : <Lock />}
                </IconButton>

                <IconButton onClick={() => setCollapse(!collapse)}>
                  <ExpandMoreIcon
                    className="collapsed-el"
                    sx={{
                      transform: collapse ? "rotate(180deg)" : "rotate(360deg)",
                    }}
                  />
                </IconButton>
              </Grid>
            </Grid>
          )}
          {/* End of Checklist Header & Collapse */}

          {/* Checklist Mapped Items */}
          {checklist?.length > 0 && (
            <Collapse in={collapse} timeout={500} mountOnEnter unmountOnExit>
              <DropArea
                dragabble={draggable}
                checklist={checklist}
                setChecklist={setChecklist}
                setTask={setTask}
                taskType={taskType}
              >
                <Grid container gap={1} direction="column">
                  {checklist.map((item, itemIndex) => (
                    /* Item Main Container */
                    <DraggableItem
                      key={item.$id}
                      draggable={draggable}
                      item={item}
                    >
                      {/* Item Inner Container */}
                      <Grid
                        container
                        justifyContent="center"
                        alignItems="center"
                        className="card-header"
                        sx={{
                          direction:
                            textDirection(checklist?.[itemIndex]?.item) ===
                            "right"
                              ? "rtl"
                              : "ltr",
                        }}
                      >
                        {/* Item Option Menu Trigger */}

                        {draggable && (
                          <Grid>
                            <DragIndicator
                              sx={{ cursor: "grab" }}
                              className="card-options"
                            />

                            {/* <OptionsMenu
                      className="card-options"
                      options={[
                        {
                          name: "",
                          category: "checklist",
                          icon: (
                            <ArrowUpward
                              fontSize="small"
                              color={
                                itemIndex === 0 ? "default" : "success"
                              }
                            />
                          ),
                          disabled: itemIndex === 0,
                          onClick: () => {
                            const updatedChecklist = checklist || [];
                            updatedChecklist.splice(itemIndex, 1);

                            if (itemIndex === 0) {
                              updatedChecklist.unshift(item);
                            } else {
                              updatedChecklist.splice(
                                itemIndex - 1,
                                0,
                                item
                              );
                            }

                            setTask({
                              ...task,
                              checklist:
                                taskType === "rTask"
                                  ? updatedChecklist.map(
                                      (item) => item?.$id
                                    )
                                  : updatedChecklist,
                            });
                          },
                        },
                        {
                          name: "",
                          category: "checklist",
                          icon: (
                            <ArrowDownward
                              fontSize="small"
                              color={
                                itemIndex === checklist.length - 1
                                  ? "default"
                                  : "error"
                              }
                            />
                          ),
                          disabled: itemIndex === checklist.length - 1,

                          onClick: () => {
                            const updatedChecklist = checklist || [];
                            updatedChecklist.splice(itemIndex, 1);

                            if (itemIndex === checklist.length)
                              updatedChecklist.push(item);
                            else
                              updatedChecklist.splice(
                                itemIndex + 1,
                                0,
                                item
                              );

                            setTask({
                              ...task,
                              checklist:
                                taskType === "rTask"
                                  ? updatedChecklist.map(
                                      (item) => item?.$id
                                    )
                                  : updatedChecklist,
                            });
                          },
                        },
                      ]}
                    /> */}
                          </Grid>
                        )}

                        {/* End of Item Option Menu Trigger */}

                        {/* Item Text & Delete Button Main Container */}
                        <Grid width="90%">
                          {/* Item Text & Delete Button Inner Container */}
                          <Grid container justifyContent="space-between">
                            <TextField
                              className="custom-input"
                              sx={{ width: draggable ? "90%" : "92%" }}
                              variant="standard"
                              size="small"
                              multiline
                              value={checklist?.[itemIndex]?.item || ""}
                              placeholder={t("Sub_task_title")}
                              onChange={(e) => {
                                const updatedChecklist = [...(checklist || [])];

                                updatedChecklist[itemIndex] = {
                                  ...updatedChecklist[itemIndex],
                                  $id:
                                    updatedChecklist[itemIndex]?.$id || uuid(),
                                  item: e.target.value,
                                  updated: true,
                                };

                                taskType === "job" &&
                                  delete updatedChecklist[itemIndex].updated;

                                setChecklist(updatedChecklist);

                                const updatedChecklistChanges = [
                                  ...(task.checklistChanges || []).filter(
                                    (item) =>
                                      item.$id !== checklist?.[itemIndex]?.$id
                                  ),
                                  updatedChecklist[itemIndex],
                                ];

                                setTask((prevTask) => ({
                                  ...prevTask,
                                  checklist:
                                    taskType === "rTask"
                                      ? updatedChecklist.map(
                                          (item) => item?.$id
                                        )
                                      : updatedChecklist,
                                  checklistChanges: updatedChecklistChanges,
                                }));
                              }}
                            />

                            {/* Item Delete Icon Button */}
                            <Grid>
                              <DeleteIcon
                                sx={{
                                  color: "grey",
                                }}
                                className="card-options delete-button"
                                onClick={() => {
                                  const updatedChecklist = [
                                    ...checklist,
                                  ]?.filter(
                                    (checklistItem) =>
                                      checklistItem.$id !== item.$id
                                  );

                                  setChecklist(updatedChecklist);

                                  const updatedChecklistChanges = [
                                    ...(task.checklistChanges?.filter(
                                      (checklistItem) =>
                                        checklistItem.$id !== item.$id
                                    ) || []),
                                    { $id: item.$id, deleted: true },
                                  ];

                                  setTask((prev) => ({
                                    ...prev,

                                    checklist:
                                      taskType === "rTask"
                                        ? updatedChecklist?.map(
                                            (item) => item.$id
                                          )
                                        : updatedChecklist,

                                    checklistChanges:
                                      taskType === "rTask"
                                        ? updatedChecklistChanges
                                        : [],
                                  }));
                                }}
                              />
                            </Grid>
                            {/* End of Item Delete Icon Button */}
                          </Grid>
                          {/* End of Item Text & Delete Button Inner Container */}
                        </Grid>
                        {/* End of Item Text & Delete Button Main Container */}
                      </Grid>
                      {/* End of Item Inner Container */}
                    </DraggableItem>
                    /* End of Item Main Container */
                  ))}
                </Grid>
              </DropArea>
            </Collapse>
          )}
          {/* End of Checklist Mapped Items */}

          {/* Add Checklist Item Button */}
          {collapse && (
            <Button
              variant="outlined"
              color="info"
              className="app-font"
              sx={{ mt: 1 }}
              onClick={() => {
                const newItem =
                  taskType === "rTask"
                    ? {
                        $id: uuid(),
                        item: "",
                        new: true,
                      }
                    : {
                        $id: uuid(),
                        item: "",
                      };

                if (checklist) {
                  const updatedChecklist = [...checklist, newItem];

                  setChecklist(updatedChecklist);

                  setTask({
                    ...task,
                    checklist:
                      taskType === "rTask"
                        ? updatedChecklist.map((item) => item?.$id)
                        : updatedChecklist,
                    checklistChanges: [
                      ...(task.checklistChanges || []),
                      newItem,
                    ],
                  });
                } else {
                  setChecklist([newItem]);

                  setTask({
                    ...task,
                    checklist: [taskType === "rTask" ? newItem?.$id : newItem],
                    checklistChanges: [newItem],
                  });
                }
              }}
            >
              {t("Add_Item")}
            </Button>
          )}
          {/* End of Add Checklist Item Button */}

          {/******* End of Checklist Section *******/}

          {/* Tags Field Start */}
          <Grid>
            <TagCreator
              taskState={taskState}
              setTaskState={setTaskState}
              field="tags"
              label={t("Tags")}
              placeholder={t("Type_a_new_tag")}
              collection={[]}
              existingValue={[].map((project) => project.$id)}
            />
          </Grid>
          {/* Tags Field End */}

          {/* Task Color Start */}
          <Grid
            alignItems="center"
            justifyContent={i18n.language === "ar" ? "right" : "left"}
            sx={{
              border: "GrayText 1px solid",
              borderRadius: "5px",
              p: 1,
            }}
          >
            <InputLabel sx={{ display: "inline" }}>{t("Color")}:</InputLabel>
            {[
              "var(--bg-gray)",
              "var(--bg-brown)",
              "var(--bg-orange)",
              "var(--bg-yellow)",
              "var(--bg-green)",
              "var(--bg-blue)",
              "var(--bg-purple)",
              "var(--bg-pink)",
              "var(--bg-red)",
            ].map((color, index) => (
              <IconButton
                key={`color-${index}`}
                onClick={() =>
                  setTask({
                    ...task,
                    color: color,
                  })
                }
              >
                <Circle
                  sx={{
                    color: color,
                    border: task.color === color && "3px solid orange",
                    borderRadius: "50%",
                  }}
                />
              </IconButton>
            ))}
            <IconButton
              onClick={() =>
                setTask({
                  ...task,
                  color: "",
                })
              }
            >
              <Block
                sx={{
                  border: !task.color && "3px solid orange",
                  borderRadius: "50%",
                }}
              />
            </IconButton>
          </Grid>
          {/* Task Color End */}

          {inputFields}
        </Grid>
      </Grid>
      {/* End of Second Form Section */}
    </Grid>
  );
};

export default Task;

const DropArea = ({
  dragabble,
  checklist,
  setChecklist,
  setTask,
  taskType,
  children,
}) => {
  if (dragabble) {
    return (
      <Reorder.Group
        as="section"
        values={checklist}
        onReorder={(reorderedChecklist) => {
          setChecklist(reorderedChecklist);
          setTask((prev) => ({
            ...prev,
            checklist:
              taskType === "rTask"
                ? reorderedChecklist.map((item) => item.$id)
                : reorderedChecklist,
          }));
        }}
        style={{
          padding: 0,
          margin: 0,
        }}
      >
        {children}
      </Reorder.Group>
    );
  }

  return children;
};

const DraggableItem = ({ draggable, item, children }) => {
  if (draggable) {
    return (
      <Reorder.Item
        value={item}
        key={item.$id}
        as="div"
        style={{ marginBottom: -50 }}
      >
        {children}
      </Reorder.Item>
    );
  }

  return <div style={{ marginBottom: -25 }}>{children}</div>;
};
