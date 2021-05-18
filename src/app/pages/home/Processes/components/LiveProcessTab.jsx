import React, { useEffect, useState } from 'react';
import {
  Button,
  Icon,
  Paper,
  Tab,
  Tabs,
  Typography
} from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import AssetFinderPreview from '../../Components/AssetFinderPreview';
import ModalOneField from '../../Components/ModalOneField';
import LiveProcessInfo from './LiveProcessInfo';

const LiveProcessTab = ({
  onSelectionChange,
  processInfo,
  processType,
  setCartRows,
  onSetRows,
  user
}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selection, setSelection] = useState([]);
  const [localCartRows, setLocalCartRows] = useState([]);
  const [currentStage, setCurrentStage] = useState([]);
  
  useEffect(() => {
    if(Object.keys(processInfo).length){
      setLocalCartRows(processInfo.cartRows);
      const stageKeys = Object.keys(processInfo.processData.stages);
      const _currentStage = processInfo.processData.stages[stageKeys[processInfo.processData.currentStage-1]];
      setCurrentStage(_currentStage);
    }
  }, [processInfo]);

  const handleRejectionClick = () => {
    if (selection.length) {
      setOpenModal(true);
    }
  };
  const handleRejectionOkClick = (message) => {
    setOpenModal(false);
    const cartTmp = localCartRows.reduce((acu, cur) => {
      return selection.findIndex((row) => row.id === cur.id) >= 0 ?
      [...acu, { ...cur, status: 'Rejected', message }] : [...acu, cur];
    }, []);
    setLocalCartRows(cartTmp);
    onSetRows(cartTmp);
  };
  const handleApproveOkClick = (message) => {
    const cartTmp = localCartRows.reduce((acu, cur) => {
      return selection.findIndex((row) => row.id === cur.id) >= 0 ?
      [...acu, { ...cur, status: 'Approved', message: '' }] : [...acu, cur];
    }, []);
    setLocalCartRows(cartTmp);
    onSetRows(cartTmp);
  };
  const handleSelection = ({ rows }) => {
    setSelection(rows);
  };
  const showButtons = () => {
   if(!Object.keys(currentStage).length > 0){
     return false;
   };

   const stageApprovals = currentStage.approvals.map(({_id}) => _id);
   if(!stageApprovals.includes(user.id) || currentStage.stageFulfilled){
     return false;
   }
   
    return true;
  };

  return (
    <div>
      <ModalOneField
        open={openModal}
        title='Rejection Message'
        message='Please share a rejection message for the selected assets'
        fieldName='Rejection Message'
        onOk={handleRejectionOkClick}
        onCancel={() => setOpenModal(false)}
      />
      <Paper>
        <Tabs
          value={tabIndex}
          onChange={(_, newValue) => setTabIndex(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Process Info" />
          <Tab label="Process Assets" />
        </Tabs>
      </Paper>
      <SwipeableViews index={tabIndex}>
        <TabContainer>
          <LiveProcessInfo
            processInfo={processInfo}
          />
        </TabContainer>
        <TabContainer>
          {
            showButtons() && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', marginBottom: '25px' }}>
                <Button
                  color="secondary"
                  endIcon={<Icon>thumb_down</Icon>}
                  onClick={handleRejectionClick}
                  variant="contained"
                >
                  Reject
                </Button>
                <Button
                  color="secondary"
                  endIcon={<Icon>thumb_up</Icon>}
                  style={{ backgroundColor: 'green', marginLeft: '20px' }}
                  onClick={handleApproveOkClick}
                  variant="contained"
                >
                  Approve
                </Button>
              </div>
            )
          }
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <AssetFinderPreview
              isAssetReference={true}
              isSelectionTable={false}
              isPreviewTable={true}
              showSearchBar={false}
              onSelectionChange={handleSelection}
              rows={localCartRows}
              onSetRows={setCartRows}
              processType={processType}
            />
          </div>
        </TabContainer>
      </SwipeableViews>
    </div>
  );
};

const TabContainer = ({ children, dir }) => {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
};

export default LiveProcessTab;
