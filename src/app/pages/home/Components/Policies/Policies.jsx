import React from "react";
import Divider from "@material-ui/core/Divider";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import BaseFieldsAccordion from "./components/BaseFieldsAccordion";
import CustomFieldsAccordion from "./components/CustomFieldsAccordion";
import PoliciesTable from "./components/PoliciesTable";
import "./Policies.scss";

const Policies = () => {
  const employeesFields = {
    references: {
      baseFields: {
        name: { id: "name", label: "Name" },
      },
      customFields: {
        name: "Receptionist",
        receptionist: {
          ootoDay: { id: "ootoDay", label: "Ooto Day" },
          favoriteOffice: { id: "favoriteOffice", label: "Favorite Office" },
        },
        name2: "emp02",
        emp02: {
          birthday: { id: "birthday", label: "Birthday" },
        },
      },
      nameReferencesBF: "BF - References",
      nameReferencesCF: "CF - References",
    },
    list: {
      baseFields: {
        name: { id: "name", label: "Name" },
        lastName: { id: "lastNname", label: "Last Name" },
        email: { id: "email", label: "Email" },
      },
      nameListBF: "BF - List",
      nameListCF: "CF - List",
    },
  };

  return (
    <div className="__container-policies">
      <div className="__container-policies-accordion">
        <BaseFieldsAccordion
          baseList={employeesFields.list.nameListBF}
          baseReferences={employeesFields.references.nameReferencesBF}
          emailList={employeesFields.list.baseFields.email.label}
          lastNameList={employeesFields.list.baseFields.lastName.label}
          nameList={employeesFields.list.baseFields.name.label}
          nameReferences={employeesFields.references.baseFields.name.label}
        />
        <Divider />
        <CustomFieldsAccordion
          customFieldBirthday={
            employeesFields.references.customFields.emp02.birthday.label
          }
          customFieldOffice={
            employeesFields.references.customFields.receptionist.favoriteOffice
              .label
          }
          customFieldOoto={
            employeesFields.references.customFields.receptionist.ootoDay.label
          }
          customList={employeesFields.list.nameListCF}
          customReferences={employeesFields.references.nameReferencesCF}
          nameCustomReceptionist={employeesFields.references.customFields.name}
          nameCustomEmp={employeesFields.references.customFields.name2}
        />
      </div>
      <div className="__container-policies-table">
        <PoliciesTable />
      </div>
    </div>
  );
};

export default Policies;
