import React, { Component } from "react";
import { useParams } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { withRouter } from "react-router";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import IconButton from "@material-ui/core/IconButton";
import {
  $setNewItem,
  $saveItem,
  $updateItemValue,
  $changeItem,
  $updateItemImage,
} from "../../../modules/subscription/event";


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

class Main extends Component {
  //function Main({item,isloading})
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.handleCapture = this.handleCapture.bind(this);
    this.classes = this.useStyles();
    this.state = { file:"" };
  }
  handleOnSubmit = e => {
    e.preventDefault();
    if (this.props.item.image == "" && this.state.file == "") {
      alert("Please upload image");
      return false;
    }
    this.props.$saveItem(this.props.history);
    return false;
  }
  handleCapture({ target }) {
    let file = URL.createObjectURL(target.files[0]);
    this.setState({ file });
    this.props.$updateItemImage(target.files);
  }
  handleChange(name) {
    return event => {
      this.props.$updateItemValue(name, event.target.value);
    };
  }
  useStyles() {
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
  }
  render() {
    return (
      <Paper className={this.classes.root} style={{ padding: "25px" }}>
        {this.props.item ? (
          <form
            id="event-form"
            onSubmit={this.handleOnSubmit}
            className={this.classes.root}
            autoComplete="off"
          >
            <Grid container spacing={3}>
              <Grid item xs={8}>
                <TextField
                  required
                  id="title"
                  label="Title"
                  error={this.props.errors.title.length === 0 ? false : true}
                  helperText={this.props.errors.title}
                  className={this.classes.textField}
                  value={this.props.item.title}
                  onChange={this.handleChange("title")}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl className={"MuiFormControl-marginNormal"}>
                  <InputLabel id="category_id-label">Category</InputLabel>
                  <Select
                    labelId="category_id-label"
                    id="category_id"
                    value={this.props.item.category_id || ""}
                    onChange={this.handleChange("category_id")}
                  >
                    {this.props.categories.map(row => (
                      <MenuItem value={row.id} key={row.id}>{row.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={8}>
                <InputLabel id="description-label">Description</InputLabel>
                <CKEditor
                  editor={ClassicEditor}
                  data={this.props.item.description}
                  onInit={editor => {
                    // You can store the "editor" and use when it is needed.
                    editor.setData( this.props.item.description );
                    //console.log("Editor is ready to use!", editor);
                  }}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    this.props.$updateItemValue('description', data);
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
                  className={this.classes.input}
                  style={{ display: "none" }}
                  id="raised-button-file"
                  multiple
                  type="file"
                  onChange={this.handleCapture}
                />
                <div className="admin-upload-image">
                  {(this.props.item.image || this.state.file) && (
                    <label htmlFor="raised-button-file">
                      <IconButton color="primary" component="span">
                        <PhotoCamera />
                      </IconButton>
                    </label>
                  )}

                  <div className="uploaded-photo">
                    {this.state.file ? (
                      <img src={this.state.file} width="200px" />
                    ) : this.props.item.image ? (
                      <img src={this.props.item.image} width="200px" />
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
        ) : this.props.isloading ? (
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
}
const mapStateToProps = state => ({
  item: state.event.item,
  errors: state.event.errors,
  categories: state.event.categories,
  isloading: state.event.isloading
});
const mapDispatchToProps = {
  $updateItemValue,
  $saveItem,
  $updateItemImage
};
const EventCreate = injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(withRouter(Main))
);

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
                Event {this.props.item.name}
              </h3>
            ) : this.props.isloading ? (
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
              type="button"
              className="btn kt-subheader__btn-primary btn-primary"
              form="event-form"
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
  item: state.event.item,
  isSaving: state.event.isSaving
});
const mapDispatchToPropsSub = {
  $changeItem,
  $setNewItem
};
const SubHeaderEventCreate = injectIntl(
  connect(mapStateToPropsSub, mapDispatchToPropsSub)(withRouter(Sub))
);
export { EventCreate, SubHeaderEventCreate };
