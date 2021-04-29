import React,{ useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import MetaTags from "react-meta-tags";

import ThreeColumn from "./layouts/Three";
import { findWorkouts,initialBlock } from "./redux/done/actions";
import PageHeader from "./layouts/PageHeader";
import Header from "./sections/Workout/Header";
import Body from "./sections/Workout/Body";
import "./assets/scss/theme/style.scss";
import "./assets/scss/theme/mbr-additional.css";
import "./assets/scss/dropdown/style.css";
import "./assets/scss/theme/common.scss";
import "./assets/scss/theme/login.scss";
import "./assets/scss/theme/signup.scss";

const WorkoutPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(findWorkouts());
    dispatch(initialBlock());
  }, []);// eslint-disable-line react-hooks/exhaustive-deps
  const currentUser = useSelector(({auth})=>auth.currentUser);

  //get workout from date
  return (<>
    <MetaTags>
      <title>Workout -Fitemos </title>
      <meta
        name="description"
        content="Workout -Fitemos"
      />
    </MetaTags>
    <ThreeColumn>
      {/* <PageHeader title={`Hola ${currentUser.customer.first_name}`}/> */}
      <div className="workout">
        <Header/>
        <Body/>
      </div>
    </ThreeColumn>
  </>);
};

export default WorkoutPage;
