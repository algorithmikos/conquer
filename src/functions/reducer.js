// Reducer function
export const reducer = (state, action) => {
  switch (action.type) {
    case "SET_ALL_STATES":
      return {
        ...action.payload,
      };
    case "SET_STATE": // Action type to set any state
      return {
        ...state,
        [action.payload.name]: action.payload.value, // Dynamically set state based on payload
      };
    // Handle more actions as needed
    default:
      return state;
  }
};

