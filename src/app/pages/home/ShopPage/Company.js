import React,{useState,useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";

import SectionProduct from "./SectionProduct";
import { $fetchFrontIndex, $frontPage,$cleanCompanyId } from "../../../../modules/subscription/product";
import useInfiniteScroll from "../../../../lib//useInfiniteScroll";


const Company = ({match}) => {
  const dispatch = useDispatch();
  const [id, setId] = useState(null);
  const product = useSelector(({ product }) => product);
  useEffect(() => {
    if(product.companyId !== match.params.id){
      dispatch($fetchFrontIndex(match.params.id));
    }
    setId(match.params.id);
    return () => {
      dispatch($cleanCompanyId());
    };
  },[]);// eslint-disable-line react-hooks/exhaustive-deps
  const meta = product.frontMeta;
  const products = product.frontData;
  useEffect(() => {
    setIsFetching(false);
  }, [product.frontMeta]);// eslint-disable-line react-hooks/exhaustive-deps
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
            {product.company.address&&(
              <div className="mt-2"><label className="font-bold-weight">Dirección:</label>&nbsp;{product.company.address}&nbsp;</div>
            )}
            {product.company.website_url&&(
              <div className="mt-2"><label className="font-bold-weight">Website:</label><a href={product.company.website_url} target="new">{product.company.website_url}</a></div>
            )}
            {product.company.mail&&(
              <div className="mt-2"><label className="font-bold-weight">Correo:</label>&nbsp;{product.company.mail}&nbsp;</div>
            )}
            {product.company.facebook&&(
              <div className="mt-2"><label className="font-bold-weight">Facebook:</label>&nbsp;{product.company.facebook}</div>  
            )}
            {product.company.horario&&(
              <div className="mt-2"><label className="font-bold-weight">Horario:</label>&nbsp;{product.company.horario}</div>
            )}
            {product.company.instagram&&(
              <div className="mt-2"><label className="font-bold-weight">Instagram:</label>&nbsp;{product.company.instagram}</div>
            )}
            {product.company.twitter&&(
              <div className="mt-2"><label className="font-bold-weight">Twitter:</label>&nbsp;{product.company.twitter}</div>
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
