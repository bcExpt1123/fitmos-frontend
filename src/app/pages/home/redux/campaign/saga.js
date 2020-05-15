import { call, put, race, select, take, fork } from "redux-saga/effects";

import {
  fetchCampaign,
  fetchCampaignSucceeded,
  fetchCampaignFailed,
  fetchCampaignRequested
} from "./actions";
import {
  validateVoucher,
  validateVoucherFailed,
  validateVoucherSucceeded
} from "../vouchers/actions";
import { http } from "../../services/api";
import { INTERVAL_TO_MONTHS_NUM } from "../../services/product";
import { trackError } from "../error/actions";

const requestCampaign = ({ locale }) =>
  http({
    app: "user",
    path: `/v2/marketing/web_campaigns.json?locale=${locale}`
  })
    .then(response => response.data.web_campaigns[0])
    .then(campaign => ({
      target: campaign.target,
      voucherToken: campaign.voucher_token,
      headline: campaign.headline,
      subheadline: campaign.subline,
      trackingId: campaign.tracking_id
    }))
    .catch(() => undefined);

/* Campaign is active only if it's voucher is active too, we to check both */
function* onFetchCampaign() {
  try {
    const { campaign } = yield select(store => store.campaign);
    const voucher = yield select(
      store => campaign && store.vouchers[campaign.voucherToken]
    );

    if (campaign && voucher && voucher.token) {
      yield put(fetchCampaignSucceeded({ campaign }));
      return;
    }
  } catch (error) {
    yield put(trackError(error));
  }

  try {
    yield put(fetchCampaignRequested());

    const locale = yield select(store => store.locale);
    const campaign = yield call(requestCampaign, { locale });

    if (campaign) {
      const token = campaign.voucherToken;
      yield put(
        validateVoucher({
          token,
          intervals: Object.keys(INTERVAL_TO_MONTHS_NUM)
        })
      );

      while (true) {
        const result = yield race({
          failed: take(validateVoucherFailed),
          succeeded: take(validateVoucherSucceeded)
        });

        if (result.failed && result.failed.payload.token === token) {
          break;
        }

        if (result.succeeded && result.succeeded.payload.token === token) {
          break;
        }
      }

      const voucher = yield select(store => store.vouchers[token]);

      // Global campaigns should only have percentage_discount vouchers
      if (voucher && voucher.type === "percentage_discount") {
        yield put(fetchCampaignSucceeded({ campaign }));
        return;
      }
    }

    yield put(fetchCampaignFailed());
  } catch (error) {
    yield put(fetchCampaignFailed(error));
  }
}

export default function* rootSaga() {
  const action = take(fetchCampaign);

  yield fork(onFetchCampaign, action);

  const [succeeded] = yield race([
    take(fetchCampaignSucceeded),
    take(fetchCampaignFailed)
  ]);

  while (true) {
    yield take(fetchCampaign);

    if (succeeded) {
      yield put(fetchCampaignSucceeded(succeeded.payload));
    } else {
      yield put(fetchCampaignFailed());
    }
  }
  // yield takeEvery(fetchCampaign, onFetchCampaign);
}
