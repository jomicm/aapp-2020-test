import React from "react";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import StarBorder from "@material-ui/icons/StarBorder";
import TreeItem from "@material-ui/lab/TreeItem";
import TreeView from "@material-ui/lab/TreeView";
import Typography from "@material-ui/core/Typography";

const CustomFieldsAccordion = (props) => {
  const [open, setOpen] = React.useState(true);

  function handleClick() {
    setOpen(!open);
  }

  return (
    <div>
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        <ExpansionPanel>
          <ExpansionPanelSummary>
            <Typography>Custom fields</Typography>
          </ExpansionPanelSummary>
          <Divider />
          <List style={{ fontSize: "3rem" }}>
            <TreeItem
              style={{ margin: "0 0 20px 5px" }}
              className="baseform-tree-item"
              nodeId="1"
              label={props.customReferences}
            >
              <TreeItem
                className="baseform-tree-item"
                nodeId="2"
                label={props.nameCustomReceptionist}
              >
                <TreeItem nodeId="3" label={props.customFieldOoto} />
                <TreeItem nodeId="4" label={props.customFieldOffice} />
              </TreeItem>
              <TreeItem
                className="baseform-tree-item"
                nodeId="5"
                label={props.nameCustomEmp}
              >
                <TreeItem nodeId="6" label={props.customFieldBirthday} />
              </TreeItem>
            </TreeItem>
            <TreeItem
              style={{ margin: "0 0 20px 5px" }}
              className="baseform-tree-item"
              nodeId="7"
              label={props.customList}
            ></TreeItem>
          </List>
        </ExpansionPanel>
      </TreeView>
    </div>
  );
};
export default CustomFieldsAccordion;
