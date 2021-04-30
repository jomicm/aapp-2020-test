import React from "react";
import PoliciesTable from "./components/PoliciesTable";

const Policies = ({ module, baseFields = {} }) => {

  return (
    <div className="__container-policies">
        <PoliciesTable module={module} baseFields={baseFields} />
    </div>
  );
};

export default Policies;
