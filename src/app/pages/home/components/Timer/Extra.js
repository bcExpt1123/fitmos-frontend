// --- Dependencies
import React from 'react';

// --- Components
import TimerWrapper from './Wrapper';
import Button from './Button';
import ForTime from './ForTime';

/**
 * Component
 */


class Extra extends ForTime {
  constructor() {
    super()
    this.state = { minutes: 2 }
  }

  getItemPrefix() {
    return 'ExtraWorkout'
  }
  renderStart() {
    if (!this.isReady()) return

    return (
      <>
      <div className="amrap-timer-start-height">&nbsp;</div>
        <div className="w-100">
          <div className="timer--settingField mb3">
            <span className="tr">Iniciar Extra Workout.</span>
          </div>
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
        name="Extra Workout"
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

export default Extra;