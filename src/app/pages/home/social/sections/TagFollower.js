import React, { useState } from "react";
import { Chip } from '@material-ui/core';
import CustomerInfo from "../../profile/components/CustomerInfo";

const TagFollowers = ({searchableCustomers, setSearchableCustomers, tagFollowers, setTagFollowers, onClose}) => {
  /** tag */
  const [searchCustomers, setSearchCustomers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const handleDeleteTag = (deleteItem) =>()=>{
    setTagFollowers((customers) => customers.filter((customer) => customer.id !== deleteItem.id));
    let customers = [...searchableCustomers];
    customers.push(deleteItem)
    setSearchableCustomers(customers);
    customers = [...searchCustomers];
    customers.push(deleteItem)
    setSearchCustomers(customers);
  }
  const handleSearchName = (evt)=>{
    setSearchName(evt.target.value);
    if(evt.target.value.length>0){
      setSearchCustomers(searchableCustomers.filter((customer)=>customer.display.toLowerCase().includes(evt.target.value.toLowerCase())));
    }else{
      setSearchCustomers([]);
    }
  }
  const handleClickSearchCustomers = (clickedCustomer)=>()=>{
    let customers = [...tagFollowers];
    customers.push(clickedCustomer);
    setTagFollowers(customers);
    customers = [...searchableCustomers];
    setSearchableCustomers(customers.filter((customer) => customer.id !== clickedCustomer.id));
    customers = [...searchCustomers];
    setSearchCustomers(customers.filter((customer) => customer.id !== clickedCustomer.id));
  } 
  return (
    <div className="tag-followers">
      <div>
        <input className="search" name="search" placeholder="Buscar amigos" autoComplete="off" value={searchName} onChange={handleSearchName}/>
        <button className="btn btn-primary" onClick={onClose}>Aceptar</button>
      </div>
      <div className="tag-content">
        {tagFollowers.length>0&&            
          <div>
            <label>Tagged</label>
            <div className="tagged">
              {tagFollowers.map((customer)=>
                <span key={customer.id}>
                  <Chip label={customer.display?customer.display:customer.first_name+' '+customer.last_name} onDelete={handleDeleteTag(customer)} color="primary" variant="outlined" />
                </span>
              )}
            </div>
          </div>
        }
        {searchName&&
          <div>
            <label>Buscar</label>
            {searchCustomers.length>0?
              <ul>
                {searchCustomers.map((customer)=>
                  <li key={customer.id} className="cursor-pointer" onClick={handleClickSearchCustomers(customer)}>
                    <CustomerInfo customer={customer} />
                  </li>
                )}
              </ul>
              :<div>
                Sin resultados
              </div>
            }
          </div>
        }
      </div>
    </div>
  );
}

export default TagFollowers;