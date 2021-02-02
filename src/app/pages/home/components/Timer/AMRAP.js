// --- Dependencies
import React from 'react';

// --- Components
import TimerWrapper from './Wrapper';
import Button from './Button';
import Base from './Base';

// --- Utils
import createAMRAP from '../../sections/Workout/lib/createAMRAP';
import {formatMinSec} from '../../sections/Workout/lib/timer';
import { pluralize } from '../../sections/Workout/lib/pluralize';

/**
 * Component
 */

class AMRAP extends Base {
  constructor() {
    super()
    this.state = { minutes: 2 }
  }

  getItemPrefix() {
    return 'AMRAP'
  }
  renderDone() {
    const { minutes } = this.state
    this.props.setIsRunning(false);
    return `${this.padClock(minutes)} ${pluralize(
      minutes,
      'minuto',
      'minutos'
    )} completados`
  }

  handleStart() {
    const cb = this.cb.bind(this)
    const cbDelay = this.cbDelay.bind(this)
    const cbDone = this.cbDone.bind(this)

    const { minutes } = this.state

    this.setItem('minutes', minutes)
    this.props.setIsRunning(true);
    this.setState({
      intervalId: createAMRAP({ minutes, cb, cbDelay, cbDone })
    })
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
                <span className="tr">Completar &nbsp;</span>
                <span className="mh4">la mayor</span>
                <span className="tl"> cantidad </span>
                <span className="tr"> de</span>
              </div>
              <div className="timer--settingField mb3">
                <span className="tr">rondas&nbsp;</span>
                <span className="mh4">
                  y
                </span>
                <span className="tl"> repeticiones</span>
                <span className="tr"> En:</span>
              </div>
              <div className="timer--settingField mb3">
                <span className="tr">Tiempo Total:&nbsp;</span>
                <span className="mh4">
                  {formatMinSec(this.state.minutes*60)}
                </span>
                <span className="tl">&nbsp;minutos.</span>
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
  renderRestart() {
    if (!this.isDone()) return

    return <Button onClick={this.handleStart} className="timer--button-start1 mt3">Iniciar</Button>
  }

  renderTime() {
    return this.isDelay() ? 11 - this.state.count : this.isRunning() && this.state.minSecDesc
  }

  render() {
    return (
      <TimerWrapper
        name="AMRAP"
        goBackFn={this.handleStop}
        handleRestart={this.handleReset}
        isRunning={this.isRunning()}
        isDelay = {this.isDelay()}
        isDone={this.isDone()}
        setIsRunning={this.props.setIsRunning}
        subheader={this.isDone() && this.renderDone()}
        time={this.renderTime()}
      >
        {this.renderStart()}
        {this.renderRestart()}
      </TimerWrapper>
    )
  }
}

export default AMRAP