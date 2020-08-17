import React,{useState,useEffect} from "react";
import Pagination from "react-js-pagination";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { $fetchFrontIndex,$frontPage } from "../../../../modules/subscription/event";

export default function Blog() {
  const [activePage, setActivePage] = useState(1);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch($fetchFrontIndex())
  }, []);
  const event = useSelector(({ event }) => event);
  const meta = event.frontMeta;
  const posts = event.frontData;
  const handlePageChange = (number)=>{
    setActivePage(number);
    dispatch($frontPage(number));
  }
  return (
    <section className="blog" id="blog">
      <div className="row">
        {posts&&posts.map((post)=>
          <article className="col-12 col-md-4"  key={post.id}>
            <div className="content">
              <NavLink
                  aria-label="Post"
                  title={`Read ${post.title}`}
                  to={`/news/${post.id}`}
                >
                <div className="image">
                  <div className="background-container">
                      <div className="background" 
                        style={{
                          backgroundImage: "url(" + post.image + ")"
                        }}
                      >
                        <h6 className="category">{post.category.name}</h6>
                        <h4 className="post-title">{post.title}</h4>
                      </div>
                  </div>
                </div>
              </NavLink> 
              <div className="body">
                <div className="summury">
                  {post.excerpt}
                </div>
                <div className="publish_date">
                  Fitemos - {post.created_date}
                </div>
                <button>
                  <NavLink
                    className="button"
                    aria-label="Post"
                    title={`Read ${post.title}`}
                    to={`/news/${post.id}`}
                  >
                    Leer Más
                  </NavLink> 
                </button>   
              </div>
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
}
