import React, { useState } from "react";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import {
  Collapse,
  Divider,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  List,
  ListItem,
  ListItemText,
  StarBorder,
  Typography,
} from "@material-ui/core";
import { TreeItem, TreeView } from "@material-ui/lab";

const CustomFieldsAccordion = ({ data, onElementClick, customFieldKey }) => {
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div>
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        <List style={{ fontSize: "3rem" }}>
          {Object.keys(data[customFieldKey].customFields).map((keyName, ix) => {
            return (
              <TreeItem
                className="baseform-tree-item"
                key={`tree-item-catalogue-${ix}`}
                label={keyName}
                nodeId={`tree-item-catalogue-${ix}`}
                style={{ margin: "0 0 20px 5px" }}
                >
                  {Object.values(data[customFieldKey].customFields[keyName]).map(({id, label}, f_ix) => {
                    return(
                      <TreeItem 
                      key={f_ix}
                      label={label}
                      nodeId={`${id}-${f_ix}`}
                      onClick={() => onElementClick(id)}
                      />
                    )
                  })}
              </TreeItem>
            );
          })}
        </List>
      </TreeView>
    </div>
  );
};
export default CustomFieldsAccordion;
