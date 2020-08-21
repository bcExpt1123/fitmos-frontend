import React,{useState,useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LightgalleryProvider,
  LightgalleryItem,
  withLightgallery,
  useLightgallery
} from "react-lightgallery";
import "lightgallery.js/dist/css/lightgallery.css";

import SectionProduct from "./SectionProduct";
import { $showFrontProduct, $generateVoucher } from "../../../../modules/subscription/product";

const OpenButtonWithHook = ({product,image,productRender,number}) => {
  const { openGallery } = useLightgallery();
  return (
    <>
      <div className="image col-12 col-md-5" onClick={() => openGallery("gallery",number)}>
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
      <div className="col-12 col-md-7 d-md-block d-none">
        {productRender(product)}
      </div>
    </>
  );
};
const PhotoItem = ({ image, thumb, group }) => (
  <div style={{ maxWidth: "250px", width: "200px", padding: "5px",display:"none" }}>
    <LightgalleryItem group={group} src={image} thumb={thumb}>
      <img src={image} style={{ width: "100%" }} />
    </LightgalleryItem>
  </div>
);
const Product = ({match}) => {
  const dispatch = useDispatch();
  const [image, setImage]=useState(null);
  const [number, setNumber]=useState(0);
  useEffect(() => {
    dispatch($showFrontProduct(match.params.id));
  }, [match.params.id]);
  const product = useSelector(({ product }) => product);
  useEffect(() => {
    if(product.item.gallery){
      setImage(product.item.gallery[0]);
      //const gallery = product.item.gallery.map(item=>item.image);
      //setImages(gallery);
    }
  }, [product.item]);
  const thumbnailClick = (image,index)=>{
    setImage(image);
    setNumber(index);
  }
  const products = product.frontData;
  const handleClick = ()=>{
    dispatch($generateVoucher());
  }
  const productRender = (product)=>{
    return (
      <>
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
        <button className="btn btn-primary mt-3" onClick={handleClick}>Descargar Voucher</button>      
      </>
    )
  }
  return (
    <section className="product" id="company">
      {product&&image&&(
        <>
          <LightgalleryProvider>
            <div className="item row">
              <OpenButtonWithHook product={product} image={image} productRender={productRender} number={number}/>
            </div>
            <div className="row">
              <div className="gallery col-12 col-md-5 mt-2">
                {product.item.gallery&&product.item.gallery.map( (image, index)=>
                  <div key={image.id}>
                    <img src={image.thumbnail} onClick={()=>thumbnailClick(image, index)}/>
                  </div>
                )}
              </div>
              <div className="col-12 col-md-7  d-block d-md-none item">
                {productRender(product)}
              </div>
              {product.item.gallery&&product.item.gallery.map( image=>
                <PhotoItem key={image.id} image={image.image} thumb={image.thumbnail} group="gallery" />
              )}
            </div>  
          </LightgalleryProvider>
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
