import React,{useState,useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import { roundToMoney } from "../../../../../_metronic/utils/utils.js";

export const getFrequency = (currentUser, serviceItem)=>{
  let count = 0;
  let frequency = 1;
  let monthlyFee;
  let activePlan;
  if (serviceItem) {
    if(currentUser&&currentUser.customer.currentWorkoutPlan){
      if(currentUser.customer.currentWorkoutPlan!=='monthly'){
        if (serviceItem.monthly !== "") count++;
      }
      if(currentUser.customer.currentWorkoutPlan!=='quarterly'){
        if (serviceItem.quarterly !== ""){
          count++;
          monthlyFee = serviceItem.quarterly / 3;
          activePlan = "quarterly";
          frequency = 3;
        }
      }
      if(currentUser.customer.currentWorkoutPlan!=='semiannual'){
        if (serviceItem.semiannual !== "") {
          count++;
          monthlyFee = serviceItem.semiannual / 6;
          activePlan = "semiannual";
          frequency = 6;
        }
      }
      if(currentUser.customer.currentWorkoutPlan!=='yearly'){
        if (serviceItem.yearly !== "") {
          count++;
          monthlyFee = serviceItem.yearly / 12;
          activePlan = "yearly";
          frequency = 12;
        }
      }
    }else{
      if (serviceItem.monthly !== "") count++;
      if (serviceItem.quarterly !== ""){
        count++;
      }
      if (serviceItem.semiannual !== "") {
        count++;
      }
      if (serviceItem.yearly !== "") {
        count++;
      }
      if(serviceItem.frequency){
        switch(serviceItem.frequency){
          case 1: case '1':
            monthlyFee = serviceItem.monthly;
            activePlan = "monthly";
            frequency = 1;
            break;
          case 3:case '3':
            monthlyFee = serviceItem.quarterly / 3;
            activePlan = "quarterly";
            frequency = 3;
            break;
          case 6:case '6':
            monthlyFee = serviceItem.semiannual / 6;
            activePlan = "semiannual";
            frequency = 6;  
            break;
          case 12:case '12':
            monthlyFee = serviceItem.yearly / 12;
            activePlan = "yearly";
            frequency = 12;  
            break;
        }
      }
    }
    if (monthlyFee === undefined) {
      monthlyFee = serviceItem.monthly;
      activePlan = "monthly";
      frequency = 1;
    }
    monthlyFee = roundToMoney(monthlyFee);
  }
  return [count,frequency,monthlyFee,activePlan];
}
export default function NmiPricing({changeMembership,getActivePlan}) {
  const [count, setCount] = useState(4);
  const [classes, setClasses] = useState('');
  const [activePlan, setActivePlan] = useState('');
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const serviceItem = useSelector(({service})=>service.item);
  useEffect(() => {
    const data = getFrequency(currentUser, serviceItem);
    setCount(data[0]);
    setActivePlan(data[3]);
    let classes;
    switch (data[0]) {
      case 1:
        classes = "col-12";
        break;
      case 2:
        classes = "col-6";
        break;
      case 3:
        classes = "col-4";
        break;
      case 4:
        classes = "col-6 col-md-3";
        break;
      default:  
    }  
    setClasses(classes);
  }, []);// eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="row mt-2">
      {serviceItem.monthly !== "" && currentUser.customer.currentWorkoutPlan !=='monthly'&&(
        <div
          className={classes}
          onClick={() => changeMembership("monthly")}
        >
          <div
            className={classnames("membership", {
              active: getActivePlan("monthly", activePlan),
            })}
          >
            <h2>Mensual</h2>
            <h4>${serviceItem.monthly}</h4>
            <h5>al concluir los {serviceItem.free_duration} días</h5>
          </div>
        </div>
      )}
      {serviceItem.quarterly !== "" && currentUser.customer.currentWorkoutPlan !=='quarterly'&&(
        <div
          className={classes}
          onClick={() => changeMembership("quarterly")}
        >
          <div
            className={classnames("membership", {
              active: getActivePlan("quarterly", activePlan),
            })}
          >
            <h2>Trimestral</h2>
            <h4>${serviceItem.quarterly}</h4>
            <h5>al concluir los {serviceItem.free_duration} días</h5>
          </div>
        </div>
      )}
      {serviceItem.semiannual !== "" && currentUser.customer.currentWorkoutPlan !=='semiannual'&&(
        <div
          className={classes}
          onClick={() => changeMembership("semiannual")}
        >
          <div
            className={classnames("membership", {
              active: getActivePlan("semiannual", activePlan)
            })}
          >
            <h2>Semestral</h2>
            <h4>${serviceItem.semiannual}</h4>
            <h5>al concluir los {serviceItem.free_duration} días</h5>
          </div>
        </div>
      )}
      {serviceItem.yearly !== "" && currentUser.customer.currentWorkoutPlan !=='yearly'&&(
        <div
          className={classes}
          onClick={() => changeMembership("yearly")}
        >
          <div
            className={classnames("membership", {
              active: getActivePlan("yearly", activePlan)
            })}
          >
            <h2>Anual</h2>
            <h4>${serviceItem.yearly}</h4>
            <h5>al concluir los {serviceItem.free_duration} días</h5>
          </div>
        </div>
      )}
    </div>
  );
}
