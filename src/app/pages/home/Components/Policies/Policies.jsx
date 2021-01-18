import React from "react";
import PoliciesTable from "./components/PoliciesTable";

const Policies = ({ module }) => {

  return (
    <div className="__container-policies">
        <PoliciesTable
        module={module}
        />
    </div>
  );
};

export default Policies;
