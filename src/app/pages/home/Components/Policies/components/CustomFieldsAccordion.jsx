import React from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { List } from "@material-ui/core";
import { TreeItem, TreeView } from "@material-ui/lab";

const CustomFieldsAccordion = ({ data, onElementClick }) => (
  <div>
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      <List style={{ fontSize: "3rem" }}>
        {data.map(({ name }, index) => (
          <TreeItem
            className="baseform-tree-item"
            key={`tree-item-catalogue-${index}`}
            label={name}
            nodeId={`tree-item-catalogue-${index}`}
            style={{ margin: "0 0 20px 5px" }}
          >
            {Object.keys(data[index].customFields).map((id, customFieldIndex) => (
              <TreeItem
                key={customFieldIndex}
                label={data[index].customFields[id].replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))}
                nodeId={`${id}-${customFieldIndex}`}
                onClick={() => onElementClick(id)}
              />
            ))}
          </TreeItem>
        ))}
      </List>
    </TreeView>
  </div>
);
export default CustomFieldsAccordion;
