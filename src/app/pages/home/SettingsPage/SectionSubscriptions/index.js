import React from "react";

import SectionSubscriptions from "./SectionSubscriptions";
import SettingsPage from "../index";

/*export default (
  <SettingsPage
    section={(settingsProps) => <SectionPayments {...settingsProps} />}
  />
);*/
const page = () => (
  <SettingsPage
    section={settingsProps => <SectionSubscriptions {...settingsProps} />}
  />
);
export default page;