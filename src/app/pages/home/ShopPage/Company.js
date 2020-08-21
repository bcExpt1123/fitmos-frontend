import React,{useState,useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";

import SectionProduct from "./SectionProduct";
import { $fetchFrontIndex, $frontPage,$cleanCompanyId } from "../../../../modules/subscription/product";
import useInfiniteScroll from "../../../../lib//useInfiniteScroll";


const Company = ({match}) => {
  const dispatch = useDispatch();
  const [id, setId] = useState(null);
  useEffect(() => {
    if(product.companyId != match.params.id){
      dispatch($fetchFrontIndex(match.params.id));
    }
    setId(match.params.id);
    return () => {
      dispatch($cleanCompanyId());
    };
  }, []);
  const product = useSelector(({ product }) => product);
  const meta = product.frontMeta;
  const products = product.frontData;
  useEffect(() => {
    setIsFetching(false);
  }, [product.frontMeta]);
  const fetchMoreListItems = ()=>{
    dispatch($frontPage(id));
  }
  const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems);
  return (
    <section className="company" id="company">
      {product&&product.company&&(
        <div className="item row">
          <div className="image mb-5 col-12 col-md-3">
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
              <div className="mt-2"><a href={product.company.website_url} target="new">{product.company.website_url}</a></div>
            )}
          </div>
        </div>
      )}
      <div className="row">
        {products&&products.map((product)=>
          <SectionProduct product={product}  key={product.id} />
        )}
        {meta&&meta.page<meta.pageTotal&&isFetching && 'Obteniendo más elementos de la lista...'}
      </div>
    </section>
  );
};

export default Company;
