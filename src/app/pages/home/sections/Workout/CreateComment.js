import React from "react";
import { useSelector } from "react-redux";
import SaveCommentForm from "./SaveCommentForm";

const CreateComment = () => {
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const workouts = useSelector(({done})=>done.workouts);
  const step = useSelector(({workout})=>workout.step);
  const slug = useSelector(({workout})=>workout.slug);
  let type = 'extra';
  if(['sin_content','con_content'].includes(slug)){
    type = 'basic';
  }
  return (
    <div id="create_comment_modal" className="block mt-5">
      <SaveCommentForm 
        initialValues={{
          content: "",
          dumbells_weight: currentUser.customer.dumbells_weight
        }}
        publishDate={workouts.current.today}
        type={type}
        workoutContent={workouts.current.blocks[step].content}
      />
    </div>
  );
}

export default CreateComment;