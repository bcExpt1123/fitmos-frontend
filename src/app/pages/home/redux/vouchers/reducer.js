import { handleActions } from "redux-actions";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  validateVoucher,
  validateVoucherFailed,
  validateVoucherSucceeded,
  initialVoucher
} from "./actions";

const initialState = {
};
const reducer = persistReducer(
  {
    storage,
    key: "vouchers"
  },
  handleActions(
    {
      [validateVoucher]: (state, { payload: { token } }) => ({
        ...state,
        [token]: {
          ...state[token],
          isLoading: true
        }
      }),
      [validateVoucherFailed]: (state, { payload: { token } }) => ({
        ...state,
        [token]: {
          isLoading: false
        }
      }),

      [validateVoucherSucceeded]: (state, { payload: voucher }) => ({
        ...state,
        [voucher.token]: {
          ...voucher,
          isLoading: false
        }
      }),
      [initialVoucher]: () => {
        return initialState;
      }
    },
    initialState
  )
);
export default reducer;
