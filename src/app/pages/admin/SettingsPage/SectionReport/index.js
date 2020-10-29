import React from "react";

import SectionReports from "./SectionReports";
import {SettingsPage,SubHeader} from "../index";

const Reports = () => (
  <SettingsPage
    section={settingsProps => <SectionReports {...settingsProps} />}
  />
);
const SubHeaderReports = () => (
  <SubHeader title={'Reports'} />
)
export { Reports, SubHeaderReports };