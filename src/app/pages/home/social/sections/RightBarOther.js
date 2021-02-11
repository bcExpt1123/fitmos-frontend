import React,{useState,useEffect} from 'react';  
import { useDispatch, useSelector } from "react-redux";
import {  NavLink } from "react-router-dom";
import { http } from "../../services/api";
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";

const RightBarOther = () => {  
  const dispatch = useDispatch();
  useEffect(()=>{
    async function fetchData(){
      const res = await http({
        path: "eventos/random"
      });
      if( res.data && res.data.events ){
        setEvents(res.data.events);
        setNews(res.data.news);
        setProducts(res.data.products);
      }
    }
    fetchData();    
  },[])
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);
  const [products, setProducts] = useState([]);
  const [show, setShow] = useState(false);
  const [media, setMedia] = useState(false);
  const onClose = ()=>{
    setShow(false);
  }
  return (  
      <>
        <div className="wrapper-rightbar event">
          <div className="label">Eventos <NavLink  className="" to={`/eventos`}>Ver Eventos</NavLink></div>
          <div className="body">
            <div className="events">
              {events.map((event)=>
                <div key={event.id} className="evento">
                  <NavLink
                    to={"/eventos/"+event.id}
                    className={""}
                  >
                    {event.images.length==0?<>
                      <img src={toAbsoluteUrl("/media/products/no-image.png")} alt="no image" />
                    </>:
                      <img src={event.images[0].url} alt={"logo"}/>
                    }
                    <div className="info" >
                      <div className="title">{event.title}</div>
                      <div className="sub-title">{event.spanish_date}&nbsp;&nbsp;&nbsp;{event.spanish_time}</div>
                    </div>  
                  </NavLink>
                </div>
              )}
            </div>            
          </div>
        </div>
        <div className="wrapper-rightbar event">
          <div className="label">Noticias <NavLink  className="" to={`/news`}>Ver Blog</NavLink></div>
          <div className="body">
            <div className="events">
              {news.map((item)=>
                <div key={item.id} className="news">
                  <NavLink
                    to={"/news/"+item.id}
                    className={""}
                  >
                    {item.image == undefined?<>
                      <img src={toAbsoluteUrl("/media/products/no-image.png")} alt="no image" />
                    </>:
                      <img src={item.image} alt={"logo"}/>
                    }
                    <div className="info" >
                      <div className="title">{item.title}</div>
                      <div className="sub-title">{item.category.name}</div>
                    </div>  
                  </NavLink>
                </div>
              )}
            </div>            
          </div>
        </div>
        <div className="wrapper-rightbar event">
          <div className="label">Shop <NavLink  className="" to={`/shop`}>Ver Tiendas</NavLink></div>
          <div className="body">
            <div className="events">
              {products.map((product)=>
                <div key={product.id} className="product">
                  <NavLink
                    to={"/shop/products/"+product.id}
                    className={""}
                  >
                    {product.media_url==undefined?<>
                      <img src={toAbsoluteUrl("/media/products/no-image.png")} alt="no image" />
                    </>:
                      <img src={product.media_url} alt={"logo"}/>
                    }
                    <div className="info" >
                      <div className="title">{product.name}</div>
                      <div className="sub-title">{product.company_name}</div>
                    </div>  
                  </NavLink>
                </div>
              )}
            </div>            
          </div>
        </div>
      </>        
    )  
}  
export default RightBarOther;