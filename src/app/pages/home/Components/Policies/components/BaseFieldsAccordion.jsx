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

const BaseFieldsAccordion = ({ data, onElementClick, customFieldKey }) => {
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  }

  // const variables = [
  //   {name: props.nameReferences, id: 'bfName'},
  //   {name: 'Dos', id: 'bfNameDos'},
  //   {name: 'Tres', id: 'bfNameTres'}
  // ];

  return (
    <div>
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        <List style={{ fontSize: '3rem' }}>
          {/* {Object.keys(data[customFieldKey].customFields).map((keyName, ix) => { */}
          {Object.keys(data).map((keyName, ix) => {
            return (
              <TreeItem
                id={`tree-item-catalogue-${ix}`}
                className='baseform-tree-item'
                label={keyName}
                nodeId={`tree-item-catalogue-${ix}`}
                style={{ margin: '0 0 20px 5px' }}
              >
                {Object.values(data[keyName].baseFields).map(({ id, label }, f_ix) => {
                  return (
                    <TreeItem
                      onClick={() => onElementClick(id)}
                      label={label}
                      nodeId={`id-${f_ix}`}
                    />
                  );
                })}
              </TreeItem>
            )
          })}
        </List>
      </TreeView>
    </div>
  );

  // return (
  //   <div>
  //     <TreeView
  //       defaultCollapseIcon={<ExpandMoreIcon />}
  //       defaultExpandIcon={<ChevronRightIcon />}
  //     >
  //       <List style={{ fontSize: '3rem' }}>
  //         <TreeItem
  //           className='baseform-tree-item'
  //           label={props.baseReferences}
  //           nodeId='1'
  //           style={{ margin: '0 0 20px 5px' }}
  //         >
  //           {variables.map((vari, ix) => {
  //             return (
  //               <div key={ix}>
  //                 <TreeItem nodeId={vari.id} label={vari.name} />
  //               </div>
  //             )
  //           })}
  //         </TreeItem>
  //         <TreeItem
  //           className='baseform-tree-item'
  //           label={props.baseList}
  //           nodeId='5'
  //           style={{ margin: '0 0 20px 5px' }}
  //         >
  //           <TreeItem onClick={() => console.log('Hola')} label={props.nameList} nodeId='6' />
  //           <TreeItem label={props.lastNameList} nodeId='7' />
  //           <TreeItem label={props.emailList} nodeId='8' />
  //         </TreeItem>
  //       </List>
  //     </TreeView>
  //   </div>
  // );
};
export default BaseFieldsAccordion;
