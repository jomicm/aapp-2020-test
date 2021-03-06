import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import clsx from 'clsx';
import { TextField } from '@material-ui/core';
import * as auth from '../../store/ducks/auth.duck';
import { loginReal } from '../../crud/auth.crud';
import { hosts } from '../home/utils';

const { apiHost, localHost } = hosts;

function Login(props) {
  const { intl } = props;
  const [loading, setLoading] = useState(false);
  const [loadingButtonStyle, setLoadingButtonStyle] = useState({
    paddingRight: '2.5rem'
  });

  const enableLoading = () => {
    setLoading(true);
    setLoadingButtonStyle({ paddingRight: '3.5rem' });
  };

  const disableLoading = () => {
    setLoading(false);
    setLoadingButtonStyle({ paddingRight: '2.5rem' });
  };

  return (
    <>
      <div className='kt-login__body'>
        <div className='kt-login__form'>
          <div className='kt-login__title'>
            <h3>
              {/* https://github.com/formatjs/react-intl/blob/master/docs/Components.md#formattedmessage */}
              <FormattedMessage id='AUTH.LOGIN.TITLE' />
            </h3>
          </div>

          <Formik
            initialValues={{
              // email: 'admin@demo.com',
              // password: 'demo'
              // email: 'one@one.com',
              // password: 'one'
              email: '',
              password: ''
            }}
            validate={values => {
              const errors = {};

              if (!values.email) {
                // https://github.com/formatjs/react-intl/blob/master/docs/API.md#injection-api
                errors.email = intl.formatMessage({
                  id: 'AUTH.VALIDATION.REQUIRED_FIELD'
                });
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = intl.formatMessage({
                  id: 'AUTH.VALIDATION.INVALID_FIELD'
                });
              }

              if (!values.password) {
                errors.password = intl.formatMessage({
                  id: 'AUTH.VALIDATION.REQUIRED_FIELD'
                });
              }

              return errors;
            }}
            onSubmit={(values, { setStatus, setSubmitting }) => {
              enableLoading();
              setTimeout(() => {
                // loginReal(values.email, values.password)
                const { email: user, password } = values;
                loginReal('user', { user, password })
                  // .then(({ data: { accessToken } }) => {
                  .then(response => response.json())
                  // .then(({response: { accessToken }}) => {
                  .then(({ response }) => {
                    disableLoading();
                    const { accessToken, email, fileExt, id, profilePermissions, selectedBoss: boss } = response;
                    localStorage.setItem('accessToken', accessToken);
                    // global.token = accessToken;
                    const pic = fileExt ?
                      `${apiHost}/uploads/user/${id}.${fileExt}` :
                      `${localHost}/media/misc/placeholder-image.jpg`;
                    // const pic = 'https://i2.wp.com/float8ion.com/wp-content/uploads/2015/12/random-user-31.jpg';
                    const user = {
                      accessToken,
                      boss,
                      email,
                      fullname: `${response.name} ${response.lastName}`,
                      id,
                      lastName: response.lastName,
                      name: response.name,
                      pic,
                      profilePermissions
                    };
                    props.fulfillUser(user);
                  })
                  .catch((err) => {
                    console.log('err:', err)
                    disableLoading();
                    setSubmitting(false);
                    setStatus(
                      intl.formatMessage({
                        id: 'AUTH.VALIDATION.INVALID_LOGIN'
                      })
                    );
                  });
              }, 0);
            }}
          >
            {({
              values,
              status,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting
            }) => (
              <form
                noValidate={true}
                autoComplete='off'
                className='kt-form'
                onSubmit={handleSubmit}
              >
                {status ? (
                  <div role='alert' className='alert alert-danger'>
                    <div className='alert-text'>{status}</div>
                  </div>
                ) : (
                  <>
                    {/* <div role='alert' className='alert alert-info'>
                    <div className='alert-text'>
                      Use account <strong>admin@demo.com</strong> and password{' '}
                      <strong>demo</strong> to continue.
                    </div>
                  </div> */}
                  </>
                )}

                <div className='form-group'>
                  <TextField
                    type='email'
                    label='Email'
                    margin='normal'
                    className='kt-width-full'
                    name='email'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    helperText={touched.email && errors.email}
                    error={Boolean(touched.email && errors.email)}
                  />
                </div>

                <div className='form-group'>
                  <TextField
                    type='password'
                    margin='normal'
                    label='Password'
                    className='kt-width-full'
                    name='password'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    helperText={touched.password && errors.password}
                    error={Boolean(touched.password && errors.password)}
                  />
                </div>

                <div className='kt-login__actions'>
                  <Link
                    to='/auth/forgot-password'
                    className='kt-link kt-login__link-forgot'
                  >
                    <FormattedMessage id='AUTH.GENERAL.FORGOT_BUTTON' />
                  </Link>

                  <button
                    id='kt_login_signin_submit'
                    type='submit'
                    disabled={isSubmitting}
                    className={`btn btn-primary btn-elevate kt-login__btn-primary ${clsx(
                      {
                        'kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light': loading
                      }
                    )}`}
                    style={loadingButtonStyle}
                  >
                    Sign In
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}

export default injectIntl(
  connect(
    null,
    auth.actions
  )(Login)
);
