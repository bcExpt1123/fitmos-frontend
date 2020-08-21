import React, { Component,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { injectIntl } from "react-intl";
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
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import {Dialog} from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SaveIcon from '@material-ui/icons/Save';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
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
  $selectOptionSave,
  $selectOptionItem,
  $deleteSelectItem,
  $selectOptionItemSave,
  $editOptionItem,
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
    padding:"10px",
    borderRadius:"10px",
  },
  select:{
    marginTop:"10px",
    marginBottom:"10px",
    background: '#e0e0e0',
    paddingLeft: '5px',
    borderRadius:"5px",
  },
  boxfont:{
    fontSize:'15px',
    color:'black',
  },
  dialog: {
    position: 'absolute',
    width:'350px',
    top: 50
  },
}));
const Main = ({history}) =>{
  const classes=useStyles();
  const dispatch=useDispatch();
  const [valueTitle, setValueTitle] = React.useState(false);
  const [option, setOption] = React.useState({
    selectText:[],
    selectTextValue:'',
    focus:false,
    save:false,
    editIndex:'',
  });
  const [value,setValue] = React.useState({
    optionId:'',
    inputValue:'',
    flag:false,
  });
  const survey = useSelector(({ survey }) => survey);
  console.log(survey)
  useEffect(() => { dispatch($fetchIndexItem()) }, []);
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
    setOpen(false);
  };
  const handleChange = name =>event => {
    if(name=='option_label'){
      setOption({...option,selectTextValue:event.target.value});
      setValue({...value,inputValue:event.target.value});
    }
    dispatch($updateItemValue(name, event.target.value));
  }
  const actionEdit = id => event => { 
    dispatch($editItem(id));
    setOpen(true);
    setValue({...value,inputValue:''});
  };
  const actionDeleteItem = id => event => {
    if (window.confirm("Are you sure to delete this item?")) dispatch($deleteItem(id));
  };
  const initialItem = (event) =>{
    dispatch($initial());
    setOpen(true);
    setOption({selectText:[],selectTextValue:'',focus:false,save:false,editIndex:''});
  };
  const addOption = (event) =>{
    if(option.save==true){
      const array = option.selectText;
      array[option.editIndex]=[option.selectTextValue];
      setOption({ ...option,selectText:array,save:false,selectTextValue:''});
    }
    else{
      if(option.selectTextValue){
        const optionArray = option.selectText;
        optionArray.push(survey.item.option_label);
        setOption({ ...option,selectText: optionArray,selectTextValue:''});
      }
      else{
        alert('Please enter option!');
      }
    }
  }
  const editOption =list =>event =>{
    const array = option.selectText;
    const indexElement =  array.indexOf(list);
    setOption({...option,selectTextValue:list,save:true,editIndex:indexElement});
  }
  const deleteOption = list => event =>{
    if (window.confirm("Are you sure to delete this item?")){
      const array = option.selectText;
      const index =  array.indexOf(list);
      const newArray = array.splice(index,1);
      setOption({...option,selectTextValue:'',save:false});
    }
  }
  console.log(option);
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const selectOptionSave =(event) =>{
    setOpen(false);
    dispatch($selectOptionItem(option.selectText));
    dispatch($selectOptionSave());
  }
  const actionDeleteSelectItem = id => event =>{
    if (window.confirm("Are you sure to delete this item?")) dispatch($deleteSelectItem(id));
  };
  const actionSaveSelectItem = event=>{
    dispatch($selectOptionItemSave());
    setValue({...value,inputValue:''});
  }
  const actionEditSelectItem = (id,option_label) =>event =>{
    setValue({optionId:id, inputValue:option_label,flag:true});
    console.log(id,option_label)
  }
  const actionEditOptionItem =(event) =>{
    dispatch($editOptionItem(value.optionId,value.inputValue));
    setValue({...value,inputValue:'',flag:false});
  }
  console.log(value);
  return(
		<div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={4}>
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
        <Grid item xs={8}>
          <Paper className={classes.paper}>
            {item?(
              <Box className={classes.surveyItem} display="flex" justifyContent="flex-end">
                {item.id?(
                  <Button variant="contained"
                  aria-label="create"
                  title="create"
                  color="secondary"
                  onClick={initialItem}
                  style={{fontSize:"13px",marginTop:"20px",marginBottom:"20px"}}
                  ><NoteAddIcon/>&nbsp;&nbsp;Create
                  </Button>
                ):(
                  <h3></h3>
                )}
              </Box>
            ):(
              <h3>OK</h3>
            )}
            <Box className={classes.scrolldisplay}>
              {surveyData != null &&
                surveyData.map(row => (
                <Box xs={12} key={row.id} className={classes.boxstyle} display="flex" flexDirection="column">
                  <Box display="flex" flexDirection="row" justifyContent="space-around" alignItems="center">
                    <Box alignItems="center" flexGrow={1} className={classes.boxfont} style={{textAlign:'left'}}>{row.label}</Box>
                    <Box alignItems="center"  style={{width:"50px", textAlign:'center',color:'white',padding:'2px',background:'#5d78ff'}}>{row.question}</Box>
                    <Box alignItems="center"  >
                      <Tooltip title="Edit">
                        <IconButton aria-label="edit"  className={classes.icon} onClick={actionEdit(row.id)}>
                          <EditIcon   color="secondary"/>
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Box alignItems="center">
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
      <div>
        {displayItem!=null&&(
          <Dialog 
            open={open} 
            onClose={handleClose} 
            aria-labelledby="form-dialog-title" 
            classes={{paper: classes.dialog}}
          >
            <DialogTitle id="form-dialog-title"></DialogTitle>
            <DialogContent>
              <Box display="flex" justifyContent="space-around">
                <TextField 
                  required 
                  id="text" 
                  label="Question" 
                  variant="outlined"
                  type="text"
                  className={classes.mg} 
                  defaultValue={displayItem.label} 
                  fullWidth
                  onChange={handleChange("question")}
                />
              </Box>  
              <Box display="flex"  
                justifyContent="space-around" 
                style={{margin:"20px",marginTop:"30px"}}
                onChange={handleChange("radio")}>
                <RadioGroup row aria-label="position" name="position" defaultValue="top" defaultValue={displayItem.question} className={classes.mg}>
                  <FormControlLabel id="level" value="level" control={<Radio color="primary" />} label="level" />
                  <FormControlLabel id="text" value="text" control={<Radio color="primary"/>} label="text" />
                  <FormControlLabel id="select" value="select" control={<Radio color="primary"/>} label="select" />
                </RadioGroup>
              </Box>
              {(displayItem.question=='select'||survey.item.radio=='select')?(
                <>
                <Box display="flex" justifyContent="space-around">
                {(!survey.data_display_item.id)?(
                  <>
                    <TextField 
                      required 
                      id="text" 
                      label="Option" 
                      variant="outlined"
                      type="text"
                      onChange={handleChange("option_label")}
                      className={classes.mg} 
                      fullWidth
                      value={option.selectTextValue}
                    />
                    <IconButton 
                      color="primary" 
                      onClick={addOption}>
                      {option.save==false?(
                      <AddCircleOutlineIcon/>
                      ):(
                        <SaveIcon/>
                      )}
                    </IconButton>
                  </>
                ):(
                  <>
                    <TextField 
                      required 
                      id="text" 
                      label="Option" 
                      variant="outlined"
                      type="text"
                      onChange={handleChange("option_label")}
                      className={classes.mg} 
                      value={value.inputValue}
                      fullWidth
                    />
                    {value.flag==false?(
                      <IconButton 
                        color="primary" 
                        onClick={actionSaveSelectItem}>
                        <AddCircleOutlineIcon/>
                      </IconButton>
                    ):(
                      <IconButton 
                        color="primary" 
                        onClick={actionEditOptionItem}>
                        <SaveIcon/>
                      </IconButton>
                    )}
                  </>
                )}
                </Box>
               {!survey.data_display_item.id&&option.selectText&&option.selectText.map((list) => (
                <Box xs={12} key={list}  className={classes.select} display="flex" flexDirection="column">
                  <Box display="flex" flexDirection="row" justifyContent="space-around" alignItems="center">
                    <Box alignItems="center" flexGrow={1} className={classes.boxfont} style={{textAlign:'left',fontSize:'12px'}}>{list}</Box>
                    <Box alignItems="center"  >
                        <IconButton aria-label="selectEdit" data={list} onClick={editOption(list)}  className={classes.icon}>
                          <EditIcon   color="secondary" />
                        </IconButton>
                    </Box>
                    <Box>
                        <IconButton aria-label="selectDelete" className={classes.icon} onClick={deleteOption(list)} >
                          <DeleteIcon   color="error"/>
                        </IconButton>
                    </Box>
                  </Box>
                </Box>
                ))}
                <>
                {survey.data_display_item.id&&survey.selectOptionData != null &&
                survey.selectOptionData.map(row => (
                <Box xs={12} key={row.id} className={classes.select} display="flex" flexDirection="column">
                  <Box display="flex" flexDirection="row" justifyContent="space-around" alignItems="center">
                    <Box alignItems="center" flexGrow={1} className={classes.boxfont} style={{textAlign:'left',fontSize:'12px'}}>{row.option_label}</Box>
                    <Box alignItems="center"  >
                        <IconButton aria-label="selectEdit" className={classes.icon} onClick={actionEditSelectItem(row.id,row.option_label)}>
                          <EditIcon   color="secondary" />
                        </IconButton>
                    </Box>
                    <Box>
                        <IconButton aria-label="selectDelete" className={classes.icon} onClick={actionDeleteSelectItem(row.id)}>
                          <DeleteIcon   color="error"/>
                        </IconButton>
                    </Box>
                  </Box>
                </Box>
                ))}
                </>
                </>
                ):(<></>)}
              </DialogContent>
            <DialogActions>
              {(!survey.data_display_item.id&&(displayItem.question=='select'||survey.item.radio=='select'))?(
                <Button
                color="secondary"
                onClick={selectOptionSave}
                >Save     
                </Button>
              ):(
                <Button 
                  color="secondary"
                  onClick={actionSurveyItemSave}>
                  Save
                </Button>
              )}
              <Button 
                color="primary"
                onClick={handleClose}> 
                Close
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </div>
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

