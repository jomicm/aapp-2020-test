import React from "react";
import PoliciesTable from "./components/PoliciesTable";

const Policies = ({ module, setPolicies, baseFields = {} }) => {

  return (
    <div className="__container-policies">
        <PoliciesTable setPolicies={setPolicies} module={module} baseFields={baseFields} />
    </div>
  );
};

export default Policies;
