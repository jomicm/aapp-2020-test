import React from "react";
import Divider from "@material-ui/core/Divider";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import FormAccordion from "./components/FormAccordion";
import BaseFieldsAccordion from "./components/BaseFieldsAccordion";
import CustomFieldsAccordion from "./components/CustomFieldsAccordion";
import PoliciesTable from './components/PoliciesTable';
import "./Policies.scss";

const Policies = () => {
  const [value, setValue] = React.useState(0);

  function handleChange(event, newValue) {
    setValue(newValue);
  }
  return (
    <div className="__container-policies">
      <div className="__container-policies-accordion">
        <FormAccordion />
        <Divider />
        <BaseFieldsAccordion />
        <Divider />
        <CustomFieldsAccordion />
      </div>

      <div className="__container-policies-content">
        <div className="__container-policies-tabs">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="New" />
            <Tab label="List" />
          </Tabs>
        </div>
        {value === 0 && (
        <div className="__container-policies-table">
          <PoliciesTable />
        </div>)}
      </div>
    </div>
  );
};

export default Policies;
