import { createActions } from "redux-actions";

export const {
  addAlertMessage,
  dismissAlert,
  initialAlerts,
  alertMessageAdded,
  alertMessageDequeued,
  alertMessageDismissed
} = createActions(
  {
    ADD_ALERT_MESSAGE: ({ type, message, delay = 5000 }) => {
      if(type==='error'&&delay===5000)delay = 20000;
      return {
        type,
        message,
        delay
      }
    }
  },
  "DISMISS_ALERT",
  "INITIAL_ALERTS",
  "ALERT_MESSAGE_ADDED",
  "ALERT_MESSAGE_DEQUEUED",
  "ALERT_MESSAGE_DISMISSED",
  { prefix: "ALERT" }
);
