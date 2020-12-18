// --- Dependencies
import React from 'react';

// --- Components
import TimerWrapper from './Wrapper';
import Button from './Button';
import ForTime from './ForTime';


/**
 * Component
 */


class Calentamiento extends ForTime {
  constructor() {
    super()
    this.state = { minutes: 2 }
  }

  getItemPrefix() {
    return 'Calentamiento'
  }
  
  renderStart() {
    if (!this.isReady()) return

    return (
      <>
      <div className="amrap-timer-start-height">&nbsp;</div>
        <div className="w-100">
          {(!this.props.description || this.props.description==='')?
            <>
              <div className="timer--settingField mb3">
                <span className="tr">Iniciar Calentamiento.</span>
              </div>
            </>
            :
            <div style={{whiteSpace: "pre-wrap"}}>
              {this.props.description}
            </div>
          }
        </div>
        <div className="amrap-timer-start-height">&nbsp;</div>
          <Button
            onClick={this.handleStart}
            autoFocus
            className="timer--button-start1 mt3"
          >
            Iniciar
          </Button>
      </>
    )
  }

  render() {
    return (
      <TimerWrapper
        name="Calentamiento"
        goBackFn={this.handleStop}
        handleRestart={this.handleReset}
        isRunning={this.isRunning()}
        isDone={this.isDone()}
        isDelay = {this.isDelay()}
        setIsRunning={this.props.setIsRunning}
        subheader={this.renderDone()}
        time={this.renderTime()}
      >
        {this.renderStart()}
        {this.renderRestart()}
      </TimerWrapper>
    )
  }
}

export default Calentamiento



