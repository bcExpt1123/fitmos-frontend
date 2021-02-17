import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { injectIntl } from "react-intl";
import { makeStyles } from "@material-ui/core";
import { Button, Paper, InputLabel, MenuItem, FormControl, TextField, Select, Grid, IconButton, Checkbox, FormControlLabel} from "@material-ui/core";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import { compose } from "recompose";
import { InfoWindow, withGoogleMap, withScriptjs, GoogleMap, Marker } from 'react-google-maps';
import {
  $setNewItem,
  $saveItem,
  $updateItemValue,
  $changeItem,
  $updateItemImage,
} from "../../../modules/subscription/evento";

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
const Map = compose(
  withScriptjs,
  withGoogleMap
)
  (props =>
      <GoogleMap
          defaultZoom={8}
          defaultCenter={{ lat: props.markerPosition===null?8.93:props.markerPosition.lat, lng: props.markerPosition===null?-79.66:props.markerPosition.lng }}
          onClick={props.onMapClick}
      >
          {props.isMarkerShown && <Marker position={props.markerPosition} />}

      </GoogleMap>
  )
function Main({match,history}) {
  const classes = useStyles();
  const evento = useSelector(({ evento }) => evento);
  const dispatch=useDispatch();
  const item = evento.item;
  const errors = evento.errors;
  const isloading = evento.loading;
  const [files, setFiles] = useState([]);
  const [firstLoading, setFirstLoading] = useState(false);
  const handleOnSubmit = e => {
    e.preventDefault();
    if(item.latitude === null){
      alert("Please set map marker");
      return false;
    }
    if(item.description === ""){
      alert("Please add description");
      return false;
    }
    // if (item.image === "" && state.file === "") {
    //   alert("Please upload image");
    //   return false;
    // }
    dispatch($saveItem(history));
    return false;
  }
  const handleCapture = ({ target }) => {
    let clonedFiles = [...files];
    const timestamp = (new Date()).getTime();
    if(files.length+target.files.length>50){
      alert("You can't upload over 50");
      return;
    }
    target.files.forEach((file, index) => {
      const type = file.type.includes('image')?"image":"video";
      const url = URL.createObjectURL(file);
      const item = {id:'i'+(index + timestamp),url, type, file }
      clonedFiles.push(item);
    });
    setFiles(clonedFiles);
    dispatch($updateItemImage(clonedFiles));
  }
  const handleChange = (name) => {
    return evento => {
      dispatch($updateItemValue(name, evento.target.value));
    };
  }
  const handleMapClick = (e)=>{
    dispatch($updateItemValue('longitude', e.latLng.lng()));
    dispatch($updateItemValue('latitude', e.latLng.lat()));
    return {
      markerPosition: e.latLng,
      isMarkerShown:true
    }    
  }
  const deleteMedia = (deleteFile)=>{
    const deletedFiles = files.filter(file=>deleteFile.id !==file.id);
    setFiles(deletedFiles);
    dispatch($updateItemImage(deletedFiles));
  }
  useEffect(()=>{
    if(!firstLoading && evento.item){
      if(evento.item.id ){
        if(evento.item.id == match.params.id ){
          setFiles(evento.item.images);
          dispatch($updateItemImage(evento.item.images));
          setFirstLoading(true);
        }
      }else{
        setFiles([]);
        dispatch($updateItemImage([]));
        setFirstLoading(true);
      }
    }
  },[evento.item]);// eslint-disable-line react-hooks/exhaustive-deps  
  return (
    <Paper className={classes.root} style={{ padding: "25px" }}>
      {item ? (
        <form
          id="evento-form"
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
              <TextField
                required
                id="address"
                label="Address"
                error={errors.address.length === 0 ? false : true}
                helperText={errors.address}
                className={classes.textField}
                value={item.address}
                onChange={handleChange("address")}
                margin="normal"
              />
            </Grid>
            <Grid item xs={4} className="mt-3">
              <TextField
                required
                id="done-date"
                label="Evento date"
                type="date"
                value={item.date}
                className={classes.textField}
                onChange={handleChange("date")}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                id="done-time"
                required
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
            </Grid>
            <Grid item xs={8}>
              <InputLabel id="google-map">Map</InputLabel>
              <div>
                <Map
                  googleMapURL={"https://maps.googleapis.com/maps/api/js?key="+process.env.REACT_APP_GOOGLE_MAP_KEY}
                  loadingElement={<div style={{ height: `100%` }} />}
                  containerElement={<div style={{ height: `400px` }} />}
                  mapElement={<div style={{ height: `100%` }} />}
                  isMarkerShown={item.latitude===null?false:true}
                  markerPosition={item.latitude===null?null:{ lat: parseFloat(item.latitude), lng: parseFloat(item.longitude) }}
                  onMapClick = {handleMapClick}
                />
              </div>              
              <InputLabel id="description-label">Description</InputLabel>
              <CKEditor
                editor={ClassicEditor}
                data={item.description}
                onInit={editor => {
                  // You can store the "editor" and use when it is needed.
                  editor.setData( item.description );
                  //console.log("Editor is ready to use!", editor);
                }}
                onChange={(evento, editor) => {
                  const data = editor.getData();
                  dispatch($updateItemValue('description', data));
                }}
                onBlur={(evento, editor) => {
                  console.log("Blur.", editor);
                }}
                onFocus={(evento, editor) => {
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
                <label htmlFor="raised-button-file">
                  <IconButton color="primary" component="span">
                    <PhotoCamera />
                  </IconButton>
                </label>                  
                <div className="uploaded-photo">
                  {files && files.map((file, index)=>(
                    <div key={index}>
                      <img src={file.url} alt="image" />
                      <div className="actions cursor-pointer" onClick={()=>deleteMedia(file)}>
                        <div>
                          <i className="fas fa-times" />
                        </div>
                      </div>
                    </div>        
                  ))}  
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
const EventoCreate = injectIntl(Main);

function Sub({match,history}) {
  const dispatch = useDispatch();
  useEffect(() => {
    if(match.params.id){
      dispatch($changeItem(match.params.id));
    }else{
      dispatch($setNewItem());
    }
  }, []);// eslint-disable-line react-hooks/exhaustive-deps
  const evento = useSelector(({ evento }) => evento);
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
            evento.item ? (
              <h3 className="kt-subheader__title">
                Evento {evento.item.title}
              </h3>
            ) : evento.isloading ? (
              <h3 className="kt-subheader__title">Loading...</h3>
            ) : (
                  <h3 className="kt-subheader__title">There is no item</h3>
                )
          ) : (
              <h3 className="kt-subheader__title">New Evento</h3>
            )}
          <span className="kt-subheader__separator kt-subheader__separator--v" />
          <span className="kt-subheader__desc"></span>
        </div>

        <div className="kt-subheader__toolbar">
          <div className="kt-subheader__wrapper">
            <Button
              className="btn kt-subheader__btn-primary btn-primary"
              form="evento-form"
              type="submit"
              disabled={evento.isSaving}
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
const SubHeaderEventoCreate = injectIntl(Sub);
export { EventoCreate, SubHeaderEventoCreate };