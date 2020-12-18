const calculatePriceWithCoupon = (paymentType='bank',amount,bankFee,coupon)=>{
  let discountedPrice,recurringPrice;
  if(paymentType === 'bank'){
    if(coupon.form === '%'){
      discountedPrice = Math.round((parseFloat(amount) * 100 * (100 - parseFloat(coupon.discount))) / 100 + parseFloat(bankFee) * 100);
      if(coupon.renewal === '1' || coupon.renewal === 1)recurringPrice = Math.round((parseFloat(amount) * 100 * (100 - parseFloat(coupon.discount))) / 100 + parseFloat(bankFee) * 100);
    }
    else {
      discountedPrice = parseFloat(amount) * 100 - parseFloat(coupon.discount)*100 + parseFloat(bankFee) * 100;
      if(discountedPrice<0)discountedPrice = 0;
      if(coupon.renewal === '1' || coupon.renewal === 1)recurringPrice = discountedPrice;
    }
  }else{
    if(coupon.form === '%'){
      discountedPrice = Math.round((parseFloat(amount) * 100 * (100 - parseFloat(coupon.discount))) / 100);
      if(coupon.renewal === '1' || coupon.renewal === 1)recurringPrice = Math.round((amount * (100 - parseFloat(coupon.discount))) / 100);
    }
    else {
      discountedPrice = parseFloat(amount) * 100 - parseFloat(coupon.discount)*100;
      if(discountedPrice<0)discountedPrice = 0;
      if(coupon.renewal === '1' || coupon.renewal === 1)recurringPrice = discountedPrice;
    }
  }
  return [discountedPrice, recurringPrice];
}
export {calculatePriceWithCoupon};