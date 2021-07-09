import React, { useState } from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { List } from "@material-ui/core";
import { TreeItem, TreeView } from "@material-ui/lab";

const BaseFieldsAccordion = ({ data, onElementClick }) => {
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
        <List style={{ fontSize: "3rem", paddingBottom: '0px' }}>
          {Object.keys(data).map((keyName, ix) => {
            return (
              <TreeItem
                className="baseform-tree-item"
                key={`tree-item-catalogue-${ix}`}
                label={keyName.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))}
                nodeId={`tree-item-catalogue-${ix}`}
                style={{ margin: "0 0 20px 5px" }}
              >
                {Object.values(data[keyName]).map(
                  ({ validationId, compLabel }, f_ix) => {
                    return (
                      <TreeItem
                        key={f_ix}
                        label={compLabel}
                        nodeId={`${validationId}-${f_ix}`}
                        onClick={() => onElementClick(validationId)}
                      />
                    );
                  }
                )}
              </TreeItem>
            );
          })}
        </List>
      </TreeView>
    </div>
  );
};

export default BaseFieldsAccordion;
