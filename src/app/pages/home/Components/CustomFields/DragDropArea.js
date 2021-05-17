import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styled from "@emotion/styled";
//Custom Fields Preview
import { CustomFieldsPreview } from '../../constants';
import './DragDropArea.scss';

const reorder = (list, startIndex, endIndex) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const portal = document.createElement('div');
portal.classList.add('my-super-cool-portal');

if (!document.body) {
  throw new Error('body not ready for portal creation!');
}

document.body.appendChild(portal);

const SingleCustomField = styled.div`
  /* padding: 8px; */
  /* margin-bottom: 8px; */
  /* background-color: green; */
  /* border: 1px solid yellow; */
  /* width: 100%; */
  /* used for positioning the after content */
  position: relative;
  /* stylelint-disable  comment-empty-line-before */
  /* add little portal indicator when in a portal */
  ${props =>
    props.inPortal
      ? `
    ::after {
      position: absolute;
      background: lightgreen;
      padding: 8px;
      bottom: 0;
      right: 0;
      content: "....moving ";
    }
  `
      : ''} /* stylelint-enable */;
`;

const PortalAwareItem = (props) => {
  const { provided, snapshot, quote } = props;

  const usePortal = snapshot.isDragging;

  const child = (
    <SingleCustomField
      className="drag-drop-area__single-custom-field"
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      inPortal={usePortal}
    >
      {/* {customFieldsPreviewObj[quote.content]} */}
      <CustomFieldsPreview
        id={quote.id}
        type={quote.content}
        values={quote.values}
        onDelete={props.onDelete}
        onSelect={props.onSelect}
        columnIndex={props.columnIndex}
        customFieldIndex={props.customFieldIndex}
        onClick={() => alert(quote.content)}
        data={props.data.array}
      />
    </SingleCustomField>
  );

  if (!usePortal) {
    return child;
  }

  // if dragging - put the item in a portal
  return ReactDOM.createPortal(child, portal);
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = [...source];
  const destClone = [...destination];
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const DragDropArea = (props) => {
  const [droppables, setDroppables] = useState([]);
  const [id2List, setId2List] = useState({
    droppable: null,
    droppable2: null
  });
  const id2ListHelper = {
    droppable: id2List.droppable,
    droppable2: id2List.droppable2
  };
  const getList = id => id2List[id];
  const onDragEndDouble = result => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
        return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
          getList(source.droppableId),
          source.index,
          destination.index
      );

      if (source.droppableId === 'droppable2') {
        id2ListHelper['droppable2'] = items;
      } else {
        id2ListHelper['droppable'] = items;
      }

    } else {
      const result = move(
          getList(source.droppableId),
          getList(destination.droppableId),
          source,
          destination
      );

      id2ListHelper['droppable'] = result.droppable;
      id2ListHelper['droppable2'] = result.droppable2;

    }
    const customFieldsTab = props.customFieldsTab;
    customFieldsTab[`tab-${props.tabIndex}`].left = id2ListHelper['droppable'];
    customFieldsTab[`tab-${props.tabIndex}`].right = id2ListHelper['droppable2'];
    props.setCustomFieldsTab(customFieldsTab);

    setId2List(id2ListHelper);
    const droppableArray = [{id: `droppable`, array: id2ListHelper['droppable']}];
    if(props.customFieldsColumns.length === 2) droppableArray.push({id: `droppable2`, array: id2ListHelper['droppable2']});
    setDroppables(droppableArray);
  };
  const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
  });

  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: 8 * 2,
    margin: `0 0 8px 0`,

    // change background colour if dragging
    background: isDragging ? 'purple' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle
  });

  const removeCustomField = (columnIndex, customFieldIndex, tabIndex) => {
    const column = columnIndex === 0 ? 'left' : 'right';
    const customFieldsTab = props.customFieldsTab;
    const tab = customFieldsTab[`tab-${tabIndex}`];
    tab[column].splice(customFieldIndex, 1);
    props.setCustomFieldsTab(customFieldsTab);
    const droppableArray = [{id: `droppable`, array: tab.left}];
    if(props.customFieldsColumns.length === 2) droppableArray.push({id: `droppable2`, array: tab.right});
    setDroppables(droppableArray);
  };

  useEffect(() => {
    if(!props.customFieldsTab || !props.customFieldsTab[`tab-${props.tabIndex}`]) {
      setDroppables([]);
    }
    else {
      const tab = props.customFieldsTab[`tab-${props.tabIndex}`];
      setId2List({
        droppable: tab.left,
        droppable2: tab.right
      });
      const droppableArray = [{id: `droppable`, array: tab.left}];
      if(props.customFieldsColumns.length === 2) droppableArray.push({id: `droppable2`, array: tab.right});
      setDroppables(droppableArray);
    }
  }, [props.customFieldsTab, props.customFieldsColumns, props.tabIndex]);
  
  return (
    <DragDropContext onDragEnd={onDragEndDouble}>
      {droppables.map((dropabble, ix) => (
        <div key={`column-layout-${ix}`} className="drag-drop-area__column">
          <span className="drag-drop-area__legend">Custom Fields Column</span>
          <Droppable key={`dropId-${ix}`} droppableId={dropabble.id}>
            {(provided, snapshot) => (
              <div
                className="drag-drop-area__list-field"
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {dropabble.array.map((quote, index) => (
                  <Draggable draggableId={quote.id} index={index} key={quote.id}>
                    {(
                      draggableProvided,
                      draggableSnapshot,
                    ) => (
                      <PortalAwareItem
                        quote={quote}
                        provided={draggableProvided}
                        snapshot={draggableSnapshot}
                        style={getItemStyle(snapshot.isDraggingOver)}
                        onDelete={() => removeCustomField(ix, index, props.tabIndex)}
                        onSelect={props.setCustomFieldSettings}
                        columnIndex={ix}
                        customFieldIndex={index}
                        data={dropabble}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      ))}
    </DragDropContext>
  );
};

export default DragDropArea;