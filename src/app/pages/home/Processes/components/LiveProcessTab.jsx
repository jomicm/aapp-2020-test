import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
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
import ModalYesNo from '../../Components/ModalYesNo';
import { actions } from '../../../../store/ducks/general.duck';

const LiveProcessTab = ({
  onSelectionChange,
  goBackLogic,
  processInfo,
  processType,
  setCartRows,
  onSetRows,
  user,
  rows,
  setProcessCartInfo,
}) => {
  const dispatch = useDispatch();
  const { showCustomAlert } = actions;
  const [tabIndex, setTabIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selection, setSelection] = useState([]);
  const [localCartRows, setLocalCartRows] = useState([]);
  const [currentStage, setCurrentStage] = useState([]);
  const [goBackModal, setGoBackModal] = useState(false);

  useEffect(() => {
    if(Object.keys(processInfo).length){
      const stageKeys = Object.keys(processInfo.processData.stages);
      const _currentStage = processInfo.processData.stages[stageKeys[processInfo.processData.currentStage-1]];
      setCurrentStage(_currentStage);
    }
  }, [processInfo]);

  useEffect(() => {
    const allApproved = !localCartRows || localCartRows.length === 0 ? false : localCartRows.map(({status}) => status).every((eachStatus) => eachStatus);
    if (allApproved) {
      dispatch(showCustomAlert({
        type: 'success',
        open: true,
        message: `All assets are validated`
      }));
    }
  }, [localCartRows]);

  useEffect(() => {
    setLocalCartRows(rows);
  }, [rows]);

  const handleChangeAssetValues = (newCartRows) => {
    setProcessCartInfo(newCartRows);
  };

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
  const showButtons = (isCreation = false) => {
   if(isCreation){
     return true;
   }
   if(!currentStage || !Object.keys(currentStage).length > 0){
     return false;
   };

   const stageApprovals = currentStage.approvals.map(({_id}) => _id);
   const thisApproval = currentStage.approvals.find(({_id}) => user.id === _id )
   if(!stageApprovals.includes(user.id) || !thisApproval || thisApproval.fulfilled ){
     return false;
   }
   
    return true;
  };

  const showGoBack = () => {
    if(!Object.keys(currentStage).length > 0){
      return false;
    };

    if(!currentStage.goBackEnabled){
      return false;
    }
    return true;
  };

  const goBackConfirmationMessage = () => {
    if(!Object.keys(processInfo).length){
      return;
    }
    var stageName;
    var stageNumber;
    Object.keys(processInfo.processData.stages).map((stage, ix) => {
      if(processInfo.processData.stages[stage].stageId === currentStage?.goBackTo){
        stageName = processInfo.processData.stages[stage].stageName;
        stageNumber = ix + 1;
      }
    });
    
    return (
      <>
        <h6>
          Doing so will send this process back to the Stage number: <strong>{stageNumber}</strong> called: <strong>{stageName}</strong>
        </h6>
        <h6>
          All changes made from that stage to the current one will be deleted.
        </h6>
      </>
    )
  };

  const goBackConfirmation = () => {
    goBackLogic(currentStage);
    setGoBackModal(false);
  };

  return (
    <div>
      <ModalYesNo
        showModal={goBackModal}
        onOK={() => goBackConfirmation()}
        onCancel={() => setGoBackModal(false)}
        title={'Are you sure you want to send back this Process?'}
        message={goBackConfirmationMessage()}
      />
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
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', marginBottom: '25px' }}>
                  {
                    showGoBack() && (
                      <Button
                        color="secondary"
                        startIcon={<Icon>arrow_back</Icon>}
                        style={{ backgroundColor: '#1b39d1'}}
                        onClick={() => setGoBackModal(true)}
                        variant="contained"
                      >
                        Go Back
                      </Button>
                    )
                  }
              </div>
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
              processInfo={processInfo}
              updateAssetValues={(newCartRows) => handleChangeAssetValues(newCartRows)}
              showAssetEdition={() => showButtons(processInfo.processData.currentStage === 0)}
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
