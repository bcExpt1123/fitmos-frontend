import React from "react";
import { NavLink } from "react-router-dom";


const SectionProduct = ({product}) => (
  <article className="col-12 col-md-4">
    <div className="content">
      <NavLink
        aria-label="Product"
        title={`Read ${product.name}`}
        to={`/shop/products/${product.id}`}
      >
        <div className="image">
          <div className="background-container">
            <div className="background" 
              style={{
                backgroundImage: "url(" + product.media_url + ")"
              }}
            >
            </div>
          </div>
        </div>
        <div className="body">
          <div className="name">
            {product.name}
          </div>
          <div className="price mt-3">
            {product.price_type === 'offer'?(
              <>
                <span className="regular-price">${product.regular_price}</span>&nbsp;&nbsp;<span>${product.price}</span>
              </>
            ):(
              <span>{product.discount}% descuento</span>
            )}
          </div>
        </div>
      </NavLink> 
    </div>
  </article>
)

export default SectionProduct;
