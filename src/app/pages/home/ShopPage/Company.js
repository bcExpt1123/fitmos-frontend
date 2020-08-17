import React,{useState,useEffect} from "react";
import Pagination from "react-js-pagination";
import { useDispatch, useSelector } from "react-redux";

import SectionProduct from "./SectionProduct";
import { $fetchFrontIndex, $frontPage } from "../../../../modules/subscription/product";


const Company = ({match}) => {
  const [activePage, setActivePage] = useState(1);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch($fetchFrontIndex(match.params.id))
  }, []);
  const product = useSelector(({ product }) => product);
  const meta = product.frontMeta;
  const products = product.frontData;
  const handlePageChange = (number)=>{
    setActivePage(number);
    dispatch($frontPage(number));
  }
  return (
    <section className="company" id="company">
      {product&&product.company&&(
        <div className="item row">
          <div className="image col-12 col-md-3">
            <div className="background-container">
              <div className="background" 
                style={{
                  backgroundImage: "url(" + product.company.media_url + ")"
                }}
              >
              </div>
            </div>
          </div>
          <div className="col-12 col-md-9">
            <h3>{product.company.name}</h3>
            <div className="mt-4">{product.company.description}</div>
            <div className="mt-2"><label className="font-bold-weight">Teléfono:</label>&nbsp;{product.company.phone}&nbsp;{
              product.company.mobile_phone&&(
                `/${product.company.mobile_phone}`
              )
            }</div>
            <div className="mt-2"><label className="font-bold-weight">Dirección:</label>&nbsp;{product.company.address}&nbsp;</div>
            {product.company.website_url&&(
              <div className="mt-2"><a href="product.company.website_url" target="new">{product.company.website_url}</a></div>
            )}
          </div>
        </div>
      )}
      <div className="row">
        {products&&products.map((product)=>
          <SectionProduct product={product}  key={product.id} />
        )}
      </div>
      <div className="pagination-wrapper">
        <Pagination
          activePage={activePage}
          itemsCountPerPage={meta.pageSize}
          totalItemsCount={meta.total}
          itemClass="page-item"
          linkClass="page-link"
          onChange={handlePageChange}
        />
      </div>
    </section>
  );
};

export default Company;
