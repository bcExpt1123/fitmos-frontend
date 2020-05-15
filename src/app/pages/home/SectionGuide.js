import React,{useState, useEffect} from "react";
import { toAbsoluteUrl } from "../../../_metronic/utils/utils";
const iphones = [
  toAbsoluteUrl("./media/phone/iphone1.png"),
  toAbsoluteUrl("./media/phone/iphone2.png"),
  toAbsoluteUrl("./media/phone/iphone3.png")
]
export default function SectionGuide() {
  const [background,setBackground] = useState('background iphone2');
  let i = 1;
  useEffect(()=>{
    const timer = window.setInterval(() => {
      i++;
      if(i>3)i=2;
      setBackground('background iphone'+i);
    }, 5000);
    return () => { // Return callback to run on unmount.
      window.clearInterval(timer);
    };
  },[i]);
  return (
    <section className="section-guide" id="section-guide">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="bottom-line"></div>
            <h2 className="mbr-title mbr-fonts-style display-2">
              <span className="top-line">¿Por qu</span>é Fitemos?
            </h2>
            <ul className="mbr-section-text">
              <li>Entrenamientos personalizados</li>
              <li>Guías nutricionales</li>
              <li>Tutorial de cada movimiento</li>
              <li>Acceso a entrenadores</li>
              <li>Rutinas nuevas todos los días</li>
              <li>Planificado por expertos</li>
            </ul>
          </div>
          <div className="col-12 col-md-6"></div>
        </div>
      </div>
      <div className="background-container">
        <div className={background}></div>
      </div>
    </section>
  );
}
