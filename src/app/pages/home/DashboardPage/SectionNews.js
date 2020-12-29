import React,{useEffect,useState} from "react";
import { Card } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { http } from "../services/api";

const SectionNews = () => {
  const [posts,setPosts] = useState(false);
  useEffect( () => {
    async function fetchBlog(){
      const res = await http({
        method: "GET",
        path: "events/recent",
      });
      setPosts(res.data);
    }
    fetchBlog();
  },[]);
  return (
    <Card className="news">
      <Card.Header>
        <Card.Title>Artículos recientes</Card.Title>
      </Card.Header>
      <Card.Body>
        {posts?(
          posts.map( post =>
            <div key={post.id} className='mb-2'>
              <NavLink
                className="post-title"
                aria-label="Post"
                title={`Read ${post.title}`}
                to={`/news/${post.id}`}
              >
                <h3 style={{display:'inline-block'}}>{post.title}</h3>
              </NavLink> 
              <div style={{float:'right'}}>{post.created_date}</div>
              <div>
                {post.excerpt}
              </div>
              <NavLink
                className="read-more"
                aria-label="Post"
                title={`Read ${post.title}`}
                to={`/news/${post.id}`}
              >
                Leer Más
              </NavLink> 
            </div>
            )
        ):(
          <>No hay noticias</>
        )}
      </Card.Body>
    </Card>
  );
};

export default SectionNews;
