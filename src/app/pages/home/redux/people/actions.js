import { createActions } from "redux-actions";

export const {
  findFriends,
  setPeople,
  searchAll,
  setSearchResult,
  setItemValue,
  searchCustomers,
  appendCustomers,
  searchCompanies,
  appendCompanies,
  searchPosts,
  appendPosts,
  findCustomer,
  findUsername,
} = createActions(
  "FIND_FRIENDS",
  "SET_PEOPLE",
  "SEARCH_ALL",
  "SET_SEARCH_RESULT",
  "SET_ITEM_VALUE",
  "SEARCH_CUSTOMERS",
  "APPEND_CUSTOMERS",
  "SEARCH_COMPANIES",
  "APPEND_COMPANIES",
  "SEARCH_POSTS",
  "APPEND_POSTS",
  "FIND_CUSTOMER",
  "FIND_USERNAME",
  { prefix: "PEOPLE" }
);
