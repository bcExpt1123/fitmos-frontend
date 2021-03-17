import React from 'react';

export default function(customer){
  return (
    <div className="render-search-user" onClick={() => this.toggleUserSelect()}>
      <div className="render-search-user-info">
        <Avatar photo={customer.avatar} name={customer.first_name+' '+customer.last_name} size={40} />
        <span>{customer.first_name+' '+customer.last_name}</span>
      </div>
      {dialogType ? isSelectedUser || selectedUsers ? (
        <FontAwesomeIcon icon={faCheckCircle} color={'green'} />
      ) : (
          <FontAwesomeIcon icon={faDotCircle} color={'black'} />
        ) : <FontAwesomeIcon icon={faArrowRight} color={'green'} />
      }
    </div>
  )
}