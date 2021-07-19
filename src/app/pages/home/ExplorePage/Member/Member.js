import React, {useState, useEffect} from "react";
import MetaTags from "react-meta-tags";
import MemberComponent from './Component';

const MemberPage = () => {
  const [scrollWidth, setScrollWidth] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(600);
  const [marginLeft, setMarginLeft] = useState('0');
  useEffect(()=>{
    window.addEventListener('resize', handleResize);
    const bodyClientWidth = document.querySelector('.member').clientWidth;
    const bodyClientHeight = document.querySelector('body').clientHeight;
    setMarginLeft( (document.getElementById('member').clientWidth - bodyClientWidth)/2 + 'px');
    document.querySelector('body').style.overflowX = 'hidden';
    if(bodyClientWidth>490){
      setScrollWidth(bodyClientWidth);
      setScrollHeight(bodyClientHeight - 284);
    }else{
      setScrollWidth(bodyClientWidth - 50);
      setScrollHeight(bodyClientHeight - 320);
    }
    return ()=>{
      window.removeEventListener('resize', handleResize);
    }
  },[]);
  const handleResize = () => {
    const member = document.getElementById('member');
    if(member){
      const bodyClientWidth = document.querySelector('.member').clientWidth;
      const bodyClientHeight = document.querySelector('body').clientHeight;
      if(bodyClientWidth>490){
        setScrollWidth(bodyClientWidth);
        setMarginLeft( (document.getElementById('member').clientWidth - bodyClientWidth)/2 + 'px');
        setScrollHeight(bodyClientHeight - 284);
      }else{
        // setScrollWidth(bodyClientWidth - 50);
        // setScrollHeight(bodyClientHeight - 320);
      }
    }
  }
  return (
    <>
      <MetaTags>
        <title>MIEMBROS - Fitemos </title>
        <meta
          name="description"
          content="MIEMBROS -Fitemos"
        />
      </MetaTags>
      <section className="member" id="member">
        <MemberComponent scrollWidth={scrollWidth} scrollHeight={scrollHeight} marginLeft={marginLeft}/>
      </section>
    </>
  );
};

export default MemberPage;