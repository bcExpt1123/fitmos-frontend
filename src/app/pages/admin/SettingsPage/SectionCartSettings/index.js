import React from "react";

import SectionCartSettings from "./SectionCartSettings";
import {SettingsPage,SubHeader} from "../index";

const CartSettings = () => (
  <SettingsPage
    section={settingsProps => <SectionCartSettings {...settingsProps} />}
  />
);
const SubHeaderCartSettings = () => (
    <SubHeader title={'Abandon Cart Settings'} />
  )
export { CartSettings, SubHeaderCartSettings };
