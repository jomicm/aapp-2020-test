import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from "@material-ui/core";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styled from "@emotion/styled";
import CancelIcon from '@material-ui/icons/Cancel';
import './ProcessFlow.scss';

const SingleCustomField = styled.div`
  position: relative;
  ${props =>
    props.inPortal
      ? `
    ::after {
      position: absolute;
      background: lightgreen;
      padding: 8px;
      bottom: 0;
      right: 0;
    }
  `
      : ''} 
`;
const portal = document.createElement('div');
document.body.appendChild(portal);

const PortalAwareItem = (props) => {
  const { provided, snapshot, item, handleRemoveProcessStage, onClick } = props;

  const usePortal = snapshot.isDragging;

  const child = (
    <SingleCustomField
      className="drag-drop-area__single-custom-field"
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      inPortal={usePortal}
    >
      <ListItem key='value' role={undefined} dense button
        onClick={() => onClick(item.id)}
      >
        <ListItemText id={'labelId'} primary={item.name} />
        <ListItemSecondaryAction>
          <IconButton
            aria-label="Remove"
            className="custom-field-preview-wrapper__delete-icon"
            edge="end"
            onClick={() => handleRemoveProcessStage(item)}
          >
            <CancelIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </SingleCustomField>
  );
  
  if (!usePortal) {
    return child;
  }

  // if dragging - put the item in a portal
  const PortalChild = <List>{child}</List>;
  // return ReactDOM.createPortal(child, portal);
  return ReactDOM.createPortal(PortalChild, portal);
};

const ProcessFlow = ({ processStages = [], setProcessStages, handleRemoveProcessStage, onClick }) => {
  const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`
  }));
  
  const [items, setItems] = useState(getItems(5));
  const grid = 8;

  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
  
    // change background colour if dragging
    background: isDragging ? "lightsteelblue" : "ghostwhite",
  
    // styles we need to apply on draggables
    ...draggableStyle
  });

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const itemsLocal = reorder(
      processStages,
      result.source.index,
      result.destination.index
    );

    setProcessStages(itemsLocal);
  };

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="drag-drop-process__content">
          <span className="drag-drop-process__legend">Process Flow</span>
          <Droppable droppableId={'dropabble'}>
            {(provided, snapshot) => (
              <List
                className="drag-drop-process__list-field"
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={getItemStyle(snapshot.isDraggingOver)}
              >
                {processStages.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <PortalAwareItem
                        provided={provided}
                        snapshot={snapshot}
                        onClick={onClick}
                        style={getItemStyle(snapshot.isDraggingOver)}
                        item={item}
                        handleRemoveProcessStage={handleRemoveProcessStage}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
};

export default ProcessFlow;
