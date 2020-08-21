import React,{useState} from 'react'

import Button from './Button'
import Modal from "react-bootstrap/Modal";


// --- Audio
import ShortBeep from './audio/short-beep-1s.mp3';
import LongBeep from './audio/long-beep-1s.mp3';
/**
 * Helpers
 */



/**
 * Component
 */

const TimerWrapper = ({
  children,
  time,
  appendTopHeader,
  subheader,
  round,
  isRunning,
  setIsRunning,
  isDone,
  handleRestart,
}) => {
  const [pause, setPause] = useState(false);
  const [showRestartDialog,setShowRestartDialog] = useState(false);
  const pauseTimer = e => {
    // for disabling selection in mobile
    e.preventDefault();
    window.timerPaused = !!!window.timerPaused;
    setPause(window.timerPaused);
    setIsRunning(!window.timerPaused);
  }
  const restartTimer = e => {
    // for disabling selection in mobile
    e.preventDefault();
    setIsRunning(true);
    setShowRestartDialog(true);    
  }
  const handleCloseRestartDialog = ()=>{
    setShowRestartDialog(false);
  }
  const handleRestartTimer = ()=>{
    setPause(false);
    setShowRestartDialog(false);
    window.timerIntervalId && clearInterval(window.timerIntervalId);
    handleRestart();
  }
  return (
    <div
      id="timer-clock"
      className="bg-black tc relative flex w-100 flex-column"
    >
      <div className="ph4 flex-auto flex flex-column items-center w-auto tc relative center justify-center">
        {isDone&&appendTopHeader}
        {subheader && (
          <h3 className="timer--subheader mv0 tl ttu iosevka w-100">
            {subheader}
          </h3>
        )}
        {time && (
          <>
            <time
              dateTime={time}
              className="timer--clock iosevka fw6 w-100 pointer"
              onClick={pauseTimer}
            >
              {isRunning && <span className="red">{round}</span>} {time}
            </time>
          </>
        )}
        {children}
      </div>
      { time && !isDone && (
        <div className="buttons">
          {pause?
          <>
            <Button
              className="timer--button-start1 mt3"
              onClick={pauseTimer}
            >
              Iniciar
            </Button>
            <Button
              className="timer--button-restart1 mt3"
              onClick={restartTimer}
            >
              Reiniciar
            </Button>
          </>
          :
          <Button
            className="timer--button-pause1 mt3"
            onClick={pauseTimer}
          >
            Pausar
          </Button>
          }
        </div>
      )}

      <audio id="timer-short-beep" src={ShortBeep} type="audio/mp3" />
      <audio id="timer-long-beep" src={LongBeep} type="audio/mp3" />
      <Modal
        dialogClassName="restart-modal"
        show={showRestartDialog}
        onHide={handleCloseRestartDialog}
        animation={false}
        centered
      >
        <Modal.Body>
          <div className="title">¿Estás seguro que deseas reiniciar?</div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="restart-no" onClick={handleCloseRestartDialog}>
            No 
          </Button>
          <Button className="restart-yes" onClick={handleRestartTimer}>
            Si
          </Button>
        </Modal.Footer>          
      </Modal>
    </div>
  )
}

export default TimerWrapper
