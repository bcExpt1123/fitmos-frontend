import React,{useState,useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import { reactLocalStorage } from 'reactjs-localstorage';
import { roundToMoney } from "../../../../../_metronic/utils/utils.js";
import FormattedPrice from "../../components/FormattedPrice";
import { $initialPayment, $changeMembership } from "../../../../../modules/subscription/service";
import { checkVoucher } from "../../redux/vouchers/actions";
import { calculatePriceWithCoupon } from '../../../../../lib/calculatePrice';

export const getBankFrequency = (currentUser, serviceItem)=>{
  let count = 0;
  let frequency = 1;
  let monthlyFee;
  let activePlan;
  if (serviceItem) {
    if (serviceItem.monthly !== "" && serviceItem.bank_1 === 'yes') count++;
    if (serviceItem.quarterly !== "" && serviceItem.bank_3 === 'yes'){
      count++;
    }
    if (serviceItem.semiannual !== "" && serviceItem.bank_6 === 'yes') {
      count++;
    }
    if (serviceItem.yearly !== "" && serviceItem.bank_12 === 'yes') {
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
    if (monthlyFee === undefined) {
      monthlyFee = serviceItem.monthly;
      activePlan = "monthly";
      frequency = 1;
    }
    monthlyFee = roundToMoney(monthlyFee);
  }
  return [count,frequency,monthlyFee,activePlan];
}
export default function BankPricing({getActivePlan}) {
  const [couponId, setCouponId] = useState(reactLocalStorage.get('publicCouponId'));
  const [coupon, setCoupon] = useState(false);
  const vouchers = useSelector(({vouchers})=>vouchers);
  const currency = {code:"USD", exponent: 2};
  const [count, setCount] = useState(4);
  const [classes, setClasses] = useState('');
  const activePlan = useSelector(({service})=>service.activePlan);
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const serviceItem = useSelector(({service})=>service.item);
  const dispatch = useDispatch();
  useEffect(() => {
    const data = getBankFrequency(currentUser, serviceItem);
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
  },[couponId]);
  return (
    <div className="row mt-2">
      {serviceItem.monthly !== "" && serviceItem.bank_1 === 'yes'&&(
        <div
          className={classes}
          onClick={() => dispatch($changeMembership("monthly"))}
        >
          <div
            className={classnames("membership", {
              active: getActivePlan("monthly", activePlan),
            })}
          >
            <h2>1 Mes + 1 Gratis</h2>
            <h4>
              {coupon?<><span className="strikeout">${serviceItem.monthly}</span>&nbsp;&nbsp;&nbsp;                      
                        <FormattedPrice
                          price={calculatePriceWithCoupon('bank',serviceItem['monthly'],0,coupon)[0]}
                          currency={currency}
                          locale="en"
                        />
                      </>:<span>${serviceItem.monthly}</span>}
            </h4>
            <h5>+ ${serviceItem.bank_fee} por Manejo.</h5>
          </div>
        </div>
      )}
      {serviceItem.quarterly !== "" && serviceItem.bank_3 === 'yes'&&(
        <div
          className={classes}
          onClick={() => dispatch($changeMembership("quarterly"))}
        >
          <div
            className={classnames("membership", {
              active: getActivePlan("quarterly", activePlan),
            })}
          >
            <h2>3 Meses + 1 Gratis</h2>
            <h4>
              {coupon?<><span className="strikeout">${serviceItem.quarterly}</span>&nbsp;&nbsp;&nbsp;
              <FormattedPrice
                price={calculatePriceWithCoupon('bank',serviceItem['quarterly'],0,coupon)[0]}
                currency={currency}
                locale="en"
              />              
              </>:<span>${serviceItem.quarterly}</span>}
            </h4>
            <h5>+ ${serviceItem.bank_fee} por Manejo.</h5>
          </div>
        </div>
      )}
      {serviceItem.semiannual !== "" &&  serviceItem.bank_6 === 'yes'&&(
        <div
          className={classes}
          onClick={() => dispatch($changeMembership("semiannual"))}
        >
          <div
            className={classnames("membership", {
              active: getActivePlan("semiannual", activePlan)
            })}
          >
            <h2>6 Meses + 1 Gratis</h2>
            <h4>
              {coupon?<><span className="strikeout">${serviceItem.semiannual}</span>&nbsp;&nbsp;&nbsp;
                        <FormattedPrice
                          price={calculatePriceWithCoupon('bank',serviceItem['semiannual'],0,coupon)[0]}
                          currency={currency}
                          locale="en"
                        />
                        </>:<span>${serviceItem.semiannual}</span>}
            </h4>
            <h5>+ ${serviceItem.bank_fee} por Manejo.</h5>
          </div>
        </div>
      )}
      {serviceItem.yearly !== "" && serviceItem.bank_12 === 'yes'&&(
        <div
          className={classes}
          onClick={() => dispatch($changeMembership("yearly"))}
        >
          <div
            className={classnames("membership", {
              active: getActivePlan("yearly", activePlan)
            })}
          >
            <h2>12 Meses + 1 Gratis</h2>
            <h4>
              {coupon?<><span className="strikeout">${serviceItem.yearly}</span>&nbsp;&nbsp;&nbsp;
                        <FormattedPrice
                          price={calculatePriceWithCoupon('bank',serviceItem['yearly'],0,coupon)[0]}
                          currency={currency}
                          locale="en"
                        />
                </>:<span>${serviceItem.yearly}</span>}
            </h4>
            <h5>+ ${serviceItem.bank_fee} por Manejo.</h5>
          </div>
        </div>
      )}
    </div>
  );
}
