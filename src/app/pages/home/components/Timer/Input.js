import React from 'react'

/**
 * Component
 */

const Input = ({ ...inputProps }) => (
  <input
    className="w4 w5-ns timer--input bg-transparent ph4 pv3 white ttu iosevka ba b--white bw2"
    {...inputProps}
  />
)

export default Input