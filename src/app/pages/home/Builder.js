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

const localStorageActiveTabKey = "builderActiveTab";
const Builder = forwardRef(({ onChange, logoImage, setLogoImage, sideTitleValue, updateValues }, ref) => {
  const activeTab = localStorage.getItem(localStorageActiveTabKey);
  const [tab, setTab] = useState(activeTab ? +activeTab : 0);
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
                        onChange={(_, nextTab) => {
                          setTab(nextTab);
                          localStorage.setItem(localStorageActiveTabKey, nextTab);
                        }}
                      >
                        <Tab label="Skins" />
                        <Tab label="Header" />
                        <Tab label="Subheader" />
                        <Tab label="Content" />
                        <Tab label="Aside" />
                        <Tab label="Footer" />
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
                        <label className="col-lg-3 col-form-label">
                          Fixed Desktop Header:
                        </label>
                        <div className="col-lg-9 col-xl-4">
                          <Switch
                            onBlur={handleBlur}
                            onChange={(event) => {
                              setLayoutValues(prev => ({
                                ...prev,
                                header: {
                                  ...prev.header,
                                  self: {
                                    ...prev.header.self,
                                    fixed: {
                                      ...prev.header.self.fixed,
                                      desktop: event.target.checked
                                    }
                                  }
                                }
                              }))
                              handleChange(event)
                            }}
                            name="header.self.fixed.desktop"
                            checked={get(values, "header.self.fixed.desktop")}
                          />
                          <FormHelperText>
                            Enable fixed header for mobile mode
                          </FormHelperText>
                        </div>
                      </div>

                      <div className="form-group row">
                        <label className="col-lg-3 col-form-label">
                          Mobile Fixed Header:
                        </label>
                        <div className="col-lg-9 col-xl-4">
                          <Switch
                            onBlur={handleBlur}
                            onChange={(event) => {
                              setLayoutValues(prev => ({
                                ...prev,
                                header: {
                                  ...prev.header,
                                  self: {
                                    ...prev.header.self,
                                    fixed: {
                                      ...prev.header.self.fixed,
                                      mobile: event.target.checked
                                    }
                                  }
                                }
                              }))
                              handleChange(event)
                            }}
                            name="header.self.fixed.mobile"
                            checked={get(values, "header.self.fixed.mobile")}
                          />
                          <FormHelperText>
                            Enable fixed header for mobile mode
                          </FormHelperText>
                        </div>
                      </div>

                      <div className="kt-separator kt-separator--space-lg kt-separator--border-dashed" />

                      <div className="form-group row">
                        <label className="col-lg-3 col-form-label">
                          Display Header Menu:
                        </label>
                        <div className="col-lg-9 col-xl-4">
                          <Switch
                            onBlur={handleBlur}
                            onChange={(event) => {
                              setLayoutValues(prev => ({
                                ...prev,
                                header: {
                                  ...prev.header,
                                  menu: {
                                    ...prev.header.menu,
                                    self: {
                                      ...prev.header.menu.self,
                                      display: event.target.checked
                                    }
                                  }
                                }
                              }))
                              handleChange(event)
                            }}
                            name="header.menu.self.display"
                            checked={get(values, "header.menu.self.display")}
                          />
                          <FormHelperText>Display header menu</FormHelperText>
                        </div>
                      </div>

                      <div className="form-group row">
                        <label className="col-lg-3 col-form-label">
                          Header Menu Layout:
                        </label>
                        <div className="col-lg-9 col-xl-4">
                          <select
                            className="form-control"
                            name="header.menu.self.layout"
                            onBlur={handleBlur}
                            value={get(values, "header.menu.self.layout")}
                            onChange={(event) => {
                              setLayoutValues(prev => ({
                                ...prev,
                                header: {
                                  ...prev.header,
                                  menu: {
                                    ...prev.header.menu,
                                    self: {
                                      ...prev.header.menu.self,
                                      layout: event.target.value
                                    }
                                  }
                                }
                              }))
                              handleChange(event)
                            }}
                          >
                            <option value="default">Default</option>
                            <option value="tab">Tab</option>
                          </select>
                          <FormHelperText>
                            Select header menu layout style
                          </FormHelperText>
                        </div>
                      </div>

                      <div className="kt-separator kt-separator--space-lg kt-separator--border-dashed" />

                      <div className="form-group row">
                        <label className="col-lg-3 col-form-label">
                          Header Menu Arrows:
                        </label>
                        <div className="col-lg-9 col-xl-4">
                          <Switch
                            onBlur={handleBlur}
                            onChange={(event) => {
                              setLayoutValues(prev => ({
                                ...prev,
                                header: {
                                  ...prev.header,
                                  menu: {
                                    ...prev.header.menu,
                                    self: {
                                      ...prev.header.menu.self,
                                      ["root-arrow"]: event.target.checked
                                    }
                                  }
                                }
                              }))
                              handleChange(event)
                            }}
                            name="header.menu.self.root-arrow"
                            checked={get(values, "header.menu.self.root-arrow")}
                          />
                          <FormHelperText>
                            Enable header menu root link arrows
                          </FormHelperText>
                        </div>
                      </div>
                    </div>
                  </div>
                </PortletBody>
              )}

              {tab === 2 && (
                <PortletBody>
                  <div className="kt-section kt-margin-t-30">
                    <div className="kt-section__body">
                      <div className="form-group row">
                        <label className="col-lg-3 col-form-label">
                          Display Subheader:
                        </label>
                        <div className="col-lg-9 col-xl-4">
                          <Switch
                            onBlur={handleBlur}
                            onChange={(event) => {
                              setLayoutValues(prev => ({
                                ...prev,
                                subheader: {
                                  ...prev.subheader,
                                  display: event.target.checked
                                }
                              }))
                              handleChange(event)
                            }}
                            name="subheader.display"
                            checked={get(values, "subheader.display")}
                          />
                          <FormHelperText>
                            Enable/Disable subheader
                          </FormHelperText>
                        </div>
                      </div>

                      <div className="form-group row">
                        <label className="col-lg-3 col-form-label">
                          Fixed Subheader:
                        </label>
                        <div className="col-lg-9 col-xl-4">
                          <Switch
                            onBlur={handleBlur}
                            onChange={(event) => {
                              setLayoutValues(prev => ({
                                ...prev,
                                subheader: {
                                  ...prev.subheader,
                                  fixed: event.target.checked
                                }
                              }))
                              handleChange(event)
                            }}
                            name="subheader.fixed"
                            checked={get(values, "subheader.fixed")}
                          />
                          <FormHelperText>
                            Enable fixed(sticky) subheader. Requires{" "}
                            <code>Solid</code> subheader style.
                          </FormHelperText>
                        </div>
                      </div>

                      <div className="form-group row">
                        <label className="col-lg-3 col-form-label">
                          Width:
                        </label>
                        <div className="col-lg-9 col-xl-4">
                          <select
                            className="form-control"
                            name="subheader.width"
                            onBlur={handleBlur}
                            value={get(values, "subheader.width")}
                            onChange={(event) => {
                              setLayoutValues(prev => ({
                                ...prev,
                                subheader: {
                                  ...prev.subheader,
                                  width: event.target.value
                                }
                              }))
                              handleChange(event)
                            }}
                          >
                            <option value="fluid">Fluid</option>
                            <option value="fixed">Fixed</option>
                          </select>
                          <FormHelperText>
                            Select layout width type
                          </FormHelperText>
                        </div>
                      </div>

                      <div className="form-group row">
                        <label className="col-lg-3 col-form-label">
                          Subheader Style:
                        </label>
                        <div className="col-lg-9 col-xl-4">
                          <select
                            className="form-control"
                            name="subheader.style"
                            onBlur={handleBlur}
                            value={get(values, "subheader.style")}
                            onChange={(event) => {
                              setLayoutValues(prev => ({
                                ...prev,
                                subheader: {
                                  ...prev.subheader,
                                  style: event.target.value
                                }
                              }))
                              handleChange(event)
                            }}
                          >
                            <option value="transparent">Transparent</option>
                            <option value="solid">Solid</option>
                          </select>
                          <FormHelperText>
                            Select subheader style
                          </FormHelperText>
                        </div>
                      </div>
                    </div>
                  </div>
                </PortletBody>
              )}

              {tab === 3 && (
                <PortletBody>
                  <div className="kt-section kt-margin-t-30">
                    <div className="kt-section__body">
                      <div className="form-group row">
                        <label className="col-lg-3 col-form-label">
                          Width:
                        </label>
                        <div className="col-lg-9 col-xl-4">
                          <select
                            className="form-control"
                            name="content.width"
                            onBlur={handleBlur}
                            value={get(values, "content.width")}
                            onChange={(event) => {
                              setLayoutValues(prev => ({
                                ...prev,
                                content: {
                                  ...prev.content,
                                  width: event.target.value
                                }
                              }))
                              handleChange(event)
                            }}
                          >
                            <option value="fluid">Fluid</option>
                            <option value="fixed">Fixed</option>
                          </select>
                          <FormHelperText>
                            Select layout width type
                          </FormHelperText>
                        </div>
                      </div>
                    </div>
                  </div>
                </PortletBody>
              )}

              {tab === 4 && (
                <PortletBody>
                  <div className="kt-section kt-margin-t-30">
                    <div className="kt-section__body">
                      <div className="form-group row">
                        <label className="col-lg-3 col-form-label">
                          Display:
                        </label>
                        <div className="col-lg-9 col-xl-4">
                          <Switch
                            onBlur={handleBlur}
                            onChange={(event) => {
                              setLayoutValues(prev => ({
                                ...prev,
                                aside: {
                                  ...prev.aside,
                                  self: {
                                    ...prev.aside.self,
                                    display: event.target.checked
                                  }
                                }
                              }))
                              handleChange(event)
                            }}
                            name="aside.self.display"
                            checked={get(values, "aside.self.display")}
                          />
                          <FormHelperText>Display aside menu</FormHelperText>
                        </div>
                      </div>

                      <div className="form-group row">
                        <label className="col-lg-3 col-form-label">
                          Fixed:
                        </label>
                        <div className="col-lg-9 col-xl-4">
                          <Switch
                            onBlur={handleBlur}
                            onChange={(event) => {
                              setLayoutValues(prev => ({
                                ...prev,
                                aside: {
                                  ...prev.aside,
                                  self: {
                                    ...prev.aside.self,
                                    fixed: event.target.checked
                                  }
                                }
                              }))
                              handleChange(event)
                            }}
                            name="aside.self.fixed"
                            checked={get(values, "aside.self.fixed")}
                          />
                          <FormHelperText>
                            Set fixed aside layout
                          </FormHelperText>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-lg-3 col-form-label">
                          Minimize:
                        </label>
                        <div className="col-lg-9 col-xl-4">
                          <Switch
                            onBlur={handleBlur}
                            onChange={(event) => {
                              setLayoutValues(prev => ({
                                ...prev,
                                aside: {
                                  ...prev.aside,
                                  self: {
                                    ...prev.aside.self,
                                    minimize: {
                                      ...prev.aside.self.minimize,
                                      toggle: event.target.checked
                                    }
                                  }
                                }
                              }))
                              handleChange(event)
                            }}
                            name="aside.self.minimize.toggle"
                            checked={get(values, "aside.self.minimize.toggle")}
                          />
                          <FormHelperText>
                            Allow aside minimizing
                          </FormHelperText>
                        </div>
                      </div>

                      <div className="form-group row">
                        <label className="col-lg-3 col-form-label">
                          Default Minimize:
                        </label>
                        <div className="col-lg-9 col-xl-4">
                          <Switch
                            onBlur={handleBlur}
                            onChange={(event) => {
                              setLayoutValues(prev => ({
                                ...prev,
                                aside: {
                                  ...prev.aside,
                                  self: {
                                    ...prev.aside.self,
                                    minimize: {
                                      ...prev.aside.self.minimize,
                                      default: event.target.checked
                                    }
                                  }
                                }
                              }))
                              handleChange(event)
                            }}
                            name="aside.self.minimize.default"
                            checked={get(values, "aside.self.minimize.default")}
                          />
                          <FormHelperText>
                            Set aside minimized by default
                          </FormHelperText>
                        </div>
                      </div>

                      <div className="form-group row">
                        <label className="col-lg-3 col-form-label pt-4">
                          Submenu Toggle:
                        </label>
                        <div className="col-lg-9 col-xl-4">
                          {" "}
                          <select
                            className="form-control"
                            name="aside.menu.dropdown"
                            onBlur={handleBlur}
                            value={get(
                              values,
                              "aside.menu.dropdown"
                            ).toString()}
                            onChange={(event) => {
                              setLayoutValues(prev => ({
                                ...prev,
                                aside: {
                                  ...prev.aside,
                                  menu: {
                                    ...prev.aside.menu,
                                    dropdown: event.target.value
                                  }
                                }
                              }))
                              handleChange(event)
                            }}
                          >
                            <option value="true">Dropdown</option>
                            <option value="false">Accordion</option>
                          </select>
                          <FormHelperText>
                            Select submenu toggle mode (works only when{" "}
                            <code>Fixed Mode</code> is disabled)
                          </FormHelperText>
                        </div>
                      </div>
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

              {tab === 5 && (
                <PortletBody>
                  <div className="kt-section kt-margin-t-30">
                    <div className="kt-section__body">
                      <div className="form-group row">
                        <label className="col-lg-3 col-form-label">
                          Fixed Footer:
                        </label>
                        <div className="col-lg-9 col-xl-4">
                          <Switch
                            onBlur={handleBlur}
                            onChange={(event) => {
                              setLayoutValues(prev => ({
                                ...prev,
                                footer: {
                                  ...prev.footer,
                                  self: {
                                    ...prev.footer.self,
                                    fixed: event.target.checked
                                  }
                                }
                              }))
                              handleChange(event)
                            }}
                            name="footer.self.fixed"
                            checked={get(values, "footer.self.fixed")}
                          />

                          <FormHelperText>Set fixed footer</FormHelperText>
                        </div>
                      </div>

                      <div className="form-group row">
                        <label className="col-lg-3 col-form-label">
                          Width:
                        </label>
                        <div className="col-lg-9 col-xl-4">
                          <select
                            className="form-control"
                            name="footer.self.width"
                            onBlur={handleBlur}
                            value={get(values, "footer.self.width")}
                            onChange={(event) => {
                              setLayoutValues(prev => ({
                                ...prev,
                                footer: {
                                  ...prev.footer,
                                  self: {
                                    ...prev.footer.self,
                                    width: event.target.value
                                  }
                                }
                              }))
                              handleChange(event)
                            }}
                          >
                            <option value="fluid">Fluid</option>
                            <option value="fixed">Fixed</option>
                          </select>
                          <FormHelperText>
                            Select layout width type
                          </FormHelperText>
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
});

export default Builder;
