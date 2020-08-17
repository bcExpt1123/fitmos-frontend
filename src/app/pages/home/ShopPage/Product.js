import React,{useState,useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";

import SectionProduct from "./SectionProduct";
import { $showFrontProduct } from "../../../../modules/subscription/product";


const Product = ({match}) => {
  const dispatch = useDispatch();
  const [image, setImage]=useState(null);
  useEffect(() => {
    dispatch($showFrontProduct(match.params.id));
    console.log(match.params.id)
  }, [match.params.id]);
  const product = useSelector(({ product }) => product);
  useEffect(() => {
    if(product.item.gallery)setImage(product.item.gallery[0]);
  }, [product.item]);
  const products = product.frontData;
  return (
    <section className="product" id="company">
      {product&&image&&(
        <>
          <div className="item row">
            <div className="image col-12 col-md-3">
              {product.item.gallery&&(
                <div className="background-container">
                  <div className="background" 
                    style={{
                      backgroundImage: "url(" + image.image + ")"
                    }}
                  >
                  </div>
                </div>
              )}
            </div>
            <div className="col-12 col-md-9">
              <h3>{product.name}</h3>
              <div className="mt-4">{product.item.description}</div>
              <div className="product-attributes">
                  <label>Offer:</label>&nbsp;&nbsp;             
                  {product.item.price_type == 'offer'?(
                    <>
                      <span className="regular-price">${product.item.regular_price}</span>&nbsp;&nbsp;<span>${product.item.price}</span>
                    </>
                  ):(
                    <span>{product.item.discount}% descuento</span>
                  )}
                  &nbsp;&nbsp;
                  <span className="usage">
                    <label>Usage</label>&nbsp;&nbsp;<span>{product.item.voucher_type}</span>
                  </span>
              </div>
              <button className="btn btn-primary mt-3">Print Voucher</button>
            </div>
          </div>
          <div className="row">
            <div className="gallery col-12 col-md-3 mt-2">
              {product.item.gallery&&product.item.gallery.map( image=>
                <div>
                  <img src={image.thumbnail} key={image.id} onClick={()=>setImage(image)}/>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      <h2 className="mt-5">Related Items</h2>
      <div className="row">
        {products&&products.map((product)=>
          <SectionProduct product={product}  key={product.id} />
        )}
      </div>
    </section>
  );
};

export default Product;
