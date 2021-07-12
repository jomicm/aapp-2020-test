/* eslint-disable no-restricted-imports */
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import {
  Card,
  CardContent,
  Typography
} from '@material-ui/core';

import Label from '@material-ui/icons/Label';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import NotificationsIcon from '@material-ui/icons/Notifications';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import SendIcon from '@material-ui/icons/Send';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import EventBusyIcon from '@material-ui/icons/EventBusy';
import EventNoteIcon from '@material-ui/icons/EventNote';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import FeedbackIcon from '@material-ui/icons/Feedback';
import TabletMacIcon from '@material-ui/icons/TabletMac';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const useTreeItemStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.secondary,
    '&:hover > $content': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:focus > $content, &$selected > $content': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
      color: 'var(--tree-view-color)',
    },
    '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
      backgroundColor: 'transparent',
    },
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0),
  },
  labelIcon: {
    marginRight: theme.spacing(1),
  },
  labelText: {
    fontWeight: 'inherit',
    flexGrow: 1,
  },
}));

const StyledTreeItem = (props) => {
  const classes = useTreeItemStyles();
  const { labelText, labelIcon: LabelIcon, labelInfo, color, bgColor, ...other } = props;

  return (
    <TreeItem
      label={
        <div className={classes.labelRoot}>
          <LabelIcon color="red" className={classes.labelIcon} />
          <Typography variant="body2" className={classes.labelText}>
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </div>
      }
      classes={{ root: classes.root }}
      {...other}
    />
  );
};

const getRandomId = () => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

const LiveProcessInfo = ({ processInfo }) => {
  const { processData = {}, requestUser } = processInfo;
  const { email: userEmail, name: userName, lastName: userLastName } = requestUser || {};
  const { name, currentStage, totalStages, selectedProcessType } = processData;
  const selfApprove = processData?.stages?.stage_1.isSelfApprove || selectedProcessType === 'short';
  const processInfoTexts = [
    { label: 'Process Name:', value: name },
    { label: 'Process Creator:', value: `${userName} ${userLastName} (${userEmail})` },
    { label: 'Current Stage:', value: currentStage },
    { label: 'Total Stages:', value: totalStages },
  ];
  const stageFulfilled = Object.values(processData.stages || []).map(({ stageFulfilled }) => ({ stageFulfilled }));
  if (selectedProcessType === 'short') { // If process is 'short' then simulate a single stage fulfilled so the Process shows as completed
    stageFulfilled.push({ stageFulfilled: true });
  }
  const isProcessComplete = stageFulfilled.every(({ stageFulfilled }) => stageFulfilled === true);

  const getApprovedRejectedAssets = (cartRows) => {
    const approved = cartRows.filter(({ status }) => status === 'Approved');
    const rejected = cartRows.filter(({ status }) => status === 'Rejected');
    return (
      <>
        {approved.length !== 0 &&
          <StyledTreeItem
            nodeId={getRandomId()}
            labelText={`Approved Assets`}
            labelIcon={ThumbUpIcon}
            labelInfo={approved.length}
          >
          {approved.map(({ name, brand, model }) => (
            <StyledTreeItem
              nodeId={getRandomId()}
              labelText={`Name: ${name} | Brand: ${brand} | Model: ${model}`}
              labelIcon={TabletMacIcon}
            />
          ))}
          </StyledTreeItem>
        }
        {rejected.length !== 0 &&
          <StyledTreeItem
            nodeId={getRandomId()}
            labelText={`Rejected Assets`}
            labelIcon={ThumbDownIcon}
            labelInfo={rejected.length}
          >
          {rejected.map(({ name, brand, model, message }) => (
            <StyledTreeItem
              nodeId={getRandomId()}
              labelText={`Name: ${name} | Brand: ${brand} | Model: ${model}`}
              labelIcon={TabletMacIcon}
            >
              <StyledTreeItem
                nodeId={getRandomId()}
                labelText={`Reason: ${message}`}
                labelIcon={FeedbackIcon}
              />
            </StyledTreeItem>
          ))}
          </StyledTreeItem>
        }
      </>
    );
  };
  
  return (
    <div style={{ display: 'flex' }}>
      <Card style={{ width: '50%', marginLeft: '0px' }}>
        <CardContent style={{ display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
          {isProcessComplete && stageFulfilled.length !== 0 &&
            <div style={{ display: 'flex', marginTop: '35px', marginBottom: '0', justifyContent: 'center' }}>
              <h4>Process Completed</h4>
              <CheckCircleIcon style={{ color: 'green', marginLeft: '20px' }}/>
            </div>
          }
          {processInfoTexts.map(({ label, value }) => (
            <>
              <h6 style={{ marginTop: '35px', marginBottom: '0', marginLeft: '30px' }}>{label}</h6>
              <span style={{ marginLeft: '150px' }} >{value}</span>    
            </>
          ))}
        </CardContent>
      </Card>
      <TreeView
        defaultExpanded={['5']}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        defaultEndIcon={<div style={{ width: 24 }} />}
        style={{ padding: '40px', width: '50%' }}
      >
        <StyledTreeItem nodeId='1' labelText='All Stages' labelIcon={Label}>
          {Object.entries(processData.stages || {}).map(([key, val]) => (
            <StyledTreeItem
              nodeId={key}
              labelText={`Stage ${key.split('_')[1]} - ${val.stageName}`}
              labelIcon={val.stageFulfilled ? CheckCircleIcon : SubdirectoryArrowRightIcon}
              labelInfo={`${val.stageFulfilled ? 'Completed' : 'In Progress'}`}
            >
              <StyledTreeItem
                nodeId={getRandomId()}
                labelText='Approvals'
                labelIcon={CheckBoxIcon}
                labelInfo={`(${val.approvals.length || 0})`}
              >
                {(val.approvals || []).map(({ cartRows, email, fulfilled, fulfillDate, name, lastName, virtualUser }) => (
                  <StyledTreeItem
                    nodeId={getRandomId()}
                    labelText={`${virtualUser ? (virtualUser === 'boss' ? '[DB] ' : virtualUser === 'locationManager' ? '[LM] ' : virtualUser === 'locationWitness' ? '[LW] ' : virtualUser === 'assetSpecialist' ? '[AS] ' : virtualUser === 'initiator' ? '[PI] ' : '') : ''}${name} ${lastName} (${email})`}
                    labelIcon={!fulfillDate ? HourglassEmptyIcon : AccountCircleIcon}
                    labelInfo={selfApprove || fulfilled === 'skipped' ? 'Skipped' : !fulfillDate ? 'Pending' : 'Fulfilled'}
                  >
                    {fulfillDate &&
                      <>
                        <StyledTreeItem
                          nodeId={getRandomId()}
                          labelText={fulfillDate}
                          labelIcon={fulfilled ? EventAvailableIcon : EventBusyIcon}
                        />
                        {getApprovedRejectedAssets(cartRows)}
                      </>
                    }
                  </StyledTreeItem>
                ))}
              </StyledTreeItem>
              <StyledTreeItem
                nodeId={getRandomId()}
                labelText='Notifications'
                labelIcon={NotificationsIcon}
                labelInfo={`(${val.notifications.length || 0})`}
              >
                {(val.notifications || []).map(({ email, sent, sentDate, name, lastName, virtualUser }) => (
                  <StyledTreeItem
                    nodeId={getRandomId()}
                    labelText={`${virtualUser ? (virtualUser === 'boss' ? '[DB] ' : virtualUser === 'locationManager' ? '[LM] ' : virtualUser === 'locationWitness' ? '[LW] ' : virtualUser === 'assetSpecialist' ? '[AS] ' : '') : ''}${name} ${lastName} (${email})`}
                    labelIcon={!sentDate ? HourglassEmptyIcon : sent ? SendIcon : ThumbDownIcon}
                    labelInfo={selfApprove ? 'Skipped' : !sentDate ? 'Pending' : sent ? 'Sent' : 'Not Sent'}
                  >
                    {sentDate &&
                      <StyledTreeItem
                        nodeId={getRandomId()}
                        labelText={sentDate}
                        labelIcon={EventNoteIcon}
                      />
                    }
                  </StyledTreeItem>
                ))}
              </StyledTreeItem>
            </StyledTreeItem>
          ))}
        </StyledTreeItem>
      </TreeView>
    </div>
  );
};

export default LiveProcessInfo;
