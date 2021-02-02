import React from "react";
import { useSelector } from "react-redux";
import { reactLocalStorage } from 'reactjs-localstorage';

const ProofButton = () => {
  const serviceItem = useSelector(({service})=>service.item);
  const publicCouponId = reactLocalStorage.get('publicCouponId');
  const publicCoupon = reactLocalStorage.get('publicCoupon');
  return (
    (publicCouponId || publicCoupon)?<>
      Obtener Oferta
    </>:<>
      PRUEBA {serviceItem && serviceItem.free_duration} DÍAS
    </>
  );
};

export default ProofButton;
