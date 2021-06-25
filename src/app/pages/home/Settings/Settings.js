/* eslint-disable no-restricted-imports */
import React, { useMemo, useState } from "react";
import { connect, shallowEqual, useDispatch, useSelector } from "react-redux";
import { Formik, } from "formik";
import { merge } from "lodash";
import { Tabs } from "@material-ui/core";
import { metronic, initLayoutConfig, LayoutConfig } from "../../../../_metronic";
import {
  Portlet,
  PortletBody,
  PortletHeader,
  PortletHeaderToolbar
} from "../../../partials/content/Portlet";

// AApp Components
import { TabsTitles } from '../Components/Translations/tabsTitles';

//DB API methods
import ModalYesNo from '../Components/ModalYesNo';

// Settings Tabs
import {
  General,
  Groups,
  Design,
  LayoutsPresets,
  Fields,
  Custom,
  Users,
  Processes
} from './settings-tabs';

function Settings({ user }) {
  const [tab, setTab] = useState(0);
  const dispatch = useDispatch();
  const { layoutConfig } = useSelector(
    ({ builder }) => ({ layoutConfig: builder.layoutConfig }),
    shallowEqual
  );

  const permissions = user.profilePermissions.settings || [];

  const updateLayoutConfig = _config => {
    dispatch(metronic.builder.actions.setLayoutConfigs(_config));
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const initialValues = useMemo(
    () =>
      merge(
        // Fulfill changeable fields.
        LayoutConfig,
        layoutConfig
      ),
    [layoutConfig]
  );

  const [selectReferenceConfirmation, setSelectReferenceConfirmation] = useState(false);

  return (
    <>
      <ModalYesNo
        showModal={selectReferenceConfirmation}
        onOK={() => setSelectReferenceConfirmation(false)}
        onCancel={() => setSelectReferenceConfirmation(false)}
        title={'Add New Asset'}
        message={'Please first select a Reference from the next tab'}
      />
      <Formik
        initialValues={initialValues}
        onSubmit={values => {
          updateLayoutConfig(values);
        }}
        onReset={() => {
          updateLayoutConfig(initLayoutConfig);
        }}
      >
        {({ values, handleReset, handleSubmit, handleChange, handleBlur }) => (
          <div className="kt-form kt-form--label-right">
            <Portlet>
              <PortletHeader
                toolbar={
                  <PortletHeaderToolbar>
                    <Tabs
                      component="div"
                      className="builder-tabs"
                      value={tab}
                      onChange={(_, nextTab) => setTab(nextTab)}
                    >
                      {TabsTitles('settings')}
                    </Tabs>
                  </PortletHeaderToolbar>
                }
              />
              {/* Settings - General Tab */}
              {tab === 0 && (
                <PortletBody>
                  <div className="kt-section kt-margin-t-0">
                    <div className="kt-section__body">
                      <div className="kt-section">
                        <div className="kt-section__content">
                          <General permissions={permissions} />
                        </div>
                      </div>
                    </div>
                  </div>
                </PortletBody>
              )}
              {/* Settings - Design Tab */}
              {tab === 1 && (
                <PortletBody>
                  <div className="kt-section kt-margin-t-0">
                    <div className="kt-section__body">
                      <div className="kt-section">
                        <div className="kt-section__content">
                          <Design permissions={permissions} />
                        </div>
                      </div>
                    </div>
                  </div>
                </PortletBody>
              )}
              {/* Settings - Layouts&Presets Tab */}
              {tab === 2 && (
                <PortletBody>
                  <div className="kt-section kt-margin-t-0">
                    <div className="kt-section__body">
                      <div className="kt-section">
                        <div className="kt-section__content">
                          <LayoutsPresets />
                        </div>
                      </div>
                    </div>
                  </div>
                </PortletBody>
              )}
              {/* Settings - Fields Tab */}
              {tab === 3 && (
                <PortletBody>
                  <div className="kt-section kt-margin-t-0">
                    <div className="kt-section__body">
                      <div className="kt-section">
                        <div className="kt-section__content">
                          <Fields permissions={permissions} />
                        </div>
                      </div>
                    </div>
                  </div>
                </PortletBody>
              )}
              {/* Settings - Custom Tab */}
              {tab === 4 && (
                <PortletBody>
                  <div className="kt-section kt-margin-t-0">
                    <div className="kt-section__body">
                      <div className="kt-section">
                        <div className="kt-section__content">
                          <Custom />
                        </div>
                      </div>
                    </div>
                  </div>
                </PortletBody>
              )}
              {/* Settings - Users Tab */}
              {tab === 5 && (
                <PortletBody>
                  <div className="kt-section kt-margin-t-0">
                    <div className="kt-section__body">
                      <div className="kt-section">
                        <div className="kt-section__content">
                          <Users />
                        </div>
                      </div>
                    </div>
                  </div>
                </PortletBody>
              )}
              {/* Settings - Processes Tab */}
              {tab === 6 && (
                <PortletBody>
                  <div className="kt-section kt-margin-t-0">
                    <div className="kt-section__body">
                      <div className="kt-section">
                        <div className="kt-section__content">
                          <Processes permissions={permissions} />
                        </div>
                      </div>
                    </div>
                  </div>
                </PortletBody>
              )}
               {/* Settings - Groups Tab */}
               {tab === 7 && (
                <PortletBody>
                  <div className="kt-section kt-margin-t-0">
                    <div className="kt-section__body">
                      <div className="kt-section">
                        <div className="kt-section__content">
                          <Groups permissions={permissions} />
                        </div>
                      </div>
                    </div>
                  </div>
                </PortletBody>
              )}
            </Portlet>
          </div>
        )}
      </Formik>
    </>
  );
}

const mapStateToProps = ({ auth: { user } }) => ({
  user
});
export default connect(mapStateToProps)(Settings);
