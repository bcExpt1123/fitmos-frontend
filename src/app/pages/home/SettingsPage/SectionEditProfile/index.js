import React from "react";

import SectionEditProfile from "./SectionEditProfile";
import SettingsPage from "../index";

/*export default (
  <SettingsPage
    section={(settingsProps) => <SectionEditProfile {...settingsProps} />}
  />
);*/
const page = () => (
  <SettingsPage
    section={settingsProps => <SectionEditProfile {...settingsProps} />}
  />
);
export default page;
