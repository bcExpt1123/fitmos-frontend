import React from "react";
import MetaTags from "react-meta-tags";
import { useSelector } from "react-redux";

import Private from "../../components/Private";
import SectionBlog from "../../sections/SectionBlog";

const PostsPage = () => {
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  return (
  <>
    <MetaTags>
      <title>Blog -Fitemos </title>
      <meta
        name="description"
        content="Blog -Fitemos"
      />
    </MetaTags>
    <Private section={()=><SectionBlog />} />
  </>
)};

export default PostsPage;
