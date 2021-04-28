/* eslint-disable no-restricted-imports */
import React, { useMemo, useState } from "react";
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import { makeStyles } from "@material-ui/core/styles";

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const useStyles = makeStyles({
  root: {
    height: 'auto',
    flexGrow: 1,
    maxWidth: 400,
  },
});

export default function RecursiveTreeView(props) {
  const classes = useStyles();

  const renderTree = (nodes) => (
      <TreeItem
        key={nodes.id}
        nodeId={nodes.id}
        label={nodes.name}
        onClick={() => props.onClick(nodes.id, nodes.profileLevel, nodes.parent, nodes.name, nodes.children)}
      >
        { Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null }
      </TreeItem>
  );

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={['root']}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {renderTree(props.data)}
    </TreeView>
  );
}