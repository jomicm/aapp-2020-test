import React from "react";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import StarBorder from "@material-ui/icons/StarBorder";
import TreeItem from "@material-ui/lab/TreeItem";
import TreeView from "@material-ui/lab/TreeView";
import Typography from "@material-ui/core/Typography";

const BaseFieldsAccordion = (props) => {
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
          <List style={{ fontSize: "3rem" }}>
            <TreeItem
              className="baseform-tree-item"
              style={{ margin: "0 0 20px 5px" }}
              nodeId="1"
              label={props.baseReferences}
            >
              <TreeItem nodeId="2" label={props.nameReferences} />
            </TreeItem>
            <TreeItem
              className="baseform-tree-item"
              style={{ margin: "0 0 20px 5px" }}
              nodeId="5"
              label={props.baseList}
            >
              <TreeItem nodeId="6" label={props.nameList} />
              <TreeItem nodeId="7" label={props.lastNameList} />
              <TreeItem nodeId="8" label={props.emailList} />
            </TreeItem>
          </List>
      </TreeView>
    </div>
  );
};
export default BaseFieldsAccordion;
