import React from "react";

import SectionPayments from "./SectionPayments";
import SettingsPage from "../index";

/*export default (
  <SettingsPage
    section={(settingsProps) => <SectionPayments {...settingsProps} />}
  />
);*/
const page = () => (
  <SettingsPage
    section={settingsProps => <SectionPayments {...settingsProps} />}
  />
);
export default page;
