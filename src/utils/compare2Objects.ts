export function compare2Objects(
  older: { [key: string]: any },
  newer: { [key: string]: any }
) {
  const allKeys = [...new Set([...Object.keys(older), ...Object.keys(newer)])];

  const changedValues = allKeys.reduce(
    (acc: { [key: string]: any }, key: string) => {
      if (!older.hasOwnProperty(key) || deepCompare(older[key], newer[key])) {
        acc[key] = newer[key];
      }

      return acc;
    },
    {}
  );

  return changedValues;
  // return removeEmptyValues(changedValues);
}

function deepCompare(
  oldObj: { [key: string]: any },
  newObj: { [key: string]: any }
) {
  if (
    typeof oldObj !== "object" ||
    oldObj === null ||
    typeof newObj !== "object" ||
    newObj === null
  ) {
    return oldObj !== newObj;
  }

  const oldKeys = Object.keys(oldObj);
  const newKeys = Object.keys(newObj);

  if (oldKeys.length !== newKeys.length) {
    return true; // Different number of keys
  }

  for (const key of oldKeys) {
    if (!newKeys.includes(key) || deepCompare(oldObj[key], newObj[key])) {
      return true; // Key missing or values differ
    }
  }

  // Check for new keys in the new object
  for (const key of newKeys) {
    if (!oldObj.hasOwnProperty(key)) {
      return true; // New key found
    }
  }

  return false; // Objects are equal
}

// function removeEmptyValues<T extends Record<string, any>>(obj: T): T {
//   const newObj = { ...obj };

//   Object.keys(newObj)?.forEach((key) => {
//     if (!newObj[key]) {
//       delete newObj[key];
//     }

//     if (Array.isArray(newObj[key]) && !newObj[key].length) {
//       delete newObj[key];
//     }

//     if (typeof newObj[key] === "object" && !Object.keys(newObj[key]).length) {
//       delete newObj[key];
//     }
//   });

//   return newObj;
// }
