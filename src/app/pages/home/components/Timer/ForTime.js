// --- Dependencies
import React from 'react';

// --- Components
import TimerWrapper from './Wrapper';
import Button from './Button';
import Base from './Base';

// --- Utils
import createForTime from '../../sections/Workout/lib/createForTime';
import {formatMinSec} from '../../sections/Workout/lib/timer';
import { pluralize } from '../../sections/Workout/lib/pluralize';

/**
 * Component
 */


class ForTime extends Base {
  constructor() {
    super()
    this.state = { minutes: 2 }
  }

  getItemPrefix() {
    return 'ForTime'
  }
  renderDone() {
    if (!this.isDone()) return
    this.props.setIsRunning(false);
    const { minutes } = this.state

    return `${minutes} ${pluralize(minutes, 'minuto', 'minutos')} completados`
  }

  handleStart() {
    const cb = this.cb.bind(this)
    const cbDelay = this.cbDelay.bind(this)
    const cbDone = this.cbDone.bind(this)

    const { minutes } = this.state

    this.setItem('minutes', minutes)
    this.props.setIsRunning(true);
    this.setState({
      intervalId: createForTime({ minutes: minutes, cb, cbDelay, cbDone })
    })
  }

  handleChange(event) {
    this.setState({
      minutes: event.target.value
    })
  }

  renderRestart() {
    if (!this.isDone()) return

    return <Button onClick={this.handleStart} className="timer--button-start1 mt3">Iniciar</Button>
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
              <span className="tr">Completar en  
                el menor tiempo posible.</span>
            </div>
            <div className="timer--settingField mb3">
              <span className="tr">Tiempo Límite:&nbsp;</span>
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

  renderTime() {
    if (this.isDone()) {
      // show total time
      return this.state.minSecDesc
    }

    return this.isDelay() ? 11 - this.state.count : this.isRunning() && this.state.minSecAsc
  }

  render() {
    return (
      <TimerWrapper
        name="For Time"
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

export default ForTime



// WEBPACK FOOTER //
// ./app/javascript/components/timers/ForTime.jsx