import React,{useState, useEffect, useRef} from "react";
import MetaTags from "react-meta-tags";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import { Formik, Form, Field } from "formik";
import ThreeColumn from "./layouts/Three";
import { http } from "./services/api";
import { toAbsoluteUrl, isMobile } from "../../../_metronic/utils/utils";

const convertString = (today)=>{
  let month = today.getMonth()+1;
  if(month<10)month = '0'+month;
  let day = today.getDate();
  if(day<10)day = '0'+day;
  return today.getFullYear()+'-'+month+'-'+day;
}

registerLocale("es", es);

export default function Leaderboard() {
  const [month, setMonth] = useState(new Date());
  const [gender, setGender] = useState('all');
  const [records, setRecords] = useState([]);
  const [isLoading,setIsLoading] = useState();
  const [number, setNumber] = useState(10);
  const [from, setFrom] = useState(()=>{
    let today = new Date();
    today.setDate(1);
    return convertString(today);
  });
  const [to, setTo] = useState(convertString(new Date()));
  const handleMonthChange=(date)=>{
    setMonth(date)
  } 
  const handleGenderChange = (event)=>{
    console.log(event.target.value)
    setGender(event.target.value)
  }
  const onSubmit = ()=>{
    
  }
  useEffect( () => {
    async function fetchData(){
      let today = new Date(+month);
      today.setDate(1);
      const from = convertString(today);
      today.setDate(1);
      let nextMonth = new Date(today.setMonth(today.getMonth()+1));
      nextMonth.setDate(0);
      const to = convertString(nextMonth);
      const res = await http({
        path: "reports/customer-workouts?from="+from+"&to="+to+"&number="+number+"&gender="+gender
      });
      if(res.data){
        setRecords(res.data);
        setIsLoading(true);
      }
    }
    fetchData();
  },[month,number, gender]);
  const labelRef = useRef();
  useEffect(()=>{
    if(labelRef.current){
      let height;
      if(isMobile())height = window.innerHeight-labelRef.current.offsetTop - 80;
      else height = window.innerHeight-labelRef.current.offsetTop - 140;
      labelRef.current.style.height = height+"px";
    }
  },[]);
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
              <label htmlFor="date">Fecha:</label>
              <DatePicker
                locale="es"
                id="date"
                name="date"
                autoComplete="date"
                selected={month}
                onChange={handleMonthChange}
                placeholderText="Fecha"
                dateFormat="MM/yyyy"
                showMonthYearPicker
              />
            </div>
            <div className="item">
              <label htmlFor="gender">Género:</label>
              <select 
                as="select" 
                name="gender"
                id="gender"
                onChange={handleGenderChange}
                value={gender}
              >
                <option value="all">All</option>
                <option value="Male">Masculino</option>
                <option value="Female">Femenino</option>
              </select>
            </div>
          </div>
          <div className="data">
            {records.length === 0?(
              <div style={{display:'flex',alignItems: 'center',justifyContent: 'center'}} ref={labelRef}>
                <div style={{maxWidth: '50%',fontSize:'15px',fontWeight:'600'}}>No Records</div>
              </div>
            ):(
              records.map(record=>(
                <div key={record.id} className="item row">
                  <div className="avatar"><img src={record.avatar_url.small} alt={record.id} className="avatar"/></div>
                  <div className="content">
                    <div className="name">{record.name}</div>
                    <div>
                      <span className="label">Workouts:</span>
                      <span className="value">{record.workout_complete_count}</span>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <span className="label">Total:</span>
                      <span className="value">{record.total}</span>
                    </div>
                    <div>
                      <span className="label">Cumplimiento:</span>
                      <span className="value">{record.workout_completeness}%</span>
                    </div>
                  </div>
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
                </div>  
              ))
            )}
          </div>
        </div>
      </ThreeColumn>
    </>
  );
}
