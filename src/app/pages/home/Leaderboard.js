import React,{useState, useEffect, useRef} from "react";
import MetaTags from "react-meta-tags";
import { registerLocale } from "react-datepicker";
import { useHistory } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import ThreeColumn from "./layouts/Three";
import { http } from "./services/api";
import { toAbsoluteUrl, isMobile } from "../../../_metronic/utils/utils";
import SplashScreen from "../../../app/partials/layout/SplashScreen";
import "./assets/scss/theme/style.scss";
import "./assets/scss/theme/mbr-additional.css";
import "./assets/scss/dropdown/style.css";
import "./assets/scss/theme/common.scss";
import "./assets/scss/theme/login.scss";
import "./assets/scss/theme/signup.scss";

// const convertString = (today)=>{
//   let month = today.getMonth()+1;
//   if(month<10)month = '0'+month;
//   let day = today.getDate();
//   if(day<10)day = '0'+day;
//   return today.getFullYear()+'-'+month+'-'+day;
// }

registerLocale("es", es);

export default function Leaderboard() {
  const [month, setMonth] = useState('all');
  const [gender, setGender] = useState('all');
  const [records, setRecords] = useState([]);
  const [isLoading,setIsLoading] = useState(true);
  const handleMonthChange=(event)=>{
    setMonth(event.target.value);
  } 
  const handleGenderChange = (event)=>{
    setGender(event.target.value)
  }
  useEffect( () => {
    async function fetchData(){
      let path;
      path = "reports/customer-workouts-range?range="+month+"&gender="+gender; 
      const res = await http({
        path
      });
      if(res.data){
        setRecords(res.data.data);
      }
      setIsLoading(false);
    }
    fetchData();
  },[month,gender]);
  const labelRef = useRef();
  useEffect(()=>{
    if(labelRef.current){
      let height;
      if(isMobile())height = window.innerHeight-labelRef.current.offsetTop - 80;
      else height = window.innerHeight-labelRef.current.offsetTop - 140;
      labelRef.current.style.height = height+"px";
    }
  },[]);
  const history = useHistory();
  const onRedirectCustomerProfile = (username)=>()=>{
    history.push(username);
  }
  return (
    <>
      <MetaTags>
      <title>Workout -Fitemos </title>
      <meta
        name="description"
        content="Workout -Fitemos"
      />
      </MetaTags>
      <ThreeColumn>
        <div className="leaderboard-front newsfeed">
          <h2 className="title">
            Leaderboard
          </h2>
          <div className="filter">
            <div className="item">
              <select 
                as="select" 
                name="range"
                id="range"
                onChange={handleMonthChange}
                value={month}
              >
                <option value="all">Histórico</option>
                <option value="current">Mes Corriente</option>
                <option value="last">Mes Pasado</option>
              </select>
            </div>
            <div className="item">
              <select 
                as="select" 
                name="gender"
                id="gender"
                onChange={handleGenderChange}
                value={gender}
              >
                <option value="all">Todos los grupos</option>
                <option value="Male">Hombres</option>
                <option value="Female">Mujeres</option>
                <option value="MaleMaster">Hombres Masters (+40 años)</option>
                <option value="FemaleMaster">Mujeres Masters (+40 años)</option>
              </select>
            </div>
          </div>
          <div className="data">
            {isLoading ? (
              <div className="loading" style={{marginTop:"200px", marginBottom:"200px"}}>
                <SplashScreen />
              </div>
            ) : (
              <>
                {records.length === 0?(
                  <div style={{display:'flex',alignItems: 'center',justifyContent: 'center'}} ref={labelRef}>
                    <div style={{maxWidth: '50%',fontSize:'15px',fontWeight:'600'}}>No Records</div>
                  </div>
                ):(
                  records.map(record=>(
                    <div key={record.id} className="item row cursor-pointer" onClick={onRedirectCustomerProfile(record.username)}>
                      <div className="position">
                        {record.pos}<sup><i className="fas fa-dot-circle"/></sup>
                      </div>
                      <div className="medal">  
                        {record.workout_completeness === 100 &&(
                          <img src={toAbsoluteUrl('/media/medal/first.png')} alt="first" className="medal"/>
                        )}
                        {record.workout_completeness<100 &&record.workout_completeness>=75&&(
                          <img src={toAbsoluteUrl('/media/medal/second.png')} alt="second" className="medal"/>
                        )}
                      </div>
                      <div className="avatar"><img src={record.avatar_url.small} alt={record.id} className="avatar"/></div>
                      <div className="name">
                        {record.name}
                      </div>
                      <div className="workout-number">{record.workout_complete_count}</div>
                      <div className="workout-recent">{'+1'}</div>
                    </div>  
                  ))
                )}
              </>
            )}
          </div>
        </div>
      </ThreeColumn>
    </>
  );
}
