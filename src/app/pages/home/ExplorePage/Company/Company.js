import React from "react";
import MetaTags from "react-meta-tags";
import { matchPath } from "react-router-dom";

import Company from "../../ShopPage/Company";

const CompanyPage = () => {
  const match = matchPath(window.location.pathname, {
      path:'/shop/companies/:id',
      exact:true,
      strict:true
    });    
  return (
  <>
    <MetaTags>
      <title>Company -Fitemos </title>
      <meta
        name="description"
        content="Company -Fitemos"
      />
    </MetaTags>
    <Company match={match}/>
  </>
)};

export default CompanyPage;
