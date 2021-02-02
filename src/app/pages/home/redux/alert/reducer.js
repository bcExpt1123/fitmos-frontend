import { handleActions } from "redux-actions";
import { addAlertMessage, dismissAlert,initialAlerts } from "./actions";

const initialState = {
  queue: [],
  currentMessage: undefined
};

export default handleActions(
  {
    [addAlertMessage]: (state, { payload }) => {
      const queue = state.queue.concat([payload]);
      return {
        queue,
        currentMessage: queue[0]
      };
    },

    [dismissAlert]: state => {
      const queue = state.queue.slice(1);
      return {
        queue,
        currentMessage: queue[0]
      };
    },
    [initialAlerts]:() => ({
      ...initialState
    }),
  },
  initialState
);
