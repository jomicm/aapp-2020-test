import React, {useState} from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import './FormAccordion.scss'
import ModalOnAdd from '../modals/ModalOnAdd'
import AddIcon from '@material-ui/icons/Add';

const FormAccordion = () => {

 const hanldeOnAdd = () => {
    alert("Hey!")
  }

  return (
    <div>
      <ExpansionPanel>
        <ExpansionPanelSummary>
          <Typography>Form</Typography>
        </ExpansionPanelSummary>
        <Divider />
        <List>
          <span onClick={hanldeOnAdd} className="policie-element">On Add <AddIcon /> </span> 
          <span onClick={() => {alert('On Edit')}} className="policie-element">On Edit</span>
          <span onClick={() => {alert('On Delete')}} className="policie-element">On Delete</span>
          <span onClick={() => {alert('On Load')}} className="policie-element">On Load</span>
        </List>
      </ExpansionPanel>
    </div>
  );
};
export default FormAccordion;
