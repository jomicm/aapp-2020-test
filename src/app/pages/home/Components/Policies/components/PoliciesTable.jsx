import React, { useState, useEffect } from "react";
import {
  Portlet,
  PortletBody,
  PortletHeader,
  PortletHeaderToolbar,
} from "../../../../../partials/content/Portlet";
import {
  getDB,
  postDB,
  getOneDB,
  updateDB,
  deleteDB,
} from "../../../../../crud/api";
import ModalPolicies from "../modals/ModalPolicies";
import TableComponent from "../../TableComponent";

const policiesHeadRows = [
  {
    id: "action",
    numeric: false,
    disablePadding: false,
    label: "Action",
  },
  {
    id: "type",
    numeric: false,
    disablePadding: false,
    label: "Type",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "dateTime",
    numeric: false,
    disablePadding: false,
    label: "Date Time",
  },
  {
    id: "creator",
    numeric: false,
    disablePadding: false,
    label: "Creator",
  },
  {
    id: "creationDate",
    numeric: false,
    disablePadding: false,
    label: "Creation Date",
  },
];

const collections = {
  policies: {
    id: "idPolicies",
    modal: "openPoliciesModal",
    name: "policies",
  },
};

const createPoliciesRow = (
  id,
  action,
  type,
  name,
  dateTime,
  creator,
  creationDate
) => {
  return {
    id,
    action,
    type,
    name,
    dateTime,
    creator,
    creationDate,
  };
};

const PoliciesTable = () => {
  const [control, setControl] = useState({
    idPolicies: null,
    openPoliciesModal: false,
    policiesRows: [],
    policiesRowsSelected: [],
  });

  const tableActions = (collectionName) => {
    const collection = collections[collectionName];
    return {
      onAdd() {
        setControl({
          ...control,
          [collection.id]: null,
          [collection.modal]: true,
        });
      },
      onEdit(id) {
        setControl({
          ...control,
          [collection.id]: id,
          [collection.modal]: true,
        });
      },
      onDelete(id) {
        if (!id || !Array.isArray(id)) return;
        id.forEach((_id) => {
          deleteDB(`${collection.name}/`, _id)
            .then((response) => loadInitData(collection.name))
            .catch((error) => console.log("Error", error));
        });
      },
      onSelect(id) {
        if (collectionName === "references") {
        }
      },
    };
  };

  const loadInitData = (collectionNames = ["policies"]) => {
    collectionNames = !Array.isArray(collectionNames)
      ? [collectionNames]
      : collectionNames;
    collectionNames.forEach((collectionName) => {
      getDB(collectionName)
        .then((response) => response.json())
        .then((data) => {
          if (collectionName === "policies") {
            const rows = data.response.map((row) => {
              // const { _id, action, type, name } = row;
              return createPoliciesRow(
                row._id,
                row.action,
                row.type,
                row.name,
                "11/03/2020",
                "Admin",
                "12/2/2020"
              );
            });
            setControl((prev) => ({
              ...prev,
              policiesRows: rows,
              policiesRowsSelected: [],
            }));
          }
        })
        .catch((error) => console.log("error>", error));
    });
  };

  useEffect(() => {
    loadInitData();
  }, []);

  return (
    <PortletBody>
      <div className="kt-section__body">
        <div className="kt-section">
          <ModalPolicies
            showModal={control.openPoliciesModal}
            setShowModal={(onOff) =>
              setControl({ ...control, openPoliciesModal: onOff })
            }
            reloadTable={() => loadInitData("policies")}
            id={control.idPolicies}
            employeeProfileRows={[]}
          />
          <div className="kt-section__content">
            <TableComponent
              title={"Policies"}
              headRows={policiesHeadRows}
              rows={control.policiesRows}
              onEdit={tableActions("policies").onEdit}
              onAdd={tableActions("policies").onAdd}
              onDelete={tableActions("policies").onDelete}
              onSelect={tableActions("policies").onSelect}
            />
          </div>
        </div>
      </div>
    </PortletBody>
  );
};
export default PoliciesTable;
