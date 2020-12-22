import React, { useState, useEffect } from "react";
import {
  Portlet,
  PortletBody,
  PortletHeader,
  PortletHeaderToolbar,
} from "../../../../partials/content/Portlet";
import {
  getDB,
  postDB,
  getOneDB,
  updateDB,
  deleteDB,
} from "../../../../crud/api";
import TableComponent from "../../Components/TableComponent";
import ModalMyTickets from "./modals/ModalMyTickets";

const ticketsHeadRows = [
  {
    disablePadding: false,
    id: "subject",
    label: "Subject",
    numeric: false,
  },
  {
    disablePadding: false,
    id: "selectedType",
    label: "Type",
    numeric: true,
  },
  {
    disablePadding: false,
    id: "peaceOfMind",
    label: "Peace of Mind",
    numeric: false,
  },
  {
    disablePadding: false,
    id: "creator",
    label: "Creator",
    numeric: false,
  },
  {
    disablePadding: false,
    id: "creationDate",
    label: "Creation Date",
    numeric: false,
  },
];

const collections = {
  tickets: {
    id: "idTickets",
    modal: "openTicketsModal",
    name: "tickets",
  },
};

const createTicketsRow = (
  id,
  subject,
  selectedType,
  peaceOfMind,
  creator,
  creationDate
) => {
  return { id, subject, selectedType, peaceOfMind, creator, creationDate };
};

const MyTickets = () => {
  const [control, setControl] = useState({
    idTickets: null,
    openTicketsModal: false,
    ticketsRows: [],
    ticketsRowsSelected: [],
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

  const loadInitData = (collectionNames = ["tickets"]) => {
    collectionNames = !Array.isArray(collectionNames)
      ? [collectionNames]
      : collectionNames;
    collectionNames.forEach((collectionName) => {
      getDB(collectionName)
        .then((response) => response.json())
        .then((data) => {
          if (collectionName === "tickets") {
            const rows = data.response.map((row) => {
              const { _id, message, peaceOfMind, selectedType, subject } = row;
              return createTicketsRow(
                _id,
                subject,
                selectedType,
                peaceOfMind,
                "Admin",
                "11/03/2020"
              );
            });
            setControl((prev) => ({
              ...prev,
              ticketsRows: rows,
              ticketsRowsSelected: [],
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
          <ModalMyTickets
            showModal={control.openTicketsModal}
            setShowModal={(onOff) =>
              setControl({ ...control, openTicketsModal: onOff })
            }
            reloadTable={() => loadInitData("tickets")}
            id={control.idTickets}
            employeeProfileRows={[]}
          />
          <div className="kt-section__content">
            <TableComponent
              title={"My Tickets"}
              headRows={ticketsHeadRows}
              rows={control.ticketsRows}
              onEdit={tableActions("tickets").onEdit}
              onAdd={tableActions("tickets").onAdd}
              onDelete={tableActions("tickets").onDelete}
              onSelect={tableActions("tickets").onSelect}
            />
          </div>
        </div>
      </div>
    </PortletBody>
  );
};

export default MyTickets;
