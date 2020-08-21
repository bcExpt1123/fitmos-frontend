import React from 'react'

// --- Components
import Base from './Base'
import TimerWrapper from './Wrapper'
import Button from './Button'
import Label from './Label'

// --- Utils
import createTabata from '../../sections/Workout/lib/createTabata';
import {formatMinSec} from '../../sections/Workout/lib/timer';
import { pluralize } from '../../sections/Workout/lib/pluralize';

/**
 * Component
 */

class Tabata extends Base {
  constructor() {
    super()
    this.state = {
      rounds: this.getItem('rounds', 8),
      work: this.getItem('work', 20),
      rest: this.getItem('rest', 10)
    }
  }

  getItemPrefix() {
    return 'Tabata'
  }

  renderDone() {
    if (!this.isDone()) return

    const { rounds } = this.state
    this.props.setIsRunning(false);
    return `${rounds} ${pluralize(rounds, 'round', 'rounds')} completados`
  }

  renderHeader() {
    if (!this.isRunning()) return

    return `Tabata - Round ${this.state.round} of ${this.state.rounds}`
  }

  renderRestart() {
    if (!this.isDone()) return

    return (
      <>
        <div className="tabata-restart-height"></div>
        <Button onClick={this.handleStart} className="timer--button-start1 mt3 mt5-ns">
          Iniciar
        </Button>
      </>
    )
  }

  handleStart() {
    const cb = this.cb.bind(this)
    const cbDelay = this.cbDelay.bind(this)
    const cbDone = this.cbDone.bind(this)

    const { rounds, work, rest } = this.state

    this.setItem('rounds', rounds)
    this.setItem('work', work)
    this.setItem('rest', rest)
    this.props.setIsRunning(true);
    this.setState({
      intervalId: createTabata({ rounds, work, rest, cb, cbDelay, cbDone })
    })
  }

  renderStart() {
    if (!this.isReady()) return

    return (
      <>
        <div className="tabata-timer-start-height">&nbsp;</div>
        <div className="w-100">
          <div className="timer--settingField mb3">
              <span className="tr">{this.state.rounds}&nbsp;</span>
              <span className="mh4">
                rondas de
              </span>
              <span className="tl">&nbsp;{this.state.work}&nbsp;</span>
              <span className="tr">&nbsp;de actividad &nbsp;</span>
              {this.state.rest>0&&(
                <span>y {this.state.rest} de descanso.</span>
              )}
          </div>
          <div className="timer--settingField mb3">
              <span className="tr">&nbsp;Tiempo Total:&nbsp;</span>
              <span className="mh4">
                {formatMinSec(parseInt(this.state.rounds) * (parseInt(this.state.work) + parseInt(this.state.rest)))}
              </span>
              <span className="tl">&nbsp;minutos</span>
          </div>

        </div>
        <div className="tabata-timer-start-height">&nbsp;</div>
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
  appendTopHeader(){
    return <div className="tabata-restart-height" />
  }
  render() {
    return (
      <TimerWrapper
        name="Tabata"
        round={this.state.round}
        goBackFn={this.handleStop}
        isRunning={this.isRunning()}
        isDone={this.isDone()}
        setIsRunning={this.props.setIsRunning}
        appendTopHeader={this.appendTopHeader()}
        handleRestart={this.handleStart}
        time={
          this.isDelay()
            ? 11 - this.state.count
            : this.isRunning() && this.state.minSecDesc
        }
        header={this.renderHeader()}
        subheader={<span>{this.renderDone()}</span>}
      >
        {this.renderStart()}
        {this.renderRestart()}
      </TimerWrapper>
    )
  }
}

export default Tabata



// WEBPACK FOOTER //
// ./app/javascript/components/timers/Tabata.jsx