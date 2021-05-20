import React from "react";

import OneColumn from "../layouts/One";
import SubNav from "../components/SubNav";

const Page = ({ actions, currentUser, section }) => {
  const profileLinks = [
    { name: "miembro", url: "/miembro", label: "Miembro" },
    { name: "benchmarks", url: "/benchmarks", label: "Benchmarks",match:'/benchmarks'  },
    { name: "events", url: "/eventos", label: "Eventos",match:'/eventos' },
    { name: "blog", url: "/news", label: "Blog",match:'/news' },
    { name: "shop", url: "/shop", label: "Shop",match:'/shop' },
  ];
  return (
    <OneColumn>
      <section className={"explore"}>
        <div className="body container mb-5 ">
          <SubNav links={profileLinks}/>

          <div className="">
            {/* TODO: can be replaced with context to reduce drilling */}
            {section({
              actions,
              currentUser
            })}
          </div>
        </div>
      </section>
    </OneColumn>
  );
};

export default Page;
