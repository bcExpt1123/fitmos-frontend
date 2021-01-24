import React from "react";
import MetaTags from "react-meta-tags";
import { useSelector } from "react-redux";
import { matchPath } from "react-router-dom";

import Product from "../../ShopPage/Product";

const ProductPage = () => {
  const product = useSelector(({ product }) => product.item);
  const match = matchPath(window.location.pathname, {
    path:'/shop/products/:id',
    exact:true,
    strict:true
  });    
  return(
    <>
      <MetaTags>
        <title>Product -Fitemos </title>
        <meta
          name="description"
          content="Product -Fitemos"
        />
      </MetaTags>
      <Product match={match}/>
    </>
)};

export default ProductPage;
