import React, {useEffect} from "react";
import { useSelector } from "react-redux";
import MetaTags from "react-meta-tags";
import OneColumn from "../layouts/One";
import TwoColumn from "../layouts/Two";
const Page = ({ tags, content }) => {
  /*const profileLinks = [
    { name: "profile", url: "profile", label: "Perfil" },
    { name: "payments", url: "payments", label: "Métodos de Pago" },
    { name: "invoices", url: "bills", label: "Facturas" }
  ];*/
  useEffect(() => {
    window.scrollTo(0, 0);
  },[]);
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  return (
    <>
      <MetaTags>{
        tags()
      }</MetaTags>
      {
        currentUser?(
          <TwoColumn>
            <section className={"page"}>
              <div className='container mt-5 mb-5'>
                {content()}
              </div>
            </section>
          </TwoColumn>
        ):(
          <OneColumn>
            <section className={"page"}>
              <div className='container mt-5 mb-5'>
                {content()}
              </div>
            </section>
          </OneColumn>
        )
      }
    </>
  );
};

export default Page;
