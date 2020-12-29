import React from "react";

import SectionTagLineSettings from "./SectionTagLine";
import {SettingsPage,SubHeader} from "../index";

const TagLine = () => (
  <SettingsPage
    section={settingsProps => <SectionTagLineSettings {...settingsProps} />}
  />
);
const SubHeaderTagLineSettings = () => (
    <SubHeader title={'Tag Line Settings'} />
  )
export { TagLine, SubHeaderTagLineSettings };