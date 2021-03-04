import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { injectIntl } from "react-intl";
import { withRouter } from "react-router";
import { $changeItem } from "../../../modules/subscription/customer";
import { makeStyles } from "@material-ui/core";
import { Button, Paper} from "@material-ui/core";
import { findCustomer } from "../home/redux/people/actions";
import { findCustomerPosts, appendCustomerPostsAfter } from "../home/redux/post/actions";
import Posts from "../home/social/sections/Posts";
import ProfileInfo from "../home/profile/ProfileInfo";
import { can } from "../../../lib/common";
import EditPostModal from "../home/social/posts/EditingModal";

const useStyles = () => {
  return makeStyles(theme => ({
    root: {
      display: "block",
      flexWrap: "wrap"
    },
    textField: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2)
    },
    margin: {
      margin: theme.spacing(1)
    }
  }));
};

function Main() {
  const item = useSelector(({ customer }) => customer.item);
  const isloading = useSelector(({ customer }) => customer.isloading);
  /** customer posts */
  const posts = useSelector(({post})=>post.customerPosts);
  const customer = useSelector(({people})=>people.customer);
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const last = useSelector(({post})=>post.customerPostsLast);
  const dispatch = useDispatch();
  const dispatchAction = ()=>{
    dispatch(appendCustomerPostsAfter(item.id));
  }
  const editPost = useSelector(({post})=>post.editPost);
  return (
    <Paper style={{ padding: "5px" }}>
      {item ? <>
        {can(currentUser, "social")&&
          <div id="customer-profile">
            <div className="sidebar">
              {customer && <ProfileInfo customer={customer}/>}
            </div>
            <div className="admin-customer-content">
              <Posts posts={posts} last={last} dispatchAction={dispatchAction}  show={false} newsfeed={false} topMonitor={"customerPosts"}/>
            </div>
            <EditPostModal show={!(editPost===false)} />
          </div>
        }
      </> : isloading ? (
        <h3 className="kt-subheader__title" style={{ padding: "25px" }}>
          Loading...
        </h3>
      ) : (
        <h3 className="kt-subheader__title" style={{ padding: "25px" }}>
          The Item doesn't exist
        </h3>
      )}
    </Paper>
  );
}
const CustomerProfile = injectIntl(withRouter(Main));

function Sub({match,history}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  useEffect(() => {
    if(match.params.id){
      dispatch($changeItem(match.params.id));
      dispatch(findCustomerPosts(match.params.id));
      dispatch(findCustomer(match.params.id));
    }else{
      console.log('id not exist');
    }
  }, []);// eslint-disable-line react-hooks/exhaustive-deps
  const item = useSelector(({ customer }) => customer.item);
  const isloading = useSelector(({ customer }) => customer.isloading);
  return (
    <>
      <div className="kt-subheader__main">
        {false && (
          <button
            className="kt-subheader__mobile-toggle kt-subheader__mobile-toggle--left"
            id="kt_subheader_mobile_toggle"
          >
            <span />
          </button>
        )}
        {match.params.id ? (
          item ? (
            <h3 className="kt-subheader__title">
              {item.first_name} {item.last_name}
              {item.coupon && (
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  style={{ marginLeft: "20px" }}
                >
                  {item.coupon.code}
                </Button>
              )}
            </h3>
          ) : isloading ? (
            <h3 className="kt-subheader__title">Loading...</h3>
          ) : (
            <h3 className="kt-subheader__title">There is no item</h3>
          )
        ) : (
          <h3 className="kt-subheader__title">New Customer</h3>
        )}
        <span className="kt-subheader__separator kt-subheader__separator--v" />
        <span className="kt-subheader__desc"></span>
      </div>

      <div className="kt-subheader__toolbar">
        <div className="kt-subheader__wrapper">
          <div>{item&&item.status}</div>
        </div>
      </div>
    </>
  );
}

const SubHeaderCustomerProfile = injectIntl(Sub);
export { CustomerProfile, SubHeaderCustomerProfile };
