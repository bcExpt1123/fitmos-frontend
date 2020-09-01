import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";
import {DropdownButton, Dropdown} from 'react-bootstrap';

import { http } from "../services/api";

const SectionInvite = () => {
  const [referralUrl,setReferralUrl] = useState(false);
  const [text,setText] = useState(false);
  const [discount, setDiscount] = useState("");
  const currentUser = useSelector(({auth})=>auth.currentUser);
  useEffect( () => {
    async function fetchData(){
      const res = await http({
        path: "customers/referral"
      });
      if( res.data && res.data.referralUrl ){
        setDiscount(res.data.discount)
        setReferralUrl(res.data.referralUrl);
        setText(`${currentUser.customer.first_name} ${currentUser.customer.last_name} te invita a entrenar con Fitemos. Afíliate con este link: ${res.data.referralUrl} para obtener ${currentUser.customer.services[1].free_duration} de prueba sin compromiso y luego ${res.data.discount}% de descuento mensual.`);
      }
    }
    fetchData();
  },[]);// eslint-disable-line react-hooks/exhaustive-deps
  return(
    <div className="invite pt-5 pb-4">
      <h3 className="text-center">{currentUser&&currentUser.customer.first_name}, ¡Compartamos el Fitness!</h3>
      <ul className="mt-5 pt-2">
        <li>Al invitar un amigo, le enviarás {currentUser.customer.services[1].free_duration} días de prueba, sin compromiso.</li>
        <li>De tu amigo quedarse entrenando contigo, ambos tendrán {discount}% descuento en cada renovación.</li>
        <li>Tu invitado tendrá el descuento inmediatamente. Tu lo tendrás en tu próxima renovación.</li>
        <li>El descuento será renovable. Siempre y cuando tengas uno o más invitados activos.</li>
        <li>Haz click en el boton de abajo, genera tu enlace e invita a tus amigos.</li>
      </ul>
      <DropdownButton
        title="INVITAR"
        id="dropdown-invitation"
      >
        <Dropdown.Item eventKey="1">
          <FacebookShareButton
            url={referralUrl}
            quote={text}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>

          <TwitterShareButton
            url={""}
            title={text}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>

          <EmailShareButton
            subject={`Fitemos invitar`}
            url = {text}>
            <EmailIcon size={32} round />
          </EmailShareButton>

          <WhatsappShareButton
              url={""}
              title={text}
              separator=":: "        
          >
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
        </Dropdown.Item>
      </DropdownButton>
    </div>
)};

export default SectionInvite;
