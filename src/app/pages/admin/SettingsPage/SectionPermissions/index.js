import React from "react";

import SectionPermissions from "./SectionPermissions";
import {SettingsPage,SubHeader} from "../index";

/*export default (
  <SettingsPage
    section={(settingsProps) => <SectionInvoices {...settingsProps} />}
  />
);*/
const Permissions = () => (
  <SettingsPage
    section={settingsProps => <SectionPermissions {...settingsProps} />}
  />
);
const SubHeaderPermissions = () => (
  <SubHeader title={'Roles & Permissions'} />
)
export { Permissions, SubHeaderPermissions };