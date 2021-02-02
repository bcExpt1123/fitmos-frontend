import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { injectIntl } from "react-intl";
import { makeStyles } from '@material-ui/core';
import { ListItemText, Select as MatSelect, Paper, Grid, Button, Checkbox, TextField, MenuItem, IconButton, FormControlLabel, Switch} from '@material-ui/core';
import { NavLink } from "react-router-dom";
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import {
  $saveItem,
  $updateItemValue,
  $updateItemImage,
  $setNewItem,
  $changeItem,
  $fetchCountries,
  $updateCountries,
} from "../../../modules/subscription/company";
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
		marginTop:"15px",
		minWidth: 120,
	},
	selectEmpty: {
    marginTop: theme.spacing(3),
  },
  button: {
    width:"20px",
    height:"20px",
  },
  textField: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  },
  margin: {
    margin: theme.spacing(1)
  },
  input: {
    display: 'none',
  },
}));
const Main = ({history}) =>{
  const classes = useStyles();
  const company = useSelector(({ company }) => company);
  console.log(company)
  const dispatch=useDispatch();
  useEffect(() => {
    dispatch($fetchCountries())
  }, []);// eslint-disable-line react-hooks/exhaustive-deps
  const item = company.item;
  const isloading = company.loading;
  const countryList = company.data;
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
  const handleChangeCheck = (event) => {
    dispatch($updateItemValue(event.target.name,event.target.checked));
  };
  const handleChangeSelect =(event) =>{
    console.log(event.target.value)
    if (event.target.value.indexOf('') > -1) {
      if (event.target.value[0] !== '') {
        event.target.value = [''];
      }
      else {
        if (event.target.value[1]) {
          event.target.value.shift();
        }
        else {
          event.target.value = [''];
        }
      }
    }
    console.log(event.target.value);
    dispatch($updateCountries(event.target.value));
  }
  return (
    <Paper className={classes.root} style={{ padding: "25px" }} >
      {item ? (
        <form
            id="company-form"
            onSubmit={handleOnSubmit}
            className={classes.root}
            autoComplete="off"
          >
            <Grid item container spacing={3}>
              <Grid item xs={4}>
                <TextField
                  required
                  id="username"
                  label="Username"
                  type="text"
                  margin="normal"
                  value={item.username}
                  onChange={handleChange("username")}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  required
                  id="standard-required"
                  label="Name"
                  className={classes.textField}
                  value={item.name}
                  margin="normal"
                  onChange={handleChange("name")}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  required
                  id="mail"
                  label="Mail"
                  value={item.mail}
                  margin="normal"
                  type="email"
                  onChange={handleChange("mail")}
                />
              </Grid>
            </Grid>
            <Grid item container spacing={3}>
              <Grid item xs={4}>
                <TextField
                  required
                  id="phone"
                  label="Phone"
                  type="number"
                  margin="normal"
                  value={item.phone}
                  onChange={handleChange("phone")}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="mobile_phone"
                  label="Mobile phone"
                  className={classes.textField}
                  value={item.mobile_phone}
                  margin="normal"
                  onChange={handleChange("mobile_phone")}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="website_url"
                  label="Website Url"
                  value={item.website_url}
                  margin="normal"
                  onChange={handleChange("website_url")}
                />
              </Grid>
            </Grid>
            <Grid item container spacing={3}>
              <Grid item xs={4}>
                <TextField
                  required
                  id="address"
                  label="Address"
                  type="text"
                  margin="normal"
                  value={item.address}
                  onChange={handleChange("address")}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="facebook"
                  label="Facebook"
                  className={classes.textField}
                  value={item.facebook}
                  margin="normal"
                  onChange={handleChange("facebook")}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="instagram"
                  label="Instagram"
                  value={item.instagram}
                  margin="normal"
                  onChange={handleChange("instagram")}
                />
              </Grid>
            </Grid>
            <Grid item container spacing={3}>
              <Grid item xs={4}>
                <TextField
                  id="twitter"
                  label="Twitter"
                  type="text"
                  margin="normal"
                  value={item.twitter}
                  onChange={handleChange("twitter")}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="horario"
                  label="Horario"
                  className={classes.textField}
                  value={item.horario}
                  margin="normal"
                  onChange={handleChange("horario")}
                />
              </Grid>
              <Grid item xs={8}>
              </Grid>
            </Grid>
            <Grid container  justify="center" spacing={3}>
              <Grid item  xs={3}>
                <FormControlLabel
                  value="bottom"
                  control={<Switch checked={company.item.all}
                  onChange={handleChangeCheck}
                  color="primary" />}
                  name="all"
                  label="All Countries"
                  labelPlacement="bottom"
                />
              </Grid>
              <Grid item xs={9}>
                {company.item.all===false&&(
                  <MatSelect
                    multiple
                    style={{ width: '70%' }}
                    name="country"
                    value={company.country}
                    variant="outlined"
                    onChange={handleChangeSelect}
                    renderValue={selected => selected.join(', ')}
                  >
                    {
                      countryList &&
                      countryList.map(country => (
                        <MenuItem key={country.id} value={country.long_name}>
                          <Checkbox checked={company.country.indexOf(country.long_name) > -1} />
                          <ListItemText primary={country.long_name} />
                        </MenuItem>
                      ))
                    }
                  </MatSelect>
                )} 
              </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs={7}>
                  <TextField
                    required
                    id="description"
                    label="Description"
                    multiline={true}
                    rows={16}
                    rowsMax={18}
                    onChange={handleChange("description")}
                    margin="normal"
                    variant="outlined"
                    value={item.description}
                  />
                </Grid>
                <Grid item xs={5}>
                  <Grid>
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
                      {(item.logo || state.file) && (
                        <label htmlFor="raised-button-file">
                          <IconButton color="primary" component="span" style={{marginTop:"30px"}}>
                            <PhotoCamera />
                          </IconButton>
                        </label>
                      )} 
                      <div className="uploaded-photo">
                        {state.file ? (
                          <img src={state.file} alt='prop' width="200px" />
                        ) : item.logo ? (
                          <img src={item.logo} alt='prop' width="200px" />
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
  )
};
const CompanyCreate = injectIntl(Main);
function Sub({match}) {
  const dispatch = useDispatch();
  const company = useSelector(({ company }) => company);
  useEffect(() => {
    if(match.params.id){
      console.log(22222)
      dispatch($changeItem(match.params.id));
      console.log(match.params.id);
      console.log('exist')
    }else{
      console.log(3333);
      dispatch($setNewItem());
      console.log('id not exist');
    }
  }, []);// eslint-disable-line react-hooks/exhaustive-deps
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
          {company.item.name ? (
              <h3 className="kt-subheader__title">
                 {company.item.name}
              </h3>
            ) 
           : (
              <h3 className="kt-subheader__title">New Company</h3>
            )}
        <span className="kt-subheader__separator kt-subheader__separator--v" />
        <span className="kt-subheader__desc">
        </span>
      </div>

      <div className="kt-subheader__toolbar">
        <div className="kt-subheader__wrapper">
          <Button
            className="btn kt-subheader__btn-primary btn-primary"
            form="company-form"
            type="submit"
            // disabled={shop.isSaving}
          >
            Submit &nbsp;
          </Button>
          <NavLink
            className="btn kt-subheader__btn-primary  btn-primary MuiButton-root"
            aria-label="Create"
            title="Back"
            to={"/admin/companies"}
          >
            <span className="MuiButton-label">Back&nbsp;</span>
          </NavLink>
        </div>
      </div>
    </>
  );
}
const SubHeaderCompanyCreate = injectIntl(Sub);
export { CompanyCreate, SubHeaderCompanyCreate };