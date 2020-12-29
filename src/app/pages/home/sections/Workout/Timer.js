import React, { useState, useEffect } from "react";


import ForTime from '../../components/Timer/ForTime';
import AMRAP from '../../components/Timer/AMRAP';
import Tabata from '../../components/Timer/Tabata';
import Calentamiento from '../../components/Timer/Calentamiento';
import Extra from '../../components/Timer/Extra';


function Timer({ type, work, round, rest,description,setIsRunning }) {
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
      setIsRunning(false);
      window.timerIntervalId && window.clearInterval(window.timerIntervalId);
    }
  },[type]);// eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      {selectedTimer==='amrap'&&(
        <>
          <AMRAP handleStop={handleStop} work={work} description={description} setIsRunning={setIsRunning}/>
        </>
      )}
      {selectedTimer==='for_time'&&(
        <>
          <ForTime handleStop={handleStop} work={work} description={description} setIsRunning={setIsRunning}/>
        </>
      )}
      {selectedTimer==='tabata'&&(
        <>
          <Tabata handleStop={handleStop} work={work} rounds={round} rest={rest} description={description} setIsRunning={setIsRunning}/>
        </>
      )}
      {selectedTimer==='calentamiento'&&(
        <>
          <Calentamiento handleStop={handleStop} work={work} description={description} setIsRunning={setIsRunning}/>
        </>
      )}
      {selectedTimer==='extra'&&(
        <>
          <Extra handleStop={handleStop} work={work} description={description} setIsRunning={setIsRunning}/>
        </>
      )}
    </>
  );
}
export default Timer;
