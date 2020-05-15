import React from "react";
import MetaTags from "react-meta-tags";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Private from "./components/Private";

import SectionBlog from "./SectionBlog";

import "./assets/scss/theme/style.scss";
import "./assets/scss/theme/mbr-additional.css";
import "./assets/scss/dropdown/style.css";
import "./assets/scss/theme/common.scss";
const PostsPage = () => (
  <>
    <MetaTags>
      <title>Blog -Fitemos </title>
      <meta
        name="description"
        content="Blog -Fitemos"
      />
    </MetaTags>
    <NavBar />

    <Private section={()=><SectionBlog />} />

    <Footer />
  </>
);

export default PostsPage;
