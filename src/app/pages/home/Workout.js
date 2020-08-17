import React,{ useEffect,useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import MetaTags from "react-meta-tags";

import ThreeColumn from "./layouts/Three";
import { findWorkouts,initialBlock } from "./redux/done/actions";
import PageHeader from "./layouts/PageHeader";
import Header from "./sections/Workout/Header";
import Body from "./sections/Workout/Body";

const WorkoutPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(findWorkouts());
    dispatch(initialBlock());
  }, []);
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
      <PageHeader title={`Hola ${currentUser.customer.first_name}`}/>
      <div className="workout">
        <Header/>
        <Body/>
      </div>
    </ThreeColumn>
  </>);
};

export default WorkoutPage;
