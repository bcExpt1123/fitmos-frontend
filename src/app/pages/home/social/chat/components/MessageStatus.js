import React from 'react';

import {
  STATUS_DELIVERED,
  STATUS_PENDING,
  STATUS_READ,
  STATUS_SENT
} from '../../../redux/messages/actions';

export default function MessageSendState({ send_state }) {
  switch (send_state) {
    case STATUS_PENDING:
      return (<i className="far fa-clock" color='grehy'/>)
    case STATUS_SENT:
      return (<i className="far fa-check" color='grehy'/>)
    case STATUS_DELIVERED:
      return (<i className="far fa-check-double" color='grehy'/>)
    case STATUS_READ:
      return (<i className="far fa-check-double" color='#27ae60'/>)

    default: return (<i className="far fa-clock" color='white'/>)
  }
}
