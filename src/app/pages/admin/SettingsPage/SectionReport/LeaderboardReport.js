import React, { useEffect, useState } from "react";
import { http, fileDownload } from "../../../home/services/api";
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";

const convertString = (today)=>{
  let month = today.getMonth()+1;
  if(month<10)month = '0'+month;
  let day = today.getDate();
  if(day<10)day = '0'+day;
  return today.getFullYear()+'-'+month+'-'+day;
}

const LeaderboardReport = () => {
  const options = { month: 'long' };
  const [isLoading,setIsLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [from, setFrom] = useState(()=>{
    let today = new Date();
    today.setDate(1);
    return convertString(today);
  });
  const [esFrom, setEsFrom] = useState('');
  useEffect( ()=>{
    let d = new Date(from);
    setEsFrom(d.toLocaleDateString('es-ES', options)+' '+ d.getDate());
  },[from]);
  const [to, setTo] = useState(convertString(new Date()));
  const [esTo, setEsTo] = useState('');
  useEffect( ()=>{
    let d = new Date(to);
    setEsTo(d.toLocaleDateString('es-ES', options)+' '+ d.getDate());
  },[to]);
  const [number, setNumber] = useState(10);
  const changeFromDate = (event)=>{
    setFrom(event.target.value);
    setIsLoading(false);
  }
  const changeToDate = (event)=>{
    setTo(event.target.value);
    setIsLoading(false);
  }
  const changeNumber = (event)=>{
    setNumber(event.target.value);
    setIsLoading(false);
  }
  useEffect( () => {
    async function fetchData(){
      const res = await http({
        path: "reports/customer-workouts?from="+from+"&to="+to+"&number="+number
      });
      if(res.data){
        setRecords(res.data);
        setIsLoading(true);
      }
    }
    fetchData();
  },[from,to,number]);
  return (
    <>
      <div className="report-border non-printer row m-4">
        <div className="col-3">
          <h2 className="pt-3">Leaderboard</h2>
        </div>
        <div className="col-9 text-right">
          <label htmlFor="from">From&nbsp;&nbsp;</label>
          <input name="from" type="date" value={from} onChange={changeFromDate}/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <label htmlFor="to">To&nbsp;&nbsp;</label>
          <input name="to" type="date" value={to} onChange={changeToDate}/>
          <label htmlFor="number">&nbsp;&nbsp;Number&nbsp;&nbsp;</label>
          <input name="number" type="number" value={number} onChange={changeNumber} style={{width:"50px"}}/>
          <button type="button" className="btn btn-brand btn-bold" onClick={()=>window.print()}>Print</button>
        </div>
      </div>
      <div className="container leaderboard">  
        {isLoading?(
        <div className="row" style={{background:'black'}} >
          <div className="col-md-2"></div>
          <div className="col-md-8 col-md-offset-2">
            <img src={toAbsoluteUrl('/media/logos/logo-light.png')} alt='img' style={{height:'50px'}} />
            <h3 className="title">Leaderboard del <span style={{textTransform: 'capitalize'}}>{esFrom}</span> a <span style={{textTransform: 'capitalize'}}>{esTo}</span></h3>
            <div className="fresh-table full-color-orange" style={{background:'radial-gradient(ellipse at center, #000 0%, #898989 100%)'}}>
              <div className="bootstrap-table bootstrap3">
                <div className="fixed-table-container">
                  <div className="fixed-table-body">
                    <table id="fresh-table" className="table  table-hover table-striped">
                      <thead>
                        <tr>
                          <th data-field="id">
                            <div className="th-inner sortable">Pos</div>
                          </th>
                          <th data-field="name">
                            <div className="th-inner sortable">Nombre</div>
                          </th>
                          <th data-field="salary">
                            <div className="th-inner sortable">Workouts</div>
                          </th>
                          <th data-field="country">
                            <div className="th-inner sortable">%</div>
                          </th>
                          <th data-field="city">
                            <div className="th-inner sortable">Total</div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {records.length === 0?(
                          <tr>
                            <td colspan="5">No Records</td>
                          </tr>
                        ):(
                          records.map(record=>(
                            <tr key={record.id}>
                              <td style={{width:'120px'}}>
                                {record.pos}
                                {record.workout_completeness === 100 &&(
                                  <img src={toAbsoluteUrl('/media/medal/first.png')} alt="first" className="medal"/>
                                )}
                                {record.workout_completeness<100 &&record.workout_completeness>=75&&(
                                  <img src={toAbsoluteUrl('/media/medal/second.png')} alt="second" className="medal"/>
                                )}
                              </td>
                              <td><img src={record.avatar_url.small} alt={record.id} className="avatar"/><div style={{display:'inline-block',width:'150px'}}>{record.name}</div></td>
                              <td>{record.workout_complete_count}</td>
                              <td>{record.workout_completeness}</td>
                              <td>{record.total}</td>
                            </tr>  
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-2"></div>
        </div>
        ):(
          <h3 className="kt-subheader__title" style={{ padding: "25px" }}>
          Loading...
          </h3>
        )}      
      </div>
    </>
  )
}

export default LeaderboardReport;