import React from "react";
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

const CustomFieldsAccordion = (props) => {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  }

  return (
    <div>
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        <List style={{ fontSize: '3rem' }}>
          <TreeItem
            className='baseform-tree-item'
            label={props.customReferences}
            nodeId='1'
            style={{ margin: '0 0 20px 5px' }}
          >
            <TreeItem
              className='baseform-tree-item'
              label={props.nameCustomReceptionist}
              nodeId='2'
            >
              <TreeItem label={props.customFieldOoto} nodeId='3' />
              <TreeItem label={props.customFieldOffice} nodeId='4' />
            </TreeItem>
            <TreeItem
              className='baseform-tree-item'
              label={props.nameCustomEmp}
              nodeId='5'
            >
              <TreeItem label={props.customFieldBirthday} nodeId="6" />
            </TreeItem>
          </TreeItem>
        </List>
      </TreeView>
    </div>
  );
};
export default CustomFieldsAccordion;
