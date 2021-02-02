export const currentWorkoutPlan = (slug)=>{
  let text;
  switch(slug){
    case "monthly":
      text = "Mensual";
      break;
    case "quarterly":
      text = "Trimestral";
      break;
    case "semiannual":
      text = "Semestral";
      break;
    case "yearly":
      text = "Anual";
      break;
    default:  
  }
  return text;
}
export const currentCustomerWeights = (slug)=>{
  let text;
  switch(slug){
    case "sin pesas":
      text = "Sin mancuernas";
      break;
    case "con pesas":
      text = "Con mancuernas";
      break;
    default:  
  }
  return text;
}
