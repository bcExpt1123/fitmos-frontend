import React from "react";
import PropTypes from "prop-types";

const styles = {
  column: "column",
  row: "row"
};
const RadioButton = ({ id, name, checked, children, onSelect, variant }) => (
  <div className={"radio-button"}>
    <input
      type="radio"
      id={id}
      name={name}
      defaultChecked={checked}
      onClick={onSelect}
    />
    <label htmlFor={id} className={styles[variant]}>
      {children}
    </label>
  </div>
);

RadioButton.defaultProps = {
  checked: false,
  variant: "row"
};

RadioButton.propTypes = {
  checked: PropTypes.bool,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(["column", "row"])
};

export default RadioButton;
