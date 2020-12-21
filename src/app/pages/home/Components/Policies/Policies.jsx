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

  const employeesFields = {
    references: { // BF References
      baseFields: {
        name: { id: 'name', label: 'Name' }
      },
      customFields: {
        name: "Receptionist",
        receptionist: {
          ootoDay: { id: 'ootoDay', label: 'Ooto Day' },
          favoriteOffice: { id: 'favoriteOffice', label: 'Favorite Office' }
        },
        name2: "emp02",
        emp02: {
          birthday: { id: 'birthday', label: 'Birthday' }
        },
      },
      nameReferencesBF: 'BF - References',
      nameReferencesCF: 'CF - References'
    },
    list: {
      baseFields: {
        name: { id: 'name', label: 'Name' },
        lastName: { id: 'lastNname', label: 'Last Name' },
        email: { id: 'email', label: 'Email' }
      },
      nameListBF: 'BF - List',
      nameListCF: 'CF - List'
    }
  }

  return (
    <div className="__container-policies">
      <div className="__container-policies-accordion">
        <FormAccordion />
        <Divider />
        <BaseFieldsAccordion
          baseReferences = {employeesFields.references.nameReferencesBF}
          baseList = {employeesFields.list.nameListBF}
          nameReferences = {employeesFields.references.baseFields.name.label}
          nameList = {employeesFields.list.baseFields.name.label}
          lastNameList = {employeesFields.list.baseFields.lastName.label}
          emailList = {employeesFields.list.baseFields.email.label}
        />
        <Divider />
        <CustomFieldsAccordion
        customReferences = {employeesFields.references.nameReferencesCF}
        customList = {employeesFields.list.nameListCF}
        nameCustomReceptionist = {employeesFields.references.customFields.name}
        nameCustomEmp = {employeesFields.references.customFields.name2}
        customFieldOoto = {employeesFields.references.customFields.receptionist.ootoDay.label}
        customFieldOffice = {employeesFields.references.customFields.receptionist.favoriteOffice.label}
        customFieldBirthday = {employeesFields.references.customFields.emp02.birthday.label}
        />
      </div>

        <div className="__container-policies-table">
          <PoliciesTable />
        </div>
    </div>
  );
};

export default Policies;
