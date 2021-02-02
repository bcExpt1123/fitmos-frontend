import React from "react";

import SectionInvoices from "./SectionInvoices";
import SettingsPage from "../index";

/*export default (
  <SettingsPage
    section={(settingsProps) => <SectionInvoices {...settingsProps} />}
  />
);*/
const page = () => (
  <SettingsPage
    section={settingsProps => <SectionInvoices {...settingsProps} />}
  />
);
export default page;
