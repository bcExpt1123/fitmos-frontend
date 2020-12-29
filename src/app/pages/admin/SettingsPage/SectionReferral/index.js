import React from "react";

import SectionReferralSettings from "./SectionReferral";
import {SettingsPage,SubHeader} from "../index";

const Referral = () => (
  <SettingsPage
    section={settingsProps => <SectionReferralSettings {...settingsProps} />}
  />
);
const SubHeaderReferralSettings = () => (
    <SubHeader title={'Abandon Cart Settings'} />
  )
export { Referral, SubHeaderReferralSettings };