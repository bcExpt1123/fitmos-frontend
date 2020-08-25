import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { FormattedMessage } from "react-intl";
import { dismissAlert } from "../../redux/alert/actions";

const styles = { success: "success", error: "error" };

export const mapStateToProps = state => ({
  currentMessage: state.alert.currentMessage,
  queue: state.alert.queue
});
export const mapDispatchToProps = { dismiss: dismissAlert };

const Alert = ({ currentMessage, dismiss, queue }) => {
  if (!currentMessage) {
    return null;
  }

  const { message, type } = currentMessage;

  const classes = classnames({
    alert: true,
    [styles[type]]: type
  });

  return (
    <div className={classes} data-cy="alert">
      {message.id ? <FormattedMessage {...message} /> : message}
      {queue.length > 1 && (
        <button type="button" className={"count"} onClick={dismiss}>
          {queue.length}
        </button>
      )}
      <button
        type="button"
        className={"dismiss"}
        onClick={dismiss}
        data-cy="alert dismiss"
      >
        &times;
      </button>
    </div>
  );
};

const messageType = PropTypes.shape({
  type: PropTypes.string.isRequired,
  message: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  ])
});

Alert.defaultProps = {
  currentMessage: null
};

Alert.propTypes = {
  currentMessage: messageType,
  dismiss: PropTypes.func.isRequired,
  queue: PropTypes.arrayOf(messageType).isRequired
};

export default Alert;
