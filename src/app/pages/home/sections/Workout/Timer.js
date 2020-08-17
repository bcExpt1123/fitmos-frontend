import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import NoSleep from 'nosleep.js/dist/NoSleep';


import { http } from "../../services/api";
import { updateCustomerAttribute as updateWeightsAction } from "../../redux/auth/actions";
import ForTime from '../../components/Timer/ForTime'
import AMRAP from '../../components/Timer/AMRAP'
import Tabata from '../../components/Timer/Tabata'

const noSleep = new NoSleep();

function Timer({ type, work, round, rest }) {
  const [selectedTimer, setSelectedTimer] = useState(null);
  const handleStop = ()=>{
    //noSleep.disable();
    setSelectedTimer(null);
  }
  useEffect(()=>{
    if(type){
      setSelectedTimer(type);
      //noSleep.enable();
    }
    return ()=>{
      window.timerIntervalId && window.clearInterval(window.timerIntervalId);
    }
  },[]);
  return (
    <>
      {selectedTimer=='amrap'&&(
        <>
          <AMRAP handleStop={handleStop} work={work}/>
        </>
      )}
      {selectedTimer=='for_time'&&(
        <>
          <ForTime handleStop={handleStop} work={work}/>
        </>
      )}
      {selectedTimer=='tabata'&&(
        <>
          <Tabata handleStop={handleStop} work={work} rounds={round} rest={rest}/>
        </>
      )}
    </>
  );
}
export default Timer;
