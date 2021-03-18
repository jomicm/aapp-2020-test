import React, { useEffect, useState } from 'react';
import { pick } from 'lodash';
import {
  Button,
  Dialog,
  DialogTitle,
  Divider,
  IconButton,
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

const ModalAssignmentReport = ({
  assetRows,
  htmlPreview,
  setShowModal,
  showModal,
  values
}) => {
  const [assignmentReportRows, setAssignmentReportRows] = useState([]);
  const [htmlTransformed, setHtmlTransformed] = useState({});
  const formatDate = new Date();
  const currentDate = `${(`0${formatDate.getDate()}`).slice(-2)}/${(`0${formatDate.getMonth() + 1}`).slice(-2)}/${formatDate.getFullYear()}`;
  const currentTime = `${formatDate.getHours()}:${`0${formatDate.getMinutes()}`.slice(-2)}:${`0${formatDate.getSeconds()}`.slice(-2)}`;

  const mapVariables = {
    employeeName: `${values.name} ${values.lastName}`,
    employeeAssets: '',
    currentDate,
    currentTime
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const filteredAssets = assetRows.map(
      (asset, ix) => ({ no: ix + 1, ...pick(asset, ['name', 'brand', 'model', 'serial', 'EPC']) })
    );
    setAssignmentReportRows(filteredAssets);
  }, [assetRows]);

  useEffect(() => {
    let html = htmlPreview.length ? htmlPreview[0].layout : '';
    const variables = getVariables(html);
    let offsetVar = 0;

    variables.forEach(({ varName, start, end }) => {
      let htmlArr = html.split('');
      const variableContent = mapVariables[varName];
      if (variableContent) {
        htmlArr.splice(start - offsetVar, (end - start) + 1, variableContent);
        offsetVar += varName.length - variableContent.length + 3;
      }
      html = htmlArr.join('');
    });
    const assetTableIndex = html.indexOf('%{employeeAssets}');
    html = html.replace(/%{employeeAssets}/g, '');
    setHtmlTransformed({
      firsPart: assetTableIndex >= 0 ? html.substr(0, assetTableIndex) : html,
      secondPart: assetTableIndex >= 0 ? html.substr(assetTableIndex, html.length - 1) : ''
    });
  }, [htmlPreview]);

  const previewPdf = () => {
    let htmlToPrint = document.getElementsByClassName('modal-assignment-content');
    let windowToPrint = window.open('', 'Generate Report');
    windowToPrint.document.open();
    windowToPrint.document.write(
      `<!DOCTYPE html>
        <html lang='en'>
          <head>
            <title>Generate Report</title>
          </head>
          <body>`
    );
    windowToPrint.document.write(htmlToPrint[0].innerHTML);
    windowToPrint.document.write(`</body></html>`);
    windowToPrint.document.close();
    windowToPrint.print();
  }

  return (
    <div style={{ width: '100%' }}>
      <Dialog
        aria-labelledby='customized-dialog'
        className='modal-pdf'
        onClose={handleCloseModal}
        open={showModal}
      >
        <div className='modal-pdf-size'>
          <div>
            <DialogTitle
              className='title-pdf-bar'
              disableTypography
              id='customized-dialog-title'
              onClose={handleCloseModal}
            >
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
              onClick={previewPdf}
              size='large'
              variant='contained'
            >
              Print / PDF
            </Button>
          </div>
          <div>
            <PortletBody>
              <div className='modal-assignment-content'>
                <WrapperEditor
                  html={htmlTransformed.firsPart}
                />
                <SimpleTable
                  headRows={AssignmentReportHeadRows}
                  rows={assignmentReportRows}
                />
                <WrapperEditor
                  html={htmlTransformed.secondPart}
                />
              </div>
            </PortletBody>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default ModalAssignmentReport;
