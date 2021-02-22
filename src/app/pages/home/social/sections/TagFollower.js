import React, { useState } from "react";
import Chip from '@material-ui/core/Chip';
import Avatar from "../../components/Avatar";

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
        <input className="search" name="search" placeholder="Search for friends" autocomplete="off" value={searchName} onChange={handleSearchName}/>
        <button className="btn btn-primary" onClick={onClose}>Done</button>
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
            <label>Search</label>
            {searchCustomers.length>0?
              <ul>
                {searchCustomers.map((customer)=>
                  <li key={customer.id} className="cursor-pointer" onClick={handleClickSearchCustomers(customer)}>
                    <div className="avatar">
                      <Avatar
                        pictureUrls={customer.avatarUrls}
                        size="xs"
                        className={"userAvatar"}
                      />
                    </div>
                    <div className="info">
                      <div className="full-name">{customer.first_name} {customer.last_name}</div>
                      <div className="username">{customer.username}</div>
                    </div>
                  </li>
                )}
              </ul>
              :<div>
                No people found
              </div>
            }
          </div>
        }
      </div>
    </div>
  );
}

export default TagFollowers;