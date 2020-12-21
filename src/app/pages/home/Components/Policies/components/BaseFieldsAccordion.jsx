import React from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import StarBorder from "@material-ui/icons/StarBorder";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";


const BaseFieldsAccordion = (props) => {
  const [open, setOpen] = React.useState(true);

  function handleClick() {
    setOpen(!open);
  }

  return (
    <div>
      <TreeView
        // className={classes.root}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        <ExpansionPanel>
          <ExpansionPanelSummary>
            <Typography>Base fields</Typography>
          </ExpansionPanelSummary>
          <Divider />
          <List style={{ fontSize: "3rem" }}>
          <TreeItem  className="baseform-tree-item" style={{ margin: "0 0 20px 5px"}} nodeId="1" label={props.baseReferences}>
                <TreeItem nodeId="2" label={props.nameReferences} />
              </TreeItem>
              <TreeItem className="baseform-tree-item" style={{ margin: "0 0 20px 5px"}} nodeId="5" label={props.baseList}>
                <TreeItem nodeId="6" label={props.nameList} />
                <TreeItem nodeId="7" label={props.lastNameList} />
                <TreeItem nodeId="8" label={props.emailList} />
              </TreeItem>
          </List>
        </ExpansionPanel>
      </TreeView>
    </div>
  );
};
export default BaseFieldsAccordion;
