import React from "react";
import classnames from "classnames";
import DatePicker from 'react-mobile-datepicker';
import {isMobile,isIOS,isSafari} from '../../../../../_metronic/utils/utils';

//import trackVirtualPageImpression from '../../../../../lib/trackVirtualPageImpression';

const getDate = ({ ago, start = false, end = false }) => {
  const date = new Date();
  if (start) {
    date.setDate(1);
    date.setMonth(0);
  } else if (end) {
    date.setDate(31);
    date.setMonth(11);
  }
  date.setFullYear(date.getFullYear() - ago);
  return date.toISOString().substr(0, 10); // return only date part in format YYYY-MM-DD
};

// for now it's only hint for date picker, not real validation
const birthdayRange = {
  min: getDate({ ago: 100, start: true }), // maximum 100 years old
  max: getDate({ ago: 10, end: true }) // minimum 10 years old
};
const heightRanges = {
  cm: { min: 130, max: 250 },
  in: { min: 52, max: 98 }
};
const weightRanges = {
  kg: { min: 40, max: 150 },
  lbs: { min: 85, max: 350 }
};

const cmToIn = value =>
  value ? Math.round(value / 2.54) : heightRanges.in.min;

const inToCm = value =>
  value ? Math.round(value * 2.54) : heightRanges.cm.min;

const normalize = (value, { min, max }) => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

const formatHeightInFeet = value => {
  const feet = Math.floor(value / 12);
  const inches = value % 12;

  if (feet > 0) {
    return `${feet}' ${inches}"`;
  }
  return `${inches}`;
};

const heightInFeetOptions = [
  ...Array(heightRanges.in.max - heightRanges.in.min + 1).keys()
]
  .map(i => i + heightRanges.in.min)
  .map(height => (
    <option key={height} value={height} className={"form-select-option"}>
      {formatHeightInFeet(height)}
    </option>
  ));

const FormGroup = ({
  labelFor,
  labelName,
  focused,
  dirty,
  touched,
  hasValue,
  valid,
  children
}) => {
  const classes = classnames("form-group", {
    focused: focused,
    blured: !focused,
    hasValue: hasValue,
    valid: valid,
    invalid: !valid,
    dirty: dirty,
    touched: touched
  });

  return (
    <div className={classes}>
      <label htmlFor={labelFor} className={"form-label"}>
        {labelName}
      </label>
      <div className={"form-control"}>{children}</div>
    </div>
  );
};

class StepInfo extends React.Component {
  constructor(props) {
    super(props);

    // we need those refs only for browser's native validtion
    this.formRef = React.createRef();
    this.inputRefs = {
      birthday: React.createRef(),
      height: React.createRef(),
      weight: React.createRef()
    };
    this.state = {
      // get initial state from parent
      ...props.info,

      // form input fields states
      focused: {},
      dirty: {},
      touched: {},
      time: new Date('2000-01-01'),
		  isOpen: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleHeightUnitChange = this.handleHeightUnitChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.handleOpenDatePicker = this.handleOpenDatePicker.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    //trackVirtualPageImpression('personal-details');

    this.validateForm();
  }
  handleOpenDatePicker(){
    this.setState({ isOpen: true });
  }
  handleCancel(){
    this.setState({ isOpen: false });
  }
  handleSelect = (time) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    let dayString = time.toLocaleDateString(
      "fr-CA",
      options
    );
    this.setState({ time, isOpen: false,birthday:dayString });
	}
  handleSubmit(event) {
    event.preventDefault();

    const isValid = this.formRef.current.reportValidity
      ? this.formRef.current.reportValidity()
      : true;

    if (isValid) {
      this.props.onSubmit({
        info: {
          birthday: this.state.birthday,
          height: this.state.height,
          heightUnit: this.state.heightUnit,
          weight: this.state.weight,
          weightUnit: this.state.weightUnit
        }
      });
    }
  }

  handleChange(event) {
    const { name, value } = event.target;
    // set new state and revalidate form after state is set
    // this handles the case when we switch ranges for weight inputs
    this.setState(
      state => ({
        [name]: value,
        dirty: {
          ...state.dirty,
          [name]: true
        }
      }),
      () => this.validateForm()
    );
  }

  handleHeightUnitChange(event) {
    const { value } = event.target;

    this.setState(
      state => ({
        touched: {
          ...state.touched,
          height: true
        },
        height:
          value === "in"
            ? normalize(cmToIn(state.height), heightRanges.in)
            : normalize(inToCm(state.height), heightRanges.cm),
        heightUnit: value
      }),
      () => this.validateForm()
    );
  }

  handleFocus(event) {
    const { name } = event.target;
    this.setState({
      focused: {
        [name]: true
      }
    });
  }

  handleBlur(event) {
    const { name } = event.target;
    this.setState(state => ({
      focused: {},
      touched: {
        ...state.touched,
        [name]: true
      }
    }));
  }

  validateForm() {
    if (this.formRef.current) {
      this.formRef.current.checkValidity();
      this.forceUpdate(); // force update to re-render validity state
    }
  }

  render() {
    const dateConfig = {
      'date': {
        format: 'DD',
        caption: 'Day',
        step: 1,
      },
      'month': {
        format: 'MM',
        caption: 'Mon',
        step: 1,
      },
      'year': {
          format: 'YYYY',
          caption: 'Year',
          step: 1,
      },
    };
    return (
      <main className="row justify-content-md-center">
        <div className="col-12 col-lg-2"></div>
        <div className="col-12 col-lg-8">
          <header>
            <h1>Datos</h1>
            <div>
              Calcularemos tu índice de masa corporal y edad para dar
              seguimiento a tu progreso y medir tus resultados.
            </div>
          </header>
          <form
            onSubmit={this.handleSubmit}
            ref={this.formRef}
            className="info-form auth-form"
          >
            <FormGroup
              focused={this.state.focused.height}
              dirty={this.state.dirty.height}
              touched={this.state.touched.height}
              hasValue={Boolean(this.state.height)}
              valid={
                this.inputRefs.height.current &&
                this.inputRefs.height.current.validity.valid
              }
              labelFor="height"
              labelName={"Altura"}
            >
              {this.state.heightUnit === "cm" ? (
                <input
                ref={this.inputRefs.height}
                className={"form-input"}
                id="height"
                type="number"
                pattern="[0-9]+(\.[0-9]*)?"
                required
                min={heightRanges.cm.min}
                max={heightRanges.cm.max}
                name="height"
                value={this.state.height}
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
              />
              ) : (
                <select
                  ref={this.inputRefs.height}
                  className={"form-input"}
                  id="height"
                  type="select"
                  required
                  name="height"
                  value={this.state.height}
                  onChange={this.handleChange}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                >
                  {heightInFeetOptions}
                </select>
              )}
              <select
                className={"form-select"}
                name="heightUnit"
                value={this.state.heightUnit}
                onChange={this.handleHeightUnitChange}
                tabIndex="-1"
              >
                <option value="cm">cm</option>
                <option value="in">ft</option>
              </select>
            </FormGroup>

            <FormGroup
              focused={this.state.focused.weight}
              dirty={this.state.dirty.weight}
              touched={this.state.touched.weight}
              hasValue={Boolean(this.state.weight)}
              valid={
                this.inputRefs.weight.current &&
                this.inputRefs.weight.current.validity.valid
              }
              labelFor="weight"
              labelName={"Peso"}
            >
              <input
                ref={this.inputRefs.weight}
                className={"form-input"}
                id="weight"
                type="number"
                required
                min={weightRanges[this.state.weightUnit].min}
                max={weightRanges[this.state.weightUnit].max}
                name="weight"
                value={this.state.weight}
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
              />
              <select
                className={"form-select"}
                name="weightUnit"
                value={this.state.weightUnit}
                onChange={this.handleChange}
                tabIndex="-1"
              >
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
              </select>
            </FormGroup>
            <FormGroup
              focused={this.state.focused.birthday}
              dirty={this.state.dirty.birthday}
              touched={this.state.touched.birthday}
              hasValue={Boolean(this.state.birthday)}
              valid={
                this.inputRefs.birthday.current &&
                this.inputRefs.birthday.current.validity.valid
              }
              labelFor="birthday"
              labelName={"Fecha de nacimiento"}
            >
              {isMobile()?(
                isIOS()?(
                //   <input
                //   ref={this.inputRefs.birthday}
                //   className={"form-input"}
                //   id="birthday"
                //   type="date"
                //   required
                //   min={birthdayRange.min}
                //   max={birthdayRange.max}
                //   pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" // in case date field is not supported
                //   placeholder="yyyy-mm-dd"
                //   name="birthday"
                //   value={this.state.birthday}
                //   onChange={this.handleChange}
                //   onFocus={this.handleFocus}
                //   onBlur={this.handleBlur}
                // />
<>
                  {!this.state.isOpen&&
                    <input
                      ref={this.inputRefs.birthday}
                      className={"form-input"}
                      id="birthday"
                      type="input"
                      required
                      pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" // in case date field is not supported
                      placeholder="yyyy-mm-dd"
                      name="birthday"
                      value={this.state.birthday}
                      onFocus={this.handleOpenDatePicker}
                      onChange={this.handleChange}
                    />
                  }
                  <DatePicker
                    value={this.state.time}
                    isOpen={this.state.isOpen}
                    confirmText={'Confirmar'}
                    min={new Date(1900, 0, 1)}
                    value={new Date(2000, 0, 1)} 
                    cancelText={'Cancelar'}
                    dateConfig={dateConfig}
                    onSelect={this.handleSelect}
                    onCancel={this.handleCancel} />
                </>                ):(
                  <>
                  {!this.state.isOpen&&
                    <input
                      ref={this.inputRefs.birthday}
                      className={"form-input"}
                      id="birthday"
                      type="date"
                      required
                      min={birthdayRange.min}
                      max={birthdayRange.max}
                      pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" // in case date field is not supported
                      placeholder="yyyy-mm-dd"
                      name="birthday"
                      value={this.state.birthday}
                      onFocus={this.handleOpenDatePicker}
                      onChange={this.handleChange}
                    />
                  }
                  <DatePicker
                    value={this.state.time}
                    isOpen={this.state.isOpen}
                    confirmText={'Confirmar'}
                    min={new Date(1900, 0, 1)}
                    value={new Date(2000, 0, 1)} 
                    cancelText={'Cancelar'}
                    dateConfig={dateConfig}
                    onSelect={this.handleSelect}
                    onCancel={this.handleCancel} />
                </>
                )
              ):(
                isSafari()?(
                  <input
                  ref={this.inputRefs.birthday}
                  className={"form-input"}
                  id="birthday"
                  type="text"
                  required
                  min={birthdayRange.min}
                  max={birthdayRange.max}
                  pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" // in case date field is not supported
                  placeholder="yyyy-mm-dd"
                  name="birthday"
                  value={this.state.birthday}
                  onChange={this.handleChange}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                />  
                ):(
                  <input
                  ref={this.inputRefs.birthday}
                  className={"form-input"}
                  id="birthday"
                  type="date"
                  required
                  min={birthdayRange.min}
                  max={birthdayRange.max}
                  pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" // in case date field is not supported
                  placeholder="yyyy-mm-dd"
                  name="birthday"
                  value={this.state.birthday}
                  onChange={this.handleChange}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                />  
                )
              )}
            </FormGroup>

            <button type="submit" className="fs-btn">
              SIGUIENTE
            </button>
          </form>
        </div>
        <div className="col-12 col-lg-2"></div>
      </main>
    );
  }
}

export default StepInfo;
