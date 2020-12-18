import React from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const FormAccordion = () => {
  return (
    <div>
      <ExpansionPanel>
        <ExpansionPanelSummary>
          <Typography>Form</Typography>
        </ExpansionPanelSummary>
        <Divider />
        <List>
          <ListItem>On Add</ListItem>
          <ListItem>On Edit</ListItem>
          <ListItem>On Delete</ListItem>
          <ListItem>On Load</ListItem>
        </List>
      </ExpansionPanel>
    </div>
  );
};
export default FormAccordion;
