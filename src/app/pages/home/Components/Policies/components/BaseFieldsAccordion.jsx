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

const BaseFieldsAccordion = (props) => {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  }

  const variables = [
    {name: props.nameReferences, id: 'bfName'},
    {name: 'Dos', id: 'bfNameDos'},
    {name: 'Tres', id: 'bfNameTres'}
  ];

  return (
    <div>
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        <List style={{ fontSize: '3rem' }}>
          <TreeItem
            className='baseform-tree-item'
            label={props.baseReferences}
            nodeId='1'
            style={{ margin: '0 0 20px 5px' }}
          >
            {variables.map((vari, ix) => {
              return (
                <div key={ix}>
                  <TreeItem nodeId={vari.id} label={vari.name} />
                </div>
              )
            })}
          </TreeItem>
          <TreeItem
            className='baseform-tree-item'
            label={props.baseList}
            nodeId='5'
            style={{ margin: '0 0 20px 5px' }}
          >
            <TreeItem label={props.nameList} nodeId='6' />
            <TreeItem label={props.lastNameList} nodeId='7' />
            <TreeItem label={props.emailList} nodeId='8' />
          </TreeItem>
        </List>
      </TreeView>
    </div>
  );
};
export default BaseFieldsAccordion;
