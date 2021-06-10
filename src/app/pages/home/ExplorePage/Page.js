import React from "react";
import useSWR from "swr";
import OneColumn from "../layouts/One";
import SubNav from "../components/SubNav";
import { httpApi } from "../services/api";

const Page = ({ actions, currentUser, section }) => {
  const { data, error } = useSWR('eventos/home?pageSize=6&pageNumber=0', httpApi)
  const profileLinks = data?.data.data.length>0?[
    { name: "miembros", url: "/miembros", label: "Miembros" },
    { name: "benchmarks", url: "/benchmarks", label: "Benchmarks",match:'/benchmarks'  },
    { name: "events", url: "/eventos", label: "Eventos",match:'/eventos' },
    { name: "blog", url: "/news", label: "Blog",match:'/news' },
    { name: "shop", url: "/shop", label: "Shop",match:'/shop' },
  ]:[
    { name: "miembros", url: "/miembros", label: "Miembros" },
    { name: "benchmarks", url: "/benchmarks", label: "Benchmarks",match:'/benchmarks'  },
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
