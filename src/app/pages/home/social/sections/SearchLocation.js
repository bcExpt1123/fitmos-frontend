import React,{ useState, useEffect, useMemo } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
// import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash/throttle';
import { http } from "../../services/api";

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
}));

export default function SearchLocation() {
  const classes = useStyles();
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const fetch = useMemo(
    () =>
      throttle((request, callback) => {
        http({
          path: false,
          httpUrl:`https://nominatim.openstreetmap.org/search?q=${request.input}&format=json&addressdetails=1`,
          method: "GET",
        }).then(response => callback(response.data));
      }, 20),
    [],
  );

  useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }
    fetch({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <Autocomplete
      id="openstreetmap"
      style={{ width: 300, height:300 }}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.display_name)}
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      onChange={(event, newValue) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label="Add a location" variant="outlined" fullWidth />
      )}
      renderOption={(option) => {
        console.log(option)
        // const matches = option.structured_formatting.main_text_matched_substrings;
        // const parts = parse(
        //   option.structured_formatting.main_text,
        //   matches.map((match) => [match.offset, match.offset + match.length]),
        // );
        const parts = [];
        return (
          <Grid container alignItems="center">
            <Grid item>
              <LocationOnIcon className={classes.icon} />
            </Grid>
            <Grid item xs>
              {parts.map((part, index) => (
                <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                  {part.text}
                </span>
              ))}

              <Typography variant="body2" color="textSecondary">
                {option.display_name}
              </Typography>
            </Grid>
          </Grid>
        );
      }}
    />
  );
}