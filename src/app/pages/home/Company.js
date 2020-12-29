import React from "react";
import MetaTags from "react-meta-tags";

import ThreeColumn from "./layouts/Three";
import Company from "./ShopPage/Company";
import PageHeader from "./layouts/PageHeader";

const CompanyPage = ({match}) => {
  return (
  <>
    <MetaTags>
      <title>Company -Fitemos </title>
      <meta
        name="description"
        content="Company -Fitemos"
      />
    </MetaTags>
    <ThreeColumn>
      <PageHeader title={`Shop`}/>
      <Company match={match}/>
    </ThreeColumn>
  </>
)};

export default CompanyPage;
