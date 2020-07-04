import React, { useState, useEffect } from 'react'
import {
  Checkbox,
  Card,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from "@material-ui/core";

function not(a, b) {
  return a.filter(value => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter(value => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

const Permission = ({ id, title, setPermissions, originalChecked }) => {

  const [checked, setChecked] = useState([]);
  
  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    setPermissions(id, newChecked);
  };

  const numberOfChecked = items => {
    const itemsTmp = items[0].key ? items.map(i => i.key) : items;
    return intersection(checked, itemsTmp).length;
  }

  const handleToggleAll = items => () => {
    const itemsTmp = items.map(i => i.key);
    if (numberOfChecked(itemsTmp) === itemsTmp.length) {
      setChecked(not(checked, itemsTmp));
      setPermissions(id, not(checked, itemsTmp));
    } else {
      setChecked(union(checked, itemsTmp));
      setPermissions(id, union(checked, itemsTmp));
    }
  };

  // const items = ['Add', 'Edit', 'Delete', 'View'];
  const items = [
    {key: 'add', name: 'Add'},
    {key: 'edit', name: 'Edit'},
    {key: 'delete', name: 'Borrar'},
    {key: 'view', name: 'View'}
  ];

  useEffect(() => {
    if (!originalChecked || !originalChecked[id]) return;
    setChecked(originalChecked[id]);
  }, [originalChecked]);

  return (
    <div style={{padding:'15px'}}>
       <Card style={{width: 'fit-content', paddingRight: '20px'}}>
        <CardHeader
          // className={classes.cardHeader}
          avatar={
            <Checkbox
              onClick={handleToggleAll(items)}
              checked={numberOfChecked(items) === items.length && items.length !== 0}
              indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
              disabled={items.length === 0}
              inputProps={{ 'aria-label': 'all items selected' }}
            />
          }
          title={title}
          subheader={`${numberOfChecked(items)}/${items.length} selected`}
        />
        <Divider style={{marginLeft: '20px'}}/>
        <List 
          //className={classes.list}
          dense
          component="div" role="list"
        >
          {items.map(value => {
            const labelId = `transfer-list-all-item-${value.name}-label`;

            return (
              <ListItem key={value.key} role="listitem" button onClick={handleToggle(value.key)}>
                <ListItemIcon>
                  <Checkbox
                    checked={checked.indexOf(value.key) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={value.name} />
              </ListItem>
            );
          })}
          <ListItem />
        </List>
      </Card>
    </div>
  )
}

export default Permission
