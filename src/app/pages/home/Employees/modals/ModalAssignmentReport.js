import React, { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import htmlToDraft from 'html-to-draftjs';
import isNil from 'lodash/isNil';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  TextField,
  Typography
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {
  PortletBody
} from '../../../../partials/content/Portlet';
import { getVariables } from '../../utils';
import SimpleTable from '../../Components/SimpleTable';
import WrapperEditor from '../components/WrapperEditor';
import './ModalAssignmentReport.scss';

const AssignmentReportHeadRows = [
  { id: 'numeration', label: 'No.' },
  { id: 'name', label: 'Name' },
  { id: 'brand', label: 'Brand' },
  { id: 'model', label: 'Model' },
  { id: 'serial', label: 'Serial' },
  { id: 'epc', label: 'EPC' }
];

const ModalPdfAssignement = ({
  assetRows,
  htmlPreview,
  setShowModal,
  showModal,
  values
}) => {
  const [assignmentReportRows, setAssignmentReportRows] = useState([]);
  const [disabledButton, setDisabledButton] = useState(false);
  const [firstChunk, setFirstChunk] = useState('');
  const [secondChunk, setSecondChunk] = useState('');
  const { name, lastName } = values;
  const formatDate = new Date();
  const dformat = `${('0' + formatDate.getDate()).slice(-2)}/${('0' + formatDate.getMonth() + 1).slice(-2)}/${formatDate.getFullYear()}`;
  const tformat = `${formatDate.getHours()}:${formatDate.getMinutes()}:${formatDate.getSeconds()}`;

  const mapVariables = {
    employeeName: `${name} ${lastName}`,
    employeeAssets: '',
    currentDate: dformat,
    currentTime: tformat
  }

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const filteredData = assetRows.map(({ name, brand, model, serial, EPC }, ix) => (
      {
        no: ix + 1,
        name,
        brand,
        model,
        serial,
        EPC
      }
    ))
    setAssignmentReportRows(filteredData);
  }, [assetRows])

  useEffect(() => {
    let html = htmlPreview.length ? htmlPreview[0].layout : [];
    const variables = getVariables(html);
    let offsetVar = 0;
    variables.forEach(({ varName, start, end }) => {
      let htmlArr = html.split('');
      const variableContent = mapVariables[varName];
      const result = isNil(result);
      if (result) {
        htmlArr.splice(start - offsetVar, (end - start) + 1, variableContent);
        offsetVar += varName.length - 2;
      }
      html = htmlArr.join('');
      setFirstChunk(html);
    })
  }, [htmlPreview])

  const previewPDF = () => {
    let htmlToPrint = document.getElementsByClassName('modal-assignment-content');
    let windowToPrint = window.open('', 'Generate Report');
    windowToPrint.document.open();
    windowToPrint.document.write(`<html><head><title>Generate Report</title></head>`);
    windowToPrint.document.write(htmlToPrint[0].innerHTML);
    windowToPrint.document.write(`</html>`);
    windowToPrint.document.close();
    windowToPrint.print();
  }

  return (
    <div style={{ width: '100%' }}>
      <Dialog
        aria-labelledby='customized-dialog'
        onClose={handleCloseModal}
        open={showModal}
        className='modal-pdf'
      >
        <div className='modal-pdf-size'>
          <div style={disabledButton ? { display: 'none' } : { display: 'block' }}>
            <DialogTitle disableTypography id='customized-dialog-title' className='title-pdf-bar' onClose={handleCloseModal}>
              <Typography variant='h6'> Generate Report </Typography>
              <IconButton
                aria-label='Close'
                onClick={handleCloseModal}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <Divider />
          </div>
          <div className='button-print-pdf'>
            <Button
              color='primary'
              onClick={previewPDF}
              size='large'
              style={disabledButton ? { display: 'none' } : { display: 'block' }}
              variant='contained'
            >
              Print / PDF
            </Button>
          </div>
          <div className='modal-assignment-content'>
            <PortletBody>
              <div>
                <WrapperEditor
                  html={firstChunk}
                />
                <SimpleTable
                  headRows={AssignmentReportHeadRows}
                  rows={assignmentReportRows}
                />
                <WrapperEditor
                  html={secondChunk}
                />
              </div>
            </PortletBody>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default ModalPdfAssignement;
