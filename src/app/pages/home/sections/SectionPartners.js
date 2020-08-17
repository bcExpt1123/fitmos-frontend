import React, { useState, useEffect } from "react";

import { http } from "../services/api";

const SectionPartners = () => {
  const [partners,setPartners] = useState([]);
  useEffect( () => {
    async function fetchData(){
      const res = await http({
        path: "customers/partners"
      });
      if( res.data && res.data.partners ){
        setPartners(res.data.partners);
      }
    }
    fetchData();
  },[]);
  return(
    <div className="partners">
      <h3 className="text-center">Training Partners</h3>
      <div className="row mt-5">
        {partners.length==0?(
          <div className="col-12 text-center">No hay socios.</div>
        ):(
          partners.map(partner => (
            <div key={partner.id} className="col-md-4 col-12 profile">
              <div className="avatar xd">
                <img src={partner.avatarUrls.small} />
              </div>
              <div className="info">
                <h4 className="name">{partner.first_name} {partner.last_name}</h4>
                {partner.country}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
    )};

export default SectionPartners;
