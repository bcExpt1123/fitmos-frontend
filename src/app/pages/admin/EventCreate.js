import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { injectIntl } from "react-intl";
import { makeStyles } from "@material-ui/core";
import { Button, Paper, InputLabel, MenuItem, FormControl, TextField, Select, Grid, IconButton, Checkbox, FormControlLabel} from "@material-ui/core";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import {
  $setNewItem,
  $saveItem,
  $updateItemValue,
  $changeItem,
  $updateItemImage,
} from "../../../modules/subscription/event";

const useStyles = makeStyles( theme => ({
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
function Main({history}) {
  const classes = useStyles();
  const event = useSelector(({ event }) => event);
  const dispatch=useDispatch();
  const item = event.item;
  const errors = event.errors;
  const isloading = event.loading;
  const categories = event.categories;
  const [state,setState] = React.useState({file:""});
  const handleOnSubmit = e => {
    e.preventDefault();
    if (item.image === "" && state.file === "") {
      alert("Please upload image");
      return false;
    }
    dispatch($saveItem(history));
    return false;
  }
  const handleCapture = ({ target }) => {
    const file = URL.createObjectURL(target.files[0]);
    setState({ file });
    dispatch($updateItemImage(target.files));
  }
  const handleChange = (name) => {
    return event => {
      dispatch($updateItemValue(name, event.target.value));
    };
  }
  const handleChangeImmediate = (e) => {
    if(item.immediate){
      dispatch($updateItemValue('immediate', false));
      const today =  new Date();
      let month = today.getMonth()+1;
      if(month<10)month = '0'+month;
      let day = today.getDate();
      if(day<10)day = '0'+day;
      dispatch($updateItemValue('date', today.getFullYear()+'-'+month+'-'+day));
      let hour = today.getHours();
      if(hour<10)hour = '0'+hour;
      let minute = today.getMinutes();
      if(minute<10)minute = '0'+minute;
      dispatch($updateItemValue('datetime', hour+':'+minute));
    }else{
      dispatch($updateItemValue('immediate', true));
    }
  } 
  return (
    <Paper className={classes.root} style={{ padding: "25px" }}>
      {item ? (
        <form
          id="event-form"
          onSubmit={handleOnSubmit}
          className={classes.root}
          autoComplete="off"
        >
          <Grid container spacing={3}>
            <Grid item xs={5}>
              <TextField
                required
                id="title"
                label="Title"
                error={errors.title.length === 0 ? false : true}
                helperText={errors.title}
                className={classes.textField}
                value={item.title}
                onChange={handleChange("title")}
                margin="normal"
              />
            </Grid>
            <Grid item xs={3}>
              <FormControl className={"MuiFormControl-marginNormal"}>
                <InputLabel id="category_id-label">Category</InputLabel>
                <Select
                  labelId="category_id-label"
                  id="category_id"
                  value={item.category_id || ""}
                  onChange={handleChange("category_id")}
                >
                  {categories.map(row => (
                    <MenuItem value={row.id} key={row.id}>{row.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4} className="mt-3">
              <FormControlLabel
                control={
                  <Checkbox checked={item.immediate} onChange={handleChangeImmediate} value="true" />
                }
                label="Immediately"
              />
              {item.immediate===false&&(
                <>
                  <TextField
                    id="publish-date"
                    label="Published date"
                    type="date"
                    value={item.date}
                    className={classes.textField}
                    onChange={handleChange("date")}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    id="publish-time"
                    label=" "
                    type="time"
                    value={item.datetime}
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={handleChange("datetime")}
                    inputProps={{
                      step: 300, // 5 min
                    }}
                  />    
                </>              
              )}
            </Grid>
            <Grid item xs={8}>
              <InputLabel id="description-label">Description</InputLabel>
              <CKEditor
                editor={ClassicEditor}
                data={item.description}
                onInit={editor => {
                  // You can store the "editor" and use when it is needed.
                  editor.setData( item.description );
                  //console.log("Editor is ready to use!", editor);
                }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  dispatch($updateItemValue('description', data));
                }}
                onBlur={(event, editor) => {
                  console.log("Blur.", editor);
                }}
                onFocus={(event, editor) => {
                  console.log("Focus.", editor);
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <input
                accept="image/*"
                className={classes.input}
                style={{ display: "none" }}
                id="raised-button-file"
                multiple
                type="file"
                onChange={handleCapture}
              />
              <div className="admin-upload-image">
                {(item.image || state.file) && (
                  <label htmlFor="raised-button-file">
                    <IconButton color="primary" component="span">
                      <PhotoCamera />
                    </IconButton>
                  </label>
                )}

                <div className="uploaded-photo">
                  {state.file ? (
                    <img src={state.file} alt='img' width="200px" />
                  ) : item.image ? (
                    <img src={item.image} alt='img' width="200px" />
                  ) : (
                        <label htmlFor="raised-button-file">
                          <IconButton color="primary" component="span">
                            <PhotoCamera />
                          </IconButton>
                        </label>
                      )}
                </div>
              </div>
            </Grid>
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
const EventCreate = injectIntl(Main);

function Sub({match,history}) {
  const dispatch = useDispatch();
  useEffect(() => {
    if(match.params.id){
      dispatch($changeItem(match.params.id));
    }else{
      dispatch($setNewItem());
    }
  }, []);// eslint-disable-line react-hooks/exhaustive-deps
  const event = useSelector(({ event }) => event);
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
          {event.id ? (
            event.item ? (
              <h3 className="kt-subheader__title">
                Event {event.item.name}
              </h3>
            ) : event.isloading ? (
              <h3 className="kt-subheader__title">Loading...</h3>
            ) : (
                  <h3 className="kt-subheader__title">There is no item</h3>
                )
          ) : (
              <h3 className="kt-subheader__title">New Event</h3>
            )}
          <span className="kt-subheader__separator kt-subheader__separator--v" />
          <span className="kt-subheader__desc"></span>
        </div>

        <div className="kt-subheader__toolbar">
          <div className="kt-subheader__wrapper">
            <Button
              className="btn kt-subheader__btn-primary btn-primary"
              form="event-form"
              type="submit"
              disabled={event.isSaving}
            >
              Submit &nbsp;
            </Button>
            <Button
              type="button"
              className="btn kt-subheader__btn-primary btn-primary"
              onClick={history.goBack}
            >
              Back &nbsp;
            </Button>
          </div>
        </div>
      </>
    );
}
const SubHeaderEventCreate = injectIntl(Sub);
export { EventCreate, SubHeaderEventCreate };
