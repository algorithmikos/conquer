export const eisenhower = (priority: {
  importance?: boolean;
  urgency?: boolean;
}) => {
  if (priority && priority instanceof Object) {
    if (priority.importance && priority.urgency) {
      // Important and Urgent
      return { color: "error", text: "High", order: 1 };
    } else if (priority.importance && !priority.urgency) {
      // Important and NOT Urgent
      return { color: "warning", text: "Medium", order: 2 };
    } else if (priority.urgency && !priority.importance) {
      // NOT Important and Urgent
      return { color: "info", text: "Low", order: 3 };
    } else if (!priority.urgency && !priority.importance) {
      // NOT Important and NOT Urgent
      return { color: "success", text: "Too_Low", order: 4 };
    }
  }

  return { color: "default", text: "None", order: 5 };
};
