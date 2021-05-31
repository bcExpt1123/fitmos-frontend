import React from "react";
import useSWR from "swr";
import { Modal } from "react-bootstrap";
import { httpApi, http } from "../../../services/api";
import WorkoutCommentSection from "./CommentSection";
import "../../../assets/scss/theme/social/workout-comment.scss";

const WorkoutCommentModal = ({publishDate, show, onClose, customerId}) => {
  const { data } = useSWR('workout-comments/workout?publish_date='+publishDate+'&customer_id='+customerId, httpApi);
  const comments = data?.data;
  return (
    <Modal
      dialogClassName="workout-comment-modal"
      show={show}
      onHide={onClose}
      animation={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">
          Bitácora | {Array.isArray(comments)&&comments[0].workout_spanish_date}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          <div className="workout-comments">
            {
              Array.isArray(comments)&&comments.map(comment=>
                <WorkoutCommentSection key={comment.id} comment={comment}/>
              )
            }
          </div>
        }
      </Modal.Body>
    </Modal>
  );
}

export default WorkoutCommentModal;