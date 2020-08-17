import React,{useState,useEffect} from "react";
import Pagination from "react-js-pagination";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { $fetchFrontIndex,$frontPage } from "../../../../modules/subscription/company";


const Shop = () => {
  const [activePage, setActivePage] = useState(1);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch($fetchFrontIndex())
  }, []);
  const company = useSelector(({ company }) => company);
  const meta = company.frontMeta;
  const companies = company.frontData;
  const handlePageChange = (number)=>{
    setActivePage(number);
    dispatch($frontPage(number));
  }
  return (
    <section className="shop" id="shop">
      <div className="row">
        {companies&&companies.map((company)=>
          <article className="col-12 col-md-4"  key={company.id}>
            <div className="content">
              <NavLink
                aria-label="Company"
                title={`Read ${company.title}`}
                to={`/shop/companies/${company.id}`}
              >
                <div className="image">
                  <div className="background-container">
                    <div className="background" 
                      style={{
                        backgroundImage: "url(" + company.logo + ")"
                      }}
                    >
                    </div>
                  </div>
                </div>
                <div className="body">
                  <div className="name">
                    {company.name}
                  </div>
                </div>
              </NavLink> 
            </div>
          </article>
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

export default Shop;
