import React,{useState,useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import { reactLocalStorage } from 'reactjs-localstorage';
import { roundToMoney } from "../../../../../_metronic/utils/utils.js";
import { $initialPayment, $changeMembership } from "../../../../../modules/subscription/service";
import { checkVoucher } from "../../redux/vouchers/actions";
import FormattedPrice from "../../components/FormattedPrice";
import { calculatePriceWithCoupon } from '../../../../../lib/calculatePrice';

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
export default function NmiPricing({getActivePlan}) {
  const [couponId, setCouponId] = useState(reactLocalStorage.get('publicCouponId'));
  const [coupon, setCoupon] = useState(false);
  const vouchers = useSelector(({vouchers})=>vouchers);
  const [count, setCount] = useState(4);
  const [classes, setClasses] = useState('');
  const currency = {code:"USD", exponent: 2};
  const activePlan = useSelector(({service})=>service.activePlan);
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const serviceItem = useSelector(({service})=>service.item);
  const dispatch = useDispatch();
  useEffect(() => {
    const data = getFrequency(currentUser, serviceItem);
    setCount(data[0]);
    dispatch($initialPayment(data[1],data[2],data[3]));
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
  useEffect(()=>{
    if(couponId){
      const coupons = Object.values(vouchers);
      if (coupons[0] && coupons[0].discount) {
        if(coupons[0].id == couponId){
          setCoupon(coupons[0]);
        }else{
          dispatch(checkVoucher());
        }
      }else{
        dispatch(checkVoucher());
      }
    }
  },[couponId,vouchers]);
  return (
    <div className="row mt-2">
      {serviceItem.monthly !== "" && currentUser.customer.currentWorkoutPlan !=='monthly'&&(
        <div
          className={classes}
          onClick={() => dispatch($changeMembership("monthly"))}
        >
          <div
            className={classnames("membership", {
              active: getActivePlan("monthly", activePlan),
              discount:coupon
            })}
          >
            <h2>Mensual</h2>
            <h4>
              {coupon?<><span className="strikeout">${serviceItem.monthly}</span>&nbsp;&nbsp;&nbsp;
                        <FormattedPrice
                          price={calculatePriceWithCoupon('bank',serviceItem['monthly'],0,coupon)[0]}
                          currency={currency}
                          locale="en"
                        />
                      </>:<span>${serviceItem.monthly}</span>}
            </h4>
            <h5>al concluir los {serviceItem.free_duration} días</h5>
          </div>
        </div>
      )}
      {serviceItem.quarterly !== "" && currentUser.customer.currentWorkoutPlan !=='quarterly'&&(
        <div
          className={classes}
          onClick={() => dispatch($changeMembership("quarterly"))}
        >
          <div
            className={classnames("membership", {
              active: getActivePlan("quarterly", activePlan),
              discount:coupon
            })}
          >
            <h2>Trimestral</h2>
            <h4>
              {coupon?<><span className="strikeout">${serviceItem.quarterly}</span>&nbsp;&nbsp;&nbsp;
                        <FormattedPrice
                          price={calculatePriceWithCoupon('bank',serviceItem['quarterly'],0,coupon)[0]}
                          currency={currency}
                          locale="en"
                        />
                      </>:<span>${serviceItem.quarterly}</span>}
            </h4>
            <h5>al concluir los {serviceItem.free_duration} días</h5>
          </div>
        </div>
      )}
      {serviceItem.semiannual !== "" && currentUser.customer.currentWorkoutPlan !=='semiannual'&&(
        <div
          className={classes}
          onClick={() => dispatch($changeMembership("semiannual"))}
        >
          <div
            className={classnames("membership", {
              active: getActivePlan("semiannual", activePlan),
              discount:coupon
            })}
          >
            <h2>Semestral</h2>
            <h4>
              {coupon?<><span className="strikeout">${serviceItem.semiannual}</span>&nbsp;&nbsp;&nbsp;
                        <FormattedPrice
                          price={calculatePriceWithCoupon('bank',serviceItem['semiannual'],0,coupon)[0]}
                          currency={currency}
                          locale="en"
                        />
                        </>:<span>${serviceItem.semiannual}</span>}
            </h4>
            <h5>al concluir los {serviceItem.free_duration} días</h5>
          </div>
        </div>
      )}
      {serviceItem.yearly !== "" && currentUser.customer.currentWorkoutPlan !=='yearly'&&(
        <div
          className={classes}
          onClick={() => dispatch($changeMembership("yearly"))}
        >
          <div
            className={classnames("membership", {
              active: getActivePlan("yearly", activePlan),
              discount:coupon
            })}
          >
            <h2>Anual</h2>
            <h4>
              {coupon?<><span className="strikeout">${serviceItem.yearly}</span>&nbsp;&nbsp;&nbsp;
                        <FormattedPrice
                          price={calculatePriceWithCoupon('bank',serviceItem['yearly'],0,coupon)[0]}
                          currency={currency}
                          locale="en"
                        />
                        </>:<span>${serviceItem.yearly}</span>}
            </h4>
            <h5>al concluir los {serviceItem.free_duration} días</h5>
          </div>
        </div>
      )}
    </div>
  );
}
