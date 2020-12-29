import React from "react";
import { useSelector } from "react-redux";
import { Markup } from "interweave";

export default function Post({id}) {
  const post = useSelector(({ event }) => event.item);
  return (
    <section className="post" id="post">
      <div className="container mt-5 mb-5">
        <div className="row">
          {post&&(
            <>
              <h1 className="category mb-5">{post.category.name}</h1>
              <img src={post.image} alt={post.id}/>
              <h2 className="title mt-4 col-xl-12">{post.title}</h2>
              <div className="published-date mt-2 mb-4 col-xl-12">FITEMOS {post.created_date}</div>
              <div className="content col-xl-12">
                <Markup content={post.description} />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
