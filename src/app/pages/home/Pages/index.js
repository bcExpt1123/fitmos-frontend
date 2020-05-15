import React, {useEffect} from "react";
import MetaTags from "react-meta-tags";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import SubNav from "../components/SubNav";

const Page = ({ tags, content }) => {
  const profileLinks = [
    { name: "profile", url: "profile", label: "Perfil" },
    { name: "payments", url: "payments", label: "Métodos de Pago" },
    { name: "invoices", url: "bills", label: "Facturas" }
  ];
  useEffect(() => {
    window.scrollTo(0, 0);
  },[]);
  return (
    <>
      <MetaTags>{
        tags()
      }</MetaTags>
      <NavBar />
      <section className={"page"}>
        <div className='container mt-5 mb-5'>
          {content()}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Page;
