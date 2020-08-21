import React, { useState, useEffect } from "react";
import NoSleep from 'nosleep.js/dist/NoSleep';


import ForTime from '../../components/Timer/ForTime'
import AMRAP from '../../components/Timer/AMRAP'
import Tabata from '../../components/Timer/Tabata'

const noSleep = new NoSleep();

function Timer({ type, work, round, rest,setIsRunning }) {
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
          <AMRAP handleStop={handleStop} work={work} setIsRunning={setIsRunning}/>
        </>
      )}
      {selectedTimer=='for_time'&&(
        <>
          <ForTime handleStop={handleStop} work={work} setIsRunning={setIsRunning}/>
        </>
      )}
      {selectedTimer=='tabata'&&(
        <>
          <Tabata handleStop={handleStop} work={work} rounds={round} rest={rest} setIsRunning={setIsRunning}/>
        </>
      )}
    </>
  );
}
export default Timer;
