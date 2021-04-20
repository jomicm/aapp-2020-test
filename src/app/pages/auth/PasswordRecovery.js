import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TextField } from "@material-ui/core";
import './PasswordRecovery.scss';

const PasswordRecovery = (props) => {
  const [status, setStatus] = useState({
    open: false,
    message: ''
  });

  const regex = new RegExp(props.regex || /\d+/, 'g');

  const [values, setValues] = useState({
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = () => {
    setStatus({
      open: true,
      message: 'Your Password was changed correctly, please return to the Login'
    })
  };

  
  const disableSubmitButton = () => {
    if(!(values.password && values.confirmPassword && values.password === values.confirmPassword) || status.open){
      return true;
    } 
    return false;
  };

  const launchError = () => {
    if(values.password.length){
      //This Console.log is necessary, if not the function doesn't work properly
      console.log('regex:', !regex.test(values.password) )
      return !regex.test(values.password);
    }
    return false;
  };

  const handleChange = valueName => event => {
    if(!event || !event.target) return;
    const value = event.target.value;
    setValues(prev => ({
      ...prev,
      [valueName]: value
    }));
  };
  return (
    <>
      <div className='PR-loginTitle'>
          <h3>
            Password Recovery
          </h3>
      </div>
      <div className='PR-form-wrapper'>
        {status.open && (
          <div role="alert" className='PR-alert' >
            <div>{status.message}</div>
          </div>
        )}
        <div className='PR-textfield-wrapper'>
          <TextField
            type="password"
            margin="normal"
            label="Password"
            className="kt-width-full"
            name="password"
            onChange={handleChange('password')}
            value={values.password}
            helperText={!regex.test(values.password) && values.password ? 'Please include at least one digit' : ''}
            error={launchError()}
            disabled={status.open}
          />
        </div>
        <div className='PR-textfield-wrapper'>
          <TextField
            type="password"
            margin="normal"
            label="Confirm Password"
            className="kt-width-full"
            name="confirmPassword"
            onChange={handleChange('confirmPassword')}
            value={values.confirmPassword}
            helperText={ values.password && values.confirmPassword && (values.password !== values.confirmPassword) ? 'Please verify that both passwords are the same' : ''}
            error={values.password && values.confirmPassword && (values.password !== values.confirmPassword)}
            disabled={status.open}
          />
        </div>
        <div className='PR-buttons-wrapper'>
          <Link to="/auth">
            <button type="button" className="btn btn-secondary btn-elevate kt-login__btn-secondary" stlye={{margin: '20px'}}>
              Login
            </button>
          </Link>

          <button
            disabled={disableSubmitButton()}
            className="btn btn-primary btn-elevate"
            stlye={{margin: '20px'}}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  )
}

export default PasswordRecovery;
