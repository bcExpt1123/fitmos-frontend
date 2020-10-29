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

const DailyReport = () => {
  const [isLoading,setIsLoading] = useState(false);
  const [from, setFrom] = useState(()=>{
    let today = new Date();
    today.setDate(1);
    return convertString(today);
  });
  const [to, setTo] = useState(convertString(new Date()));
  const changeFromDate = (event)=>{
    setFrom(event.target.value);
    setIsLoading(false);
  }
  const changeToDate = (event)=>{
    setTo(event.target.value);
    setIsLoading(false);
  }
  const handleExport = ()=>{
    async function fetchDownload(){
      const res = await fileDownload({
        path: "reports/export-subscriptions?from="+from+"&to="+to
      });
      if(res.data){
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', "Subscription-"+from+"-"+to+".xlsx"); //or any other extension
        document.body.appendChild(link);
        link.click();
      }
    }
    fetchDownload();
  }
  return (
    <>
      <div className="report-border non-printer row m-4">
        <div className="col-3">
          <h2 className="pt-3">Daily Resume</h2>
        </div>
        <div className="col-9 text-right">
          <label htmlFor="from">From&nbsp;&nbsp;</label>
          <input name="from" type="date" value={from} onChange={changeFromDate}/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <label htmlFor="to">To&nbsp;&nbsp;</label>
          <input name="to" type="date" value={to} onChange={changeToDate}/>
          <button className="btn btn-primary" onClick={handleExport}>Export</button>
        </div>
      </div>
    </>
  )
}

export default DailyReport;