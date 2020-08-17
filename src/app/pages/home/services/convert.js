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
  }
  return text;
}
