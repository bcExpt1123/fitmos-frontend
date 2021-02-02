import React from "react";
import MetaTags from "react-meta-tags";
import { useSelector } from "react-redux";

import Private from "./components/Private";
import OneColumn from "./layouts/One";
import ThreeColumn from "./layouts/Three";
import PageHeader from "./layouts/PageHeader";
import SectionBlog from "./sections/SectionBlog";

import "./assets/scss/theme/style.scss";
import "./assets/scss/theme/mbr-additional.css";
import "./assets/scss/dropdown/style.css";
import "./assets/scss/theme/common.scss";
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
    {currentUser?(
      <ThreeColumn>
        <PageHeader title={`Blog`}/>
        <Private section={()=><SectionBlog />} />
      </ThreeColumn>
    ):(
      <OneColumn>
        <Private section={()=><SectionBlog />} />
      </OneColumn>
    )}
  </>
)};

export default PostsPage;
