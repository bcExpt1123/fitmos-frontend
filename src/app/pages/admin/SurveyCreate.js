import React, { Component,useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { red } from "@material-ui/core/colors";      
import { NavLink } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';

import {
  $actionSurveyTitleSave,
  $actionSurveyItemSave,
  $updateItemValue,
  $changeItem,
  $setNewItem,
  $deleteItem,
  $fetchIndexItem,
  $editItem,
  $initial,
} from "../../../modules/subscription/survey";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    borderRadius: '10px'
  },
  iconHover: {
    "&:hover": {
      color: red[800]
    }
	},
	modal: {
    opacity: 1,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    margin: theme.spacing(4),
  },
  scrolldisplay: {
    height:'350px',
    overflow:'auto'
  },
  margin: {
    margin: theme.spacing(3),
    marginTop:"30px",
  },
  marginTop:{
    marginTop:"20px",
    marginBottom:"20px"
  },
  button:{
    marginTop:"30px",
    marginBottom:"20px",
    fontSize:"13px",
    padding:"10px",
    letterSpacing:"10px"
  },
  boxstyle:{
    background: '#e0e0e0',
    margin: theme.spacing(2),
    padding:"10px 30px",
    borderRadius:"10px",
  },
  boxfont:{
    fontSize:'15px',
    color:'black',
  },
}));

const Main = ({history}) =>{
  const classes=useStyles();
  const dispatch=useDispatch();
  const [valueTitle, setValueTitle] = React.useState(false);
  const survey = useSelector(({ survey }) => survey);
  useEffect(() => {
    dispatch($fetchIndexItem())
  }, []);
  const item = survey.item;
  const displayItem=survey.data_display_item;
  const surveyData = survey.data_display;
  const isloading = survey.loading;
  const actionSurveyTitleSave = event => {
    setValueTitle(true);
    event.preventDefault();
    dispatch($actionSurveyTitleSave(history));
  };
  const actionSurveyItemSave = event => {
    dispatch($actionSurveyItemSave());
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (name) => {
    return event => {
      dispatch($updateItemValue(name, event.target.value));
    };
  }
  const actionEdit = id => event => {
    dispatch($editItem(id));
  };
  const actionDeleteItem = id => event => {
    if (window.confirm("Are you sure to delete this item?")) dispatch($deleteItem(id));
  };
  const initialItem = (event) =>{
    dispatch($initial());
  };
  
  return(
		<div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={5}>
          <Paper className={classes.paper}>
            <Grid item className={classes.margin}>
            {item ? (
              <form
                id="benchmark-form"
                onSubmit={actionSurveyTitleSave}
                autoComplete="off"
              >
                <TextField  
                  required
                  id="standard-basic" 
                  label="Title" 
                  value={item.title}
                  fullWidth
                  onChange={handleChange("title")}
                  className={classes.marginTop}
                  />
                <TextField
                  required
                  id="date"
                  label="Start"
                  type="date"
                  value={item.from_date}
                  onChange={handleChange("from_date")}
                  InputLabelProps={{
                  shrink: true,
                  }}
                  className={classes.marginTop}
                  fullWidth />
                <TextField
                  required
                  id="date"
                  label="End"
                  type="date"
                  value={item.to_date}
                  onChange={handleChange("to_date")}
                  InputLabelProps={{
                  shrink: true,
                  }}
                  className={classes.marginTop}
                  fullWidth
                  />
                  <Button
                    variant="contained" 
                    color="primary" 
                    aria-label="save"
                    title="Save"
                    type="submit"
                    className={classes.button}
                    fullWidth
                    >Save
                  </Button>
                </form>
            ) : isloading ? (
              <h3 className="kt-subheader__title" style={{ padding: "25px" }}>
                Loading...
              </h3>
            ) : (
              <h3 className="kt-subheader__title" style={{ padding: "25px" }}>
                The Item doesn't exist
              </h3>
            )}
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={7}>
          <Paper className={classes.paper}>
            {item?(
              <Grid  className={classes.surveyItem}>
                {item.id?(
                  <Button variant="contained" color="secondary"
                  aria-label="create"
                  title="create"
                  color="primary"
                  onMouseDown={initialItem}
                  onClick={handleOpen}
                  style={{fontSize:"13px",marginTop:"20px",marginBottom:"20px"}}
                  ><NoteAddIcon/>&nbsp;&nbsp;Create
                  </Button>
                ):(
                  <h3></h3>
                )}
              </Grid>
            ):(
              <h3>OK</h3>
            )}
            <Box className={classes.scrolldisplay}>
              {surveyData != null &&
                surveyData.map(row => (
              <Box xs={12} key={row.id} className={classes.boxstyle} display="flex" flexDirection="column">
                <Box display="flex" flexDirection="row" justifyContent="space-around" alignItems="center">
                  <Box alignItems="center" flexGrow={1} className={classes.boxfont} style={{textAlign:'left'}}>{row.label}</Box>
                  <Box alignItems="center"  >
                    <Tooltip title="Edit">
                      <IconButton aria-label="edit"  className={classes.icon} onClick={handleOpen} onMouseDown={actionEdit(row.id)}>
                        <EditIcon   color="secondary"/>
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box>
                    <Tooltip title="Delete">
                      <IconButton aria-label="delete" className={classes.icon} onClick={actionDeleteItem(row.id)}>
                        <DeleteIcon   color="error"/>
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
          mt={10}
        >
          <Paper style={{width:"300px"}}>
            <Box display='flex' justifyContent='center' flexDirection='column'>
              {displayItem ? (
                <>
                  <Box display="flex"  justifyContent="space-around" style={{margin:"20px",marginTop:"30px"}}>
                    <RadioGroup row aria-label="position" name="position" defaultValue="top" defaultValue={displayItem.question} className={classes.mg}  onChange={handleChange("radio")}>
                      <FormControlLabel id="level" value="level" control={<Radio color="primary" />} label="level" />
                      <FormControlLabel id="text" value="text" control={<Radio color="primary"/>} label="text" />
                      <FormControlLabel id="select" value="select" control={<Radio color="primary"/>} label="select" />
                    </RadioGroup>
                  </Box>
                  <Box display="flex" justifyContent='space-around' style={{margin:"20px 40px"}}>
                    <TextField 
                      required 
                      id="text" 
                      label="Question" 
                      variant="outlined"
                      type="text"
                      className={classes.mg} 
                      defaultValue={displayItem.label} 
                      fullWidth
                      onChange={handleChange("question")}/>
                  </Box>
                </>
              ):(
                <p>sorry</p>
              )}
              <Box display="flex" flexDirection="row" justifyContent="center">
                <Button variant="contained" color="secondary"
                  aria-label="Save"
                  title="save"
                  onMouseDown={actionSurveyItemSave}
                  style={{margin:"20px",padding:"10px"}}                  
                  onClick={handleClose}
                >save</Button>
                <Button variant="contained" color="secondary"
                  aria-label="Close"
                  title="close"
                  color="primary"
                  style={{margin:"20px",padding:"10px"}}
                  onClick={handleClose}
                >close</Button>
              </Box>
            </Box>
          </Paper>
        </Modal>
		</div>
  );
};
const SurveyCreate = injectIntl(Main);
const Sub = ({match}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  useEffect(() => {
    if(match.params.id){
      dispatch($changeItem(match.params.id));
    }else{
      dispatch($setNewItem());
    }
  }, []);
  const survey = useSelector(({ survey }) => survey);
  const searchCondition = useSelector(({ event }) => event.searchCondition);
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
           {survey.item ? (
              <h3 className="kt-subheader__title">
                 {survey.item.title}
              </h3>
            ) : survey.isloading ? (
              <h3 className="kt-subheader__title">Loading...</h3>
            ) 
           : (
              <h3 className="kt-subheader__title">New survey</h3>
            )}
          <span className="kt-subheader__separator kt-subheader__separator--v" />
          <span className="kt-subheader__desc"></span>
        </div>
        <div className="kt-subheader__toolbar">
          <div className="kt-subheader__wrapper">
            <NavLink
              className="btn kt-subheader__btn-primary  btn-primary MuiButton-root"
              aria-label="Back"
              title="Back"
              to={"/admin/survey"}
            >
              <span className="MuiButton-label">Back &nbsp;</span>
            </NavLink>
          </div>
        </div>
      </>
  );
}
const SubHeaderSurveyCreate = injectIntl(Sub);
export { SurveyCreate, SubHeaderSurveyCreate };

