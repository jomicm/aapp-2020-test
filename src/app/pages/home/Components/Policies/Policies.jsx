import React from "react";
import Divider from "@material-ui/core/Divider";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import BaseFieldsAccordion from "./components/BaseFieldsAccordion";
import CustomFieldsAccordion from "./components/CustomFieldsAccordion";
import PoliciesTable from "./components/PoliciesTable";
import "./Policies.scss";

const Policies = () => {

  return (
    <div className="__container-policies">
        <PoliciesTable />
    </div>
  );
};

export default Policies;
