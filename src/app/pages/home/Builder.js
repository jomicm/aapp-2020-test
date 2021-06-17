import React, { useMemo, useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import { get, merge } from "lodash";
import { FormHelperText, Switch, Tab, Tabs, TextField } from "@material-ui/core";
import { metronic, initLayoutConfig, LayoutConfig } from "../../../_metronic";
import {
  Portlet,
  PortletBody,
  PortletHeader,
  PortletHeaderToolbar
} from "../../partials/content/Portlet";

import ImageUpload from '../home/Components/ImageUpload';

const Builder = forwardRef(({ onChange, logoImage, setLogoImage, sideTitleValue, updateValues }, ref) => {
  const [tab, setTab] = useState(0);
  const dispatch = useDispatch();
  const { layoutConfig } = useSelector(
    ({ builder }) => ({ layoutConfig: builder.layoutConfig }),
    shallowEqual
  );
  const updateLayoutConfig = _config => {
    dispatch(metronic.builder.actions.setLayoutConfigs(_config));
    setTimeout(() => {
      window.location.reload();
    }, 900);
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

  const [layoutValues, setLayoutValues] = useState(initialValues);

  useEffect(() => {
    updateValues(layoutValues)
  }, [layoutValues])

  const formRef = useRef();

  useImperativeHandle(ref, () => ({
    values: formRef.current.values,
    update: (values) => updateLayoutConfig(values)
  }));

  return (
    <>
      <Formik
        innerRef={formRef}
        initialValues={initialValues}
        onSubmit={values => {
          updateLayoutConfig(values);
        }}
        onReset={() => {
          updateLayoutConfig(initLayoutConfig);
        }}
      >
        {({ values, handleChange, handleBlur }) => (
          <div className="kt-form kt-form--label-right">
            <Portlet>
              <PortletHeader
                toolbar={
                  <PortletHeaderToolbar className="PortletHeaderToolbar-Settings-Design-MainApp">
                    <div>
                      <Tabs
                        component="div"
                        className="builder-tabs"
                        value={tab}
                        onChange={(_, nextTab) => setTab(nextTab)}
                      >
                        <Tab label="Skins" />
                        <Tab label="Aside" />
                      </Tabs>
                    </div>
                  </PortletHeaderToolbar>
                }
              />

              {tab === 0 && (
                <PortletBody>
                  <div className="kt-section kt-margin-t-30">
                    <div className="kt-section__body">
                      <div className="form-group row">
                        <label className="col-lg-3 col-form-label">
                          Header Skin:
                        </label>
                        <div className="col-lg-9 col-xl-4">
                          <select
                            className="form-control"
                            name="header.self.skin"
                            onBlur={handleBlur}
                            value={get(values, "header.self.skin")}
                            onChange={(event) => {
                              setLayoutValues(prev => ({
                                ...prev,
                                header: {
                                  ...prev.header,
                                  self: {
                                    ...prev.header.self,
                                    skin: event.target.value
                                  }
                                }
                              }))
                              handleChange(event)
                            }}
                          >
                            <option value="light">Light (Default)</option>
                            <option value="dark">Dark</option>
                          </select>
                          <FormHelperText>Select header skin</FormHelperText>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-lg-3 col-form-label">
                          Header Menu Skin:
                        </label>
                        <div className="col-lg-9 col-xl-4">
                          <select
                            className="form-control"
                            name="header.menu.desktop.submenu.skin"
                            onBlur={handleBlur}
                            value={get(
                              values,
                              "header.menu.desktop.submenu.skin"
                            )}
                            onChange={(event) => {
                              setLayoutValues(prev => ({
                                ...prev,
                                header: {
                                  ...prev.header,
                                  menu: {
                                    ...prev.header.menu,
                                    desktop: {
                                      ...prev.header.menu.desktop,
                                      submenu: {
                                        ...prev.header.menu.desktop.submenu,
                                        skin: event.target.value
                                      }
                                    }
                                  }
                                }
                              }))
                              handleChange(event)
                            }}
                          >
                            <option value="light">Light (Default)</option>
                            <option value="dark">Dark</option>
                          </select>
                          <FormHelperText>
                            Select header menu skin
                          </FormHelperText>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-lg-3 col-form-label">
                          Logo Bar Skin:
                        </label>
                        <div className="col-lg-9 col-xl-4">
                          <select
                            className="form-control"
                            name="brand.self.skin"
                            onBlur={handleBlur}
                            value={get(values, "brand.self.skin")}
                            onChange={(event) => {
                              setLayoutValues(prev => ({
                                ...prev,
                                brand: {
                                  ...prev.brand,
                                  self: {
                                    ...prev.header.self,
                                    skin: event.target.value
                                  }
                                }
                              }))
                              handleChange(event)
                            }}
                          >
                            <option value="dark">Dark (Default)</option>
                            <option value="light">Light</option>
                          </select>
                          <FormHelperText>Select logo bar skin</FormHelperText>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-lg-3 col-form-label">
                          Aside Skin:
                        </label>
                        <div className="col-lg-9 col-xl-4">
                          <select
                            className="form-control"
                            name="aside.self.skin"
                            onBlur={handleBlur}
                            value={get(values, "aside.self.skin")}
                            onChange={(event) => {
                              setLayoutValues(prev => ({
                                ...prev,
                                aside: {
                                  ...prev.aside,
                                  self: {
                                    ...prev.aside.self,
                                    skin: event.target.value
                                  }
                                }
                              }))
                              handleChange(event)
                            }}
                          >
                            <option value="dark">Dark (Default)</option>
                            <option value="light">Light</option>
                          </select>
                          <FormHelperText>Select logo bar skin</FormHelperText>
                        </div>
                      </div>
                    </div>
                  </div>
                </PortletBody>
              )}

              {tab === 1 && (
                <PortletBody>
                  <div className="kt-section kt-margin-t-30">
                    <div className="kt-section__body">
                      <div className="form-group row">
                        <label className="col-lg-3 col-form-label pt-4">
                          Side Title:
                          </label>
                        <div className="col-lg-9 col-xl-4">
                          <TextField
                            style={{ width: '200px', alignSelf: 'centered' }}
                            value={sideTitleValue}
                            onChange={e => onChange(e.target.value)}
                            margin="normal"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <ImageUpload setImage={setLogoImage} image={logoImage}>
                    Logo SideBar Image
                  </ImageUpload>
                </PortletBody>
              )}

            </Portlet>
          </div>
        )}
      </Formik>
    </>
  );
});

export default Builder;
