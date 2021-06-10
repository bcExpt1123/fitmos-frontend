import React from "react";
import { useSelector } from "react-redux";
import SaveCommentForm from "./SaveCommentForm";

const CreateComment = ({onCancel}) => {
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const workouts = useSelector(({done})=>done.workouts);
  const step = useSelector(({workout})=>workout.step);
  const slug = useSelector(({workout})=>workout.slug);
  const comment = useSelector(({workout})=>workout.comment);
  let type = 'extra';
  if(['sin_content','con_content'].includes(slug)){
    type = 'basic';
  }
  return (
    <div id="create_comment_modal" className="block mt-5">
      <SaveCommentForm 
        id={comment?comment.id:undefined}
        from="workout"
        initialValues={{
          content: comment?comment.content:"",
          dumbells_weight: comment?comment.dumbells_weight:currentUser.customer.dumbells_weight
        }}
        publishDate={workouts.current.today}
        type={type}
        onCancel={onCancel}
        workoutContent={workouts.current.blocks[step].content}
      />
    </div>
  );
}

export default CreateComment;