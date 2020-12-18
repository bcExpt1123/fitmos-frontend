import React, { Component, useState, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router";
import { useHistory } from "react-router-dom";
import { injectIntl } from "react-intl";
import { makeStyles, withStyles } from "@material-ui/core";
import { Button, Paper, TextField, Grid, InputLabel, IconButton } from "@material-ui/core";
import LocalMovies from "@material-ui/icons/LocalMovies";
import {Rating,Autocomplete} from '@material-ui/lab';
import FavoriteIcon from '@material-ui/icons/Brightness1';
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Player, ControlBar } from 'video-react';
import "video-react/dist/video-react.css";
import {
  $setNewItem,
  $saveItem,
  $updateItemValue,
  $changeItem,
  actionTypes
} from "../../../modules/subscription/shortcode";
import { set } from "lodash";
const StyledRating = withStyles({
  iconFilled: {
    color: 'red',
  },
  iconHover: {
    color: '#ff3d47',
  },
})(Rating);
const useStyles = ()=> {
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
    },
    input: {
      width: 200,
    },  
  }));
}
function Main() {
  const item = useSelector(({ shortcode }) => shortcode.item);
  const errors = useSelector(({ shortcode }) => shortcode.errors);
  const isloading = useSelector(({ shortcode }) => shortcode.isloading);
  const shortcodeList = useSelector(({ shortcode }) => shortcode.all);
  const dispatch=useDispatch();
  const history = useHistory();
  const [file, setFile] = useState(false);
  const [alternateA, setAlternateA] = useState("");
  const [alternateB, setAlternateB] = useState("");
  const classes = useStyles();
  const handleOnSubmit = e => {
    e.preventDefault();
    dispatch($saveItem(history));
    return false;
  };
  const handleChange = (name)=> {
    return event => {
      if(name=="alternate_a")console.log(event.target.value)
      dispatch($updateItemValue(name, event.target.value));
    };
  }
  const handleCapture = ({ target }) => {
    if(file){
      setFile(false);  
    }
    setTimeout(()=>{
      const video = URL.createObjectURL(target.files[0]);
      setFile(video);
    },1)
    // dispatch($updateItemImage(target.files));
  }
  const onSelect = (name,item) => {
    if(item && item.id){
      dispatch($updateItemValue(name, item.id));
    }else{
    }
  }
  const filterLabel = (id)=>{
    let shortcode;
    if(shortcodeList) shortcode = shortcodeList.find((item)=>parseInt(item.id) === parseInt(id))
    if(shortcode)return shortcode.name;
    return "";
  }
  useEffect(()=>{
    dispatch({type:actionTypes.SHORTCODE_UPDATE_LIST});
  },[])
  useEffect(()=>{
    if(item&&item.alternate_a)setAlternateA(filterLabel(item.alternate_a));
    else setAlternateA(filterLabel(""));
    if(item&&item.alternate_b)setAlternateB(filterLabel(item.alternate_b));
    else setAlternateB(filterLabel(""));
  },[shortcodeList])
  const workout = process.env.REACT_APP_WORKOUT;
  return (
    <Paper className={classes.root} style={{ padding: "25px" }}>
      {item ? (
        <form
          id="shortcode-form"
          onSubmit={handleOnSubmit}
          className={classes.root}
          autoComplete="off"
        >
          <Grid container spacing={3}>
          {workout==='update'?
            <>
              <Grid container item xs={8} spacing={2}>
                <Grid item xs={3}>
                  <TextField
                    required
                    id="name"
                    label="Name"
                    error={errors.name.length === 0 ? false : true}
                    helperText={errors.name}
                    className={classes.textField}
                    value={item.name}
                    onChange={handleChange("name")}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    required
                    id="time"
                    label="Time"
                    type="number"
                    className={classes.textField}
                    value={item.time}
                    onChange={handleChange("time")}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={3}>
                  <InputLabel id="instruction-label" className="mt-4">Difficultty</InputLabel>
                  <StyledRating
                    name="customized-color"
                    value={item.level}
                    onChange={handleChange("level")}
                    getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
                    precision={1}
                    icon={<FavoriteIcon fontSize="inherit" />}
                  />                    
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    required
                    id="level"
                    label="Level"
                    select
                    className={classes.textField}
                    value={item.level}
                    onChange={handleChange("level")}
                    margin="normal"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </TextField>
                </Grid>
                <Grid item xs={3}>
                  {shortcodeList&&
                    <Autocomplete
                      id="alternate_a"
                      inputValue={alternateA}
                      onInputChange={(event, newInputValue) => {
                        setAlternateA(newInputValue)
                      }}
                      options={shortcodeList}
                      onChange={(evt,value)=>{onSelect('alternate_a',value)}}
                      getOptionLabel={(option) => option.name}
                      getOptionSelected={(option) => option.id === item.alternate_a}
                      renderInput={(params) => <TextField {...params} label="Alternate Mov. A" margin="normal" />}
                    />                  
                  }
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    id="multiplier_a"
                    label="Multiplier"
                    type="number"
                    className={classes.textField}
                    value={item.multipler_a}
                    onChange={handleChange("multipler_a")}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={3}>
                  {shortcodeList&&
                    <Autocomplete
                      id="alternate_b"
                      inputValue={alternateB}
                      onInputChange={(event, newInputValue) => {
                        setAlternateB(newInputValue)
                      }}
                      options={shortcodeList}
                      onChange={(evt,value)=>{onSelect('alternate_b',value)}}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => <TextField {...params} label="Alternate Mov. B" margin="normal" />}
                    />            
                  }      
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    id="multiplier_b"
                    label="Multiplier"
                    type="number"
                    className={classes.textField}
                    value={item.multipler_b}
                    onChange={handleChange("multipler_b")}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel id="instruction-label">Instructions</InputLabel>
                  <CKEditor
                    editor={ClassicEditor}
                    data={item.instruction}
                    onInit={editor => {
                      // You can store the "editor" and use when it is needed.
                      editor.setData( item.instruction );
                      //console.log("Editor is ready to use!", editor);
                    }}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      dispatch($updateItemValue('instruction', data));
                    }}
                  />
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <input
                  accept="video/*"
                  className={classes.input}
                  style={{ display: "none" }}
                  id="raised-button-file"
                  multiple
                  type="file"
                  onChange={handleCapture}
                />
                <div className="admin-upload-video">
                  {(item.video_url || file) && (
                    <label htmlFor="raised-button-file">
                      <IconButton color="primary" component="span">
                        <LocalMovies />
                      </IconButton>
                    </label>
                  )}

                  <div className="uploaded-photo">
                    {file ? (
                      <Player
                        autoPlay
                      >
                        <source src={file} />
                      </Player>
                    ) : item.video_url ? (
                      <Player
                        autoPlay
                      >
                        <source src={item.video_url} />
                      </Player>
                    ) : (
                          <label htmlFor="raised-button-file">
                            <IconButton color="primary" component="span">
                              <LocalMovies />
                            </IconButton>
                          </label>
                        )}
                  </div>
                </div>                
              </Grid>
            </>
            :
            <>
              <Grid item xs={6}>
                <TextField
                  required
                  id="name"
                  label="Name"
                  error={errors.name.length === 0 ? false : true}
                  helperText={errors.name}
                  className={classes.textField}
                  value={item.name}
                  onChange={handleChange("name")}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  id="link"
                  label="Link"
                  error={errors.link.length === 0 ? false : true}
                  helperText={errors.link}
                  className={classes.textField}
                  value={item.link}
                  onChange={handleChange("link")}
                  margin="normal"
                />
              </Grid>
            </>
          }
          </Grid>
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
    </Paper>
  );
}
const ShortcodeCreate = injectIntl(Main);

class Sub extends Component {
  componentDidMount() {
    this.id = this.props.match.params.id;
    if (this.id) this.props.$changeItem(this.id);
    else this.props.$setNewItem();
  }
  render() {
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
          {this.id ? (
            this.props.item ? (
              <h3 className="kt-subheader__title">
                Shortcode {this.props.item.code}
              </h3>
            ) : this.props.isloading ? (
              <h3 className="kt-subheader__title">Loading...</h3>
            ) : (
              <h3 className="kt-subheader__title">There is no item</h3>
            )
          ) : (
            <h3 className="kt-subheader__title">New Shortcode</h3>
          )}
          <span className="kt-subheader__separator kt-subheader__separator--v" />
          <span className="kt-subheader__desc"></span>
        </div>

        <div className="kt-subheader__toolbar">
          <div className="kt-subheader__wrapper">
            <Button
              className="btn kt-subheader__btn-primary btn-primary"
              form="shortcode-form"
              type="submit"
              disabled={this.props.isSaving}
            >
              Submit &nbsp;
            </Button>
            <Button
              type="button"
              className="btn kt-subheader__btn-primary btn-primary"
              onClick={this.props.history.goBack}
            >
              Back &nbsp;
            </Button>
          </div>
        </div>
      </>
    );
  }
}
const mapStateToPropsSub = state => ({
  item: state.shortcode.item,
  isSaving: state.shortcode.isSaving
});
const mapDispatchToPropsSub = {
  $changeItem,
  $setNewItem
};
const SubHeaderShortcodeCreate = injectIntl(
  connect(mapStateToPropsSub, mapDispatchToPropsSub)(withRouter(Sub))
);
export { ShortcodeCreate, SubHeaderShortcodeCreate };