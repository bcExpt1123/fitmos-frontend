import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import MemberComponent from './Component';

const ModalComponent = () => {
  const [scrollWidth, setScrollWidth] = useState(0);
  const scrollHeight = 600;
  const [marginLeft, setMarginLeft] = useState('0');
  useEffect(()=>{
    window.addEventListener('resize', handleResize);
    const bodyClientWidth = document.querySelector('.member').clientWidth;
    // const bodyClientHeight = document.querySelector('body').clientHeight;
    setScrollWidth(bodyClientWidth);
    // setMarginLeft( (document.getElementById('member').clientWidth - bodyClientWidth)/2 + 'px');
    document.querySelector('body').style.overflowX = 'hidden';
    return ()=>{
      window.removeEventListener('resize', handleResize);
    }
  },[]);
  const handleResize = () => {
    const member = document.getElementById('member');
    if(member){
      const bodyClientWidth = document.querySelector('.member').clientWidth;
      // const bodyClientHeight = document.querySelector('body').clientHeight;
      setScrollWidth(bodyClientWidth);
      // setMarginLeft( (document.getElementById('member').clientWidth - bodyClientWidth)/2 + 'px');
    }
  }
  const currentUser = useSelector(({auth})=>auth.currentUser);
  return (
    <section className="member" id="member">
      <h2 className="mb-4">¡{currentUser.customer.first_name} agrega a tus primeros partners!</h2>
      <h4 className="mb-4">Te recomendamos agregar a la mayor cantidad de partners. En Fitemos todos somos un gran equipo.</h4>
      <MemberComponent scrollWidth={scrollWidth} scrollHeight={scrollHeight} marginLeft={marginLeft}/>
    </section>
  );
};

export default ModalComponent;