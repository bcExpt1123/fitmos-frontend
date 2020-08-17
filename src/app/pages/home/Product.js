import React from "react";
import MetaTags from "react-meta-tags";
import { useSelector } from "react-redux";

import TwoColumn from "./layouts/Two";
import ThreeColumn from "./layouts/Three";
import Product from "./ShopPage/Product";
import PageHeader from "./layouts/PageHeader";

const ProductPage = ({match}) => {
  const product = useSelector(({ product }) => product.item);
  return(
  <>
    <MetaTags>
      <title>Product -Fitemos </title>
      <meta
        name="description"
        content="Product -Fitemos"
      />
    </MetaTags>
    <ThreeColumn>
      {product&&product.company&&(
        <PageHeader title={`Shop`} breadcrumb={[{name:"Shop",url:"/shop",arrow:true},{name:product.company.name,url:`/companies/${product.company_id}`,arrow:false}]}/>
      )}
      <Product match={match}/>
    </ThreeColumn>
  </>
)};

export default ProductPage;
