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

const assetsRows = [
  { numeration: '1', name: 'TV', Brand: 'TV', model: 'TV', Serial: 'TV', EPC: 'TV' },
  { numeration: '2', name: 'Lavadora', Brand: 'Lavadora', model: 'Lavadora', Serial: 'Lavadora', EPC: 'Lavadora' },
  { numeration: '3', name: 'Licuadora', Brand: 'Licuadora', model: 'Licuadora', Serial: 'Licuadora', EPC: 'Licuadora' },
  { numeration: '4', name: 'Camión', Brand: 'Camión', model: 'Camión', Serial: 'Camión', EPC: 'Camión' },
  { numeration: '5', name: 'Cuchara', Brand: 'Cuchara', model: 'Cuchara', Serial: 'Cuchara', EPC: 'Cuchara' },
  { numeration: '6', name: 'TV', Brand: 'TV', model: 'TV', Serial: 'TV', EPC: 'TV' },
  { numeration: '7', name: 'Lavadora', Brand: 'Lavadora', model: 'Lavadora', Serial: 'Lavadora', EPC: 'Lavadora' },
  { numeration: '8', name: 'Licuadora', Brand: 'Licuadora', model: 'Licuadora', Serial: 'Licuadora', EPC: 'Licuadora' },
  { numeration: '9', name: 'Camión', Brand: 'Camión', model: 'Camión', Serial: 'Camión', EPC: 'Camión' },
  { numeration: '10', name: 'Cuchara', Brand: 'Cuchara', model: 'Cuchara', Serial: 'Cuchara', EPC: 'Cuchara' },
  { numeration: '11', name: 'TV', Brand: 'TV', model: 'TV', Serial: 'TV', EPC: 'TV' },
  { numeration: '12', name: 'Lavadora', Brand: 'Lavadora', model: 'Lavadora', Serial: 'Lavadora', EPC: 'Lavadora' },
  { numeration: '13', name: 'Licuadora', Brand: 'Licuadora', model: 'Licuadora', Serial: 'Licuadora', EPC: 'Licuadora' },
  { numeration: '14', name: 'Camión', Brand: 'Camión', model: 'Camión', Serial: 'Camión', EPC: 'Camión' },
  { numeration: '15', name: 'Cuchara', Brand: 'Cuchara', model: 'Cuchara', Serial: 'Cuchara', EPC: 'Cuchara' },
  { numeration: '16', name: 'TV', Brand: 'TV', model: 'TV', Serial: 'TV', EPC: 'TV' },
  { numeration: '17', name: 'Lavadora', Brand: 'Lavadora', model: 'Lavadora', Serial: 'Lavadora', EPC: 'Lavadora' },
  { numeration: '18', name: 'Licuadora', Brand: 'Licuadora', model: 'Licuadora', Serial: 'Licuadora', EPC: 'Licuadora' },
  { numeration: '19', name: 'Camión', Brand: 'Camión', model: 'Camión', Serial: 'Camión', EPC: 'Camión' },
  { numeration: '20', name: 'Cuchara', Brand: 'Cuchara', model: 'Cuchara', Serial: 'Cuchara', EPC: 'Cuchara' },
  { numeration: '21', name: 'TV', Brand: 'TV', model: 'TV', Serial: 'TV', EPC: 'TV' },
  { numeration: '22', name: 'Lavadora', Brand: 'Lavadora', model: 'Lavadora', Serial: 'Lavadora', EPC: 'Lavadora' },
  { numeration: '23', name: 'Licuadora', Brand: 'Licuadora', model: 'Licuadora', Serial: 'Licuadora', EPC: 'Licuadora' },
  { numeration: '24', name: 'Camión', Brand: 'Camión', model: 'Camión', Serial: 'Camión', EPC: 'Camión' },
  { numeration: '25', name: 'Cuchara', Brand: 'Cuchara', model: 'Cuchara', Serial: 'Cuchara', EPC: 'Cuchara' },
  { numeration: '26', name: 'TV', Brand: 'TV', model: 'TV', Serial: 'TV', EPC: 'TV' },
  { numeration: '27', name: 'Lavadora', Brand: 'Lavadora', model: 'Lavadora', Serial: 'Lavadora', EPC: 'Lavadora' },
  { numeration: '28', name: 'Licuadora', Brand: 'Licuadora', model: 'Licuadora', Serial: 'Licuadora', EPC: 'Licuadora' },
  { numeration: '29', name: 'Camión', Brand: 'Camión', model: 'Camión', Serial: 'Camión', EPC: 'Camión' },
  { numeration: '30', name: 'Cuchara', Brand: 'Cuchara', model: 'Cuchara', Serial: 'Cuchara', EPC: 'Cuchara' },
  { numeration: '31', name: 'TV', Brand: 'TV', model: 'TV', Serial: 'TV', EPC: 'TV' },
  { numeration: '32', name: 'Lavadora', Brand: 'Lavadora', model: 'Lavadora', Serial: 'Lavadora', EPC: 'Lavadora' },
  { numeration: '33', name: 'Licuadora', Brand: 'Licuadora', model: 'Licuadora', Serial: 'Licuadora', EPC: 'Licuadora' },
  { numeration: '34', name: 'Camión', Brand: 'Camión', model: 'Camión', Serial: 'Camión', EPC: 'Camión' },
  { numeration: '35', name: 'Cuchara', Brand: 'Cuchara', model: 'Cuchara', Serial: 'Cuchara', EPC: 'Cuchara' },
  { numeration: '36', name: 'TV', Brand: 'TV', model: 'TV', Serial: 'TV', EPC: 'TV' },
  { numeration: '37', name: 'Lavadora', Brand: 'Lavadora', model: 'Lavadora', Serial: 'Lavadora', EPC: 'Lavadora' },
  { numeration: '38', name: 'Licuadora', Brand: 'Licuadora', model: 'Licuadora', Serial: 'Licuadora', EPC: 'Licuadora' },
  { numeration: '39', name: 'Camión', Brand: 'Camión', model: 'Camión', Serial: 'Camión', EPC: 'Camión' },
  { numeration: '40', name: 'Cuchara', Brand: 'Cuchara', model: 'Cuchara', Serial: 'Cuchara', EPC: 'Cuchara' },
  { numeration: '41', name: 'TV', Brand: 'TV', model: 'TV', Serial: 'TV', EPC: 'TV' },
  { numeration: '42', name: 'Lavadora', Brand: 'Lavadora', model: 'Lavadora', Serial: 'Lavadora', EPC: 'Lavadora' },
  { numeration: '43', name: 'Licuadora', Brand: 'Licuadora', model: 'Licuadora', Serial: 'Licuadora', EPC: 'Licuadora' },
  { numeration: '44', name: 'Camión', Brand: 'Camión', model: 'Camión', Serial: 'Camión', EPC: 'Camión' },
  { numeration: '45', name: 'Cuchara', Brand: 'Cuchara', model: 'Cuchara', Serial: 'Cuchara', EPC: 'Cuchara' },
  { numeration: '46', name: 'TV', Brand: 'TV', model: 'TV', Serial: 'TV', EPC: 'TV' },
  { numeration: '47', name: 'Lavadora', Brand: 'Lavadora', model: 'Lavadora', Serial: 'Lavadora', EPC: 'Lavadora' },
  { numeration: '48', name: 'Licuadora', Brand: 'Licuadora', model: 'Licuadora', Serial: 'Licuadora', EPC: 'Licuadora' },
  { numeration: '49', name: 'Camión', Brand: 'Camión', model: 'Camión', Serial: 'Camión', EPC: 'Camión' },
  { numeration: '50', name: 'Cuchara', Brand: 'Cuchara', model: 'Cuchara', Serial: 'Cuchara', EPC: 'Cuchara' },
  { numeration: '51', name: 'TV', Brand: 'TV', model: 'TV', Serial: 'TV', EPC: 'TV' },
  { numeration: '52', name: 'Lavadora', Brand: 'Lavadora', model: 'Lavadora', Serial: 'Lavadora', EPC: 'Lavadora' },
  { numeration: '53', name: 'Licuadora', Brand: 'Licuadora', model: 'Licuadora', Serial: 'Licuadora', EPC: 'Licuadora' },
  { numeration: '54', name: 'Camión', Brand: 'Camión', model: 'Camión', Serial: 'Camión', EPC: 'Camión' },
  { numeration: '55', name: 'Cuchara', Brand: 'Cuchara', model: 'Cuchara', Serial: 'Cuchara', EPC: 'Cuchara' },
  { numeration: '56', name: 'TV', Brand: 'TV', model: 'TV', Serial: 'TV', EPC: 'TV' },
  { numeration: '57', name: 'Lavadora', Brand: 'Lavadora', model: 'Lavadora', Serial: 'Lavadora', EPC: 'Lavadora' },
  { numeration: '58', name: 'Licuadora', Brand: 'Licuadora', model: 'Licuadora', Serial: 'Licuadora', EPC: 'Licuadora' },
  { numeration: '59', name: 'Camión', Brand: 'Camión', model: 'Camión', Serial: 'Camión', EPC: 'Camión' },
  { numeration: '60', name: 'Cuchara', Brand: 'Cuchara', model: 'Cuchara', Serial: 'Cuchara', EPC: 'Cuchara' },
  { numeration: '61', name: 'TV', Brand: 'TV', model: 'TV', Serial: 'TV', EPC: 'TV' },
  { numeration: '62', name: 'Lavadora', Brand: 'Lavadora', model: 'Lavadora', Serial: 'Lavadora', EPC: 'Lavadora' },
  { numeration: '63', name: 'Licuadora', Brand: 'Licuadora', model: 'Licuadora', Serial: 'Licuadora', EPC: 'Licuadora' },
  { numeration: '64', name: 'Camión', Brand: 'Camión', model: 'Camión', Serial: 'Camión', EPC: 'Camión' },
  { numeration: '65', name: 'Cuchara', Brand: 'Cuchara', model: 'Cuchara', Serial: 'Cuchara', EPC: 'Cuchara' },
  { numeration: '66', name: 'TV', Brand: 'TV', model: 'TV', Serial: 'TV', EPC: 'TV' },
  { numeration: '67', name: 'Lavadora', Brand: 'Lavadora', model: 'Lavadora', Serial: 'Lavadora', EPC: 'Lavadora' },
  { numeration: '68', name: 'Licuadora', Brand: 'Licuadora', model: 'Licuadora', Serial: 'Licuadora', EPC: 'Licuadora' },
  { numeration: '69', name: 'Camión', Brand: 'Camión', model: 'Camión', Serial: 'Camión', EPC: 'Camión' },
  { numeration: '70', name: 'Cuchara', Brand: 'Cuchara', model: 'Cuchara', Serial: 'Cuchara', EPC: 'Cuchara' },
  { numeration: '71', name: 'TV', Brand: 'TV', model: 'TV', Serial: 'TV', EPC: 'TV' },
  { numeration: '72', name: 'Lavadora', Brand: 'Lavadora', model: 'Lavadora', Serial: 'Lavadora', EPC: 'Lavadora' },
  { numeration: '73', name: 'Licuadora', Brand: 'Licuadora', model: 'Licuadora', Serial: 'Licuadora', EPC: 'Licuadora' },
  { numeration: '74', name: 'Camión', Brand: 'Camión', model: 'Camión', Serial: 'Camión', EPC: 'Camión' },
  { numeration: '75', name: 'Cuchara', Brand: 'Cuchara', model: 'Cuchara', Serial: 'Cuchara', EPC: 'Cuchara' },
  { numeration: '76', name: 'TV', Brand: 'TV', model: 'TV', Serial: 'TV', EPC: 'TV' },
  { numeration: '77', name: 'Lavadora', Brand: 'Lavadora', model: 'Lavadora', Serial: 'Lavadora', EPC: 'Lavadora' },
  { numeration: '78', name: 'Licuadora', Brand: 'Licuadora', model: 'Licuadora', Serial: 'Licuadora', EPC: 'Licuadora' },
  { numeration: '79', name: 'Camión', Brand: 'Camión', model: 'Camión', Serial: 'Camión', EPC: 'Camión' },
  { numeration: '80', name: 'Cuchara', Brand: 'Cuchara', model: 'Cuchara', Serial: 'Cuchara', EPC: 'Cuchara' },
  { numeration: '81', name: 'TV', Brand: 'TV', model: 'TV', Serial: 'TV', EPC: 'TV' },
  { numeration: '82', name: 'Lavadora', Brand: 'Lavadora', model: 'Lavadora', Serial: 'Lavadora', EPC: 'Lavadora' },
  { numeration: '83', name: 'Licuadora', Brand: 'Licuadora', model: 'Licuadora', Serial: 'Licuadora', EPC: 'Licuadora' },
  { numeration: '84', name: 'Camión', Brand: 'Camión', model: 'Camión', Serial: 'Camión', EPC: 'Camión' },
  { numeration: '85', name: 'Cuchara', Brand: 'Cuchara', model: 'Cuchara', Serial: 'Cuchara', EPC: 'Cuchara' },
  { numeration: '86', name: 'TV', Brand: 'TV', model: 'TV', Serial: 'TV', EPC: 'TV' },
  { numeration: '87', name: 'Lavadora', Brand: 'Lavadora', model: 'Lavadora', Serial: 'Lavadora', EPC: 'Lavadora' },
  { numeration: '88', name: 'Licuadora', Brand: 'Licuadora', model: 'Licuadora', Serial: 'Licuadora', EPC: 'Licuadora' },
  { numeration: '89', name: 'Camión', Brand: 'Camión', model: 'Camión', Serial: 'Camión', EPC: 'Camión' },
  { numeration: '90', name: 'Cuchara', Brand: 'Cuchara', model: 'Cuchara', Serial: 'Cuchara', EPC: 'Cuchara' },
  { numeration: '91', name: 'TV', Brand: 'TV', model: 'TV', Serial: 'TV', EPC: 'TV' },
  { numeration: '92', name: 'Lavadora', Brand: 'Lavadora', model: 'Lavadora', Serial: 'Lavadora', EPC: 'Lavadora' },
  { numeration: '93', name: 'Licuadora', Brand: 'Licuadora', model: 'Licuadora', Serial: 'Licuadora', EPC: 'Licuadora' },
  { numeration: '94', name: 'Camión', Brand: 'Camión', model: 'Camión', Serial: 'Camión', EPC: 'Camión' },
  { numeration: '95', name: 'Cuchara', Brand: 'Cuchara', model: 'Cuchara', Serial: 'Cuchara', EPC: 'Cuchara' },
  { numeration: '96', name: 'TV', Brand: 'TV', model: 'TV', Serial: 'TV', EPC: 'TV' },
  { numeration: '97', name: 'Lavadora', Brand: 'Lavadora', model: 'Lavadora', Serial: 'Lavadora', EPC: 'Lavadora' },
  { numeration: '98', name: 'Licuadora', Brand: 'Licuadora', model: 'Licuadora', Serial: 'Licuadora', EPC: 'Licuadora' },
  { numeration: '99', name: 'Camión', Brand: 'Camión', model: 'Camión', Serial: 'Camión', EPC: 'Camión' },
  { numeration: '100', name: 'Cuchara', Brand: 'Cuchara', model: 'Cuchara', Serial: 'Cuchara', EPC: 'Cuchara' },
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
  const currentTime = `${formatDate.getHours()}:${formatDate.getMinutes()}:${formatDate.getSeconds()}`;

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
  }, [htmlPreview])

  const previewPdf = () => {
    let htmlToPrint = document.getElementsByClassName('modal-assignment-content');
    let windowToPrint = window.open('', 'Generate Report');
    windowToPrint.document.open();
    windowToPrint.document.write(
      `<!DOCTYPE html>
        <html lang="en">
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
        onClose={handleCloseModal}
        open={showModal}
        className='modal-pdf'
      >
        <div className='modal-pdf-size'>
          <div>
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
                  // rows={assignmentReportRows}
                  rows={assetsRows}
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
