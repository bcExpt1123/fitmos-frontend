import React, {useState, useEffect} from "react";
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
  return (
    <section className="member" id="member">
      <MemberComponent scrollWidth={scrollWidth} scrollHeight={scrollHeight} marginLeft={marginLeft}/>
    </section>
  );
};

export default ModalComponent;