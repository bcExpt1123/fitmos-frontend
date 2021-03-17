import { createActions } from "redux-actions";
export const DIALOG_TYPE = {
  PRIVATE: 3,
  GROUP: 2,
  BROADCAST: 1,
  PUBLIC_CHANNEL: 4
}
export const {
  setItemValue,
  addNewDialog,
  createDialog,
  fetchDialogs,
  sortDialogs,
  updateDialog,
  selectedDialog,  
} = createActions(
  "SET_ITEM_VALUE",
  "ADD_NEW_DIALOG",
  "CREATE_DIALOG",
  "FETCH_DIALOGS",
  "SORT_DIALOGS",
  "UPDATE_DIALOG",
  "SELECTED_DIALOG",
  { prefix: "DIALOG" }
);
