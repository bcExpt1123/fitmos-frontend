import React from "react";
import MetaTags from "react-meta-tags";

import ThreeColumn from "./layouts/Three";
import SectionInvite from "./sections/SectionInvite";
import SectionPartners from "./sections/SectionPartners";
import PageHeader from "./layouts/PageHeader";

const PartnersPage = () => (
  <>
    <MetaTags>
      <title>Partners -Fitemos </title>
      <meta
        name="description"
        content="Partners -Fitemos"
      />
    </MetaTags>
    <ThreeColumn>
      <PageHeader title={`Training Partners`}/>
      <SectionInvite />
      <SectionPartners />
    </ThreeColumn>
  </>
);

export default PartnersPage;
