import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Base extends Component {
  constructor() {
    super()
    this.handleESC = this.handleESC.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleStop = this.handleStop.bind(this)
    this.handleStart = this.handleStart.bind(this)
    this.handleReset = this.handleReset.bind(this)
    this.handleBeeps = this.handleBeeps.bind(this)
  }

  padClock(num) {
    return String(`00${num}`).slice(-2)
  }

  getItemKey(key) {
    return `Timer-${this.getItemPrefix()}-${key}`
  }

  getItemPrefix() {
    throw 'Not implement'
  }

  setItem(key, value) {
    return localStorage.setItem(this.getItemKey(key), value, { expires: 365 })
  }

  getItem(key, defaultValue) {
    return localStorage.getItem(this.getItemKey(key)) || defaultValue
  }

  cb(result) {
    this.setState({ running: true, delay: false, done: false, ...result })
  }

  cbDelay(result) {
    this.setState({ running: false, delay: true, done: false, ...result })
  }

  cbDone(result) {
    this.setState({ running: false, delay: false, done: true, ...result })
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleStop() {
    if (this.state.intervalId) {
      //this.props.setIsRunning(false);
      window.clearInterval(this.state.intervalId)
    }

    // clear previous timer if any
    window.timerIntervalId && window.clearInterval(window.timerIntervalId)

    this.props.handleStop()
  }

  isDone() {
    return this.state.done
  }

  isRunning() {
    return this.state.running
  }

  isDelay() {
    return this.state.delay
  }

  isReady() {
    return !this.isDone() && !this.isRunning() && !this.isDelay()
  }

  handleReset() {
    //this.props.setIsRunning(false);
    this.setState({ delay: false, done: false, running: false })
  }

  handleESC(e) {
    if (e.key === 'Escape') {
      this.handleStop()
    }
  }

  handleBeeps(e) {
    if (this.isDone()) return

    const shortBeep = document.getElementById('timer-short-beep')
    const longBeep = document.getElementById('timer-long-beep')

    if (e.detail.isLong) {
      longBeep.play()
    } else {
      shortBeep.play()
      setTimeout(() => {
        shortBeep.pause()
        shortBeep.currentTime = 0
      }, 500)
    }
  }

  componentDidMount() {
    this.handleReset()
    if(this.props.work){
      this.setState({minutes:this.props.work});
      this.setState({work:this.props.work});
    }
    if(this.props.rounds)this.setState({rounds:this.props.rounds,rest:this.props.rest});
    document.addEventListener('keydown', this.handleESC, false)
    document.addEventListener('playBeep', this.handleBeeps, false)
  }
  componentWillUnmount() {
    if (this.state.intervalId) {
      window.clearInterval(this.state.intervalId)
    }

    document.removeEventListener('keydown', this.handleESC, false)
    document.removeEventListener('playBeep', this.handleBeeps, false)
  }
}

Base.propTypes = {
  handleStop: PropTypes.func.isRequired,
}

export default Base