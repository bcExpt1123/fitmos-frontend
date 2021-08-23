import React,{useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import MetaTags from "react-meta-tags";
import { $frontPage, $fetchFrontIndex } from "../../../../../modules/subscription/evento";
import { useInfiniteScroll } from "../../../../../lib/useInfiniteScroll";

const EventsPage = () => {
  const dispatch = useDispatch();
  const event = useSelector(({ evento }) => evento);
  const events = event.frontData;
  const meta = event.frontMeta;
  useEffect(() => {
    setIsFetching(false);
  }, [event.frontMeta]);// eslint-disable-line react-hooks/exhaustive-deps
  useEffect(()=>{
    dispatch($fetchFrontIndex());
  },[]);
  const fetchMoreListItems = ()=>{
    dispatch($frontPage());
  }
  const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems);
  return (
    <>
      <MetaTags>
        <title>Eventos -Fitemos </title>
        <meta
          name="description"
          content="Eventos -Fitemos"
        />
      </MetaTags>
      <section className="evento" id="evento">
        {/* <h4 style={{color:'rgba(51, 51, 51, 0.5)'}}>Todas las semanas publicamos comercios nuevos</h4> */}
        <div className="row">
          {events&&events.length>0?events.map((event)=>
            <article className="col-12 col-md-3"  key={event.id}>
              <div className="content">
                <NavLink
                  aria-label="event"
                  title={`Read ${event.title}`}
                  to={`/eventos/${event.id}`}
                >
                  <div className="image">
                    <div className="background-container">
                      <div className="background" 
                        style={{
                          backgroundImage: event.images[0]?"url(" + event.images[0].url + ")":""
                        }}
                      >
                      </div>
                    </div>
                  </div>
                  <div className="body">
                    <div className="name">
                      {event.title}
                    </div>
                    <div className="datetime">
                      {event.spanish_date}&nbsp;&nbsp;&nbsp;{event.spanish_time}
                    </div>
                  </div>
                </NavLink> 
              </div>
            </article>
          ):(
            <article className="col-12 col-md-12"><div className="content p-4"><div>No hay eventos programados</div></div></article>
          )}
          {meta&&meta.page<meta.pageTotal&&isFetching && 'Obteniendo más elementos de la lista...'}
        </div>
      </section>
    </>
  );
};

export default EventsPage;