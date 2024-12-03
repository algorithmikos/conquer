import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import { useAuthStore } from "../../store";
import { useTranslation } from "react-i18next";
import { auth } from "../../firebase.config";

const createFilter = createFilterOptions((option) => {
  // Allow filtering by both title and creating new tags
  const searchTerm = params.inputValue.toLowerCase();
  return (
    option.title.toLowerCase().includes(searchTerm) || searchTerm.trim() === ""
  );
});

function TagCreator({
  taskState,
  setTaskState,
  instanceType,
  field,
  label,
  placeholder,
  collection,
  createFunction,
  existingValue = [],
}) {
  const { t, i18n } = useTranslation();

  const findDocTitle = (documentId) => {
    const matchingDocument = collection?.find(
      (document) => document.$id === documentId
    );
    return matchingDocument ? matchingDocument.title : ""; // Handle cases where project is not found
  };
  // const { tags } = taskState;
  const fieldValue = taskState[field] || [];

  const handleChange = (newValue) => {
    setTaskState(instanceType, { ...taskState, [field]: newValue });
  };

  const handleInputChange = async (event) => {
    const newInputValue = event.target.value.replace(/,/g, "").trim(); // Trim whitespace
    const taskFieldValue = [...fieldValue];
    if (
      newInputValue &&
      !taskFieldValue?.find((value) => findDocTitle(value) === newInputValue)
    ) {
      const newItem = await createFunction(
        { title: newInputValue },
        auth.currentUser.$id
      );
      setTaskState(instanceType, {
        ...taskState,
        [field]: [...fieldValue, newItem.$id],
      });
    }
  };

  return (
    <Autocomplete
      fullWidth
      multiple
      value={fieldValue}
      onChange={(event, value) => handleChange(value)}
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
      filterOptions={createFilterOptions((option) => {
        console.log(option, params);

        // Allow filtering by both title and creating new tags
        const searchTerm = params.inputValue.toLowerCase();
        return (
          option.title.toLowerCase().includes(searchTerm) ||
          searchTerm.trim() === ""
        );
      })}
      options={existingValue}
      getOptionLabel={(option) => findDocTitle(option)}
      noOptionsText={t("No_options")}
      ListboxProps={{
        className: "app-font",
        dir: i18n.language === "ar" ? "rtl" : "ltr",
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          className="app-font"
          placeholder={placeholder}
          onKeyDown={(event) => {
            if (
              (event.key === "Enter" || event.key === ",") &&
              event.target.value.trim() !== ""
            ) {
              handleInputChange(event);
              event.target.value = "";
            }
          }}
          onBlur={handleInputChange}
        />
      )}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            key={option}
            className="app-font"
            dir={i18n.language === "ar" ? "ltr" : "ltr"}
            sx={{ mx: 0.25 }}
            label={findDocTitle(option)}
            onDelete={() => {
              const updatedValue = [...fieldValue];
              updatedValue.splice(index, 1);
              setTaskState(instanceType, {
                ...taskState,
                [field]: updatedValue,
              });
            }}
          />
        ))
      }
    />
  );
}

export default TagCreator;
