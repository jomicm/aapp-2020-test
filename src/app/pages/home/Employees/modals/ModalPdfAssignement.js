import React, { useEffect, useState } from 'react'
import { EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import htmlToDraft from 'html-to-draftjs';
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
  import { withStyles, useTheme, makeStyles } from '@material-ui/core/styles';
  import {
    PortletBody,
  } from '../../../../../app/partials/content/Portlet';
  import { getDB, deleteDB } from '../../../../crud/api';
  import './ModalPdfAssignement.scss';

  const dataMock = [
      {name: 'lavadora', brand: 'LG', model: 'Reciente'},
      {name: 'Licuadora', brand: 'Tfal', model: 'Reciente'},
      {name: 'TV', brand: 'Samsung', model: 'Reciente'},
      {name: 'MP3', brand: 'wav', model: 'Reciente'},
      {name: 'MP4', brand: 'wav', model: 'Reciente'},
      {name: 'Silla', brand: 'RTX', model: 'Reciente'},
      {name: 'Mesa', brand: 'MBE', model: 'Reciente'},
      {name: 'Lamapara', brand: 'MSO', model: 'Reciente'},
      {name: 'Carro', brand: 'Nissan', model: 'Reciente'},
      {name: 'Camioneta', brand: 'Nissan', model: 'Reciente'},
      {name: 'Xbox', brand: 'Microsoft', model: 'Reciente'},
      {name: 'PlayStation', brand: 'Sony', model: 'Reciente'},
      {name: 'Nintendo', brand: 'Nintendo', model: 'Reciente'},
      {name: 'Computadora', brand: 'HP', model: 'Reciente'},
      {name: 'Laptop', brand: 'HP', model: 'Reciente'},
      {name: 'lavadora', brand: 'LG', model: 'Reciente'},
      {name: 'Licuadora', brand: 'Tfal', model: 'Reciente'},
      {name: 'TV', brand: 'Samsung', model: 'Reciente'},
      {name: 'MP3', brand: 'wav', model: 'Reciente'},
      {name: 'MP4', brand: 'wav', model: 'Reciente'},
      {name: 'Silla', brand: 'RTX', model: 'Reciente'},
      {name: 'Mesa', brand: 'MBE', model: 'Reciente'},
      {name: 'Lamapara', brand: 'MSO', model: 'Reciente'},
      {name: 'Carro', brand: 'Nissan', model: 'Reciente'},
      {name: 'Camioneta', brand: 'Nissan', model: 'Reciente'},
      {name: 'Xbox', brand: 'Microsoft', model: 'Reciente'},
      {name: 'PlayStation', brand: 'Sony', model: 'Reciente'},
      {name: 'Nintendo', brand: 'Nintendo', model: 'Reciente'},
      {name: 'Computadora', brand: 'HP', model: 'Reciente'},
      {name: 'Laptop', brand: 'HP', model: 'Reciente'},
      {name: 'lavadora', brand: 'LG', model: 'Reciente'},
      {name: 'Licuadora', brand: 'Tfal', model: 'Reciente'},
      {name: 'TV', brand: 'Samsung', model: 'Reciente'},
      {name: 'MP3', brand: 'wav', model: 'Reciente'},
      {name: 'MP4', brand: 'wav', model: 'Reciente'},
      {name: 'Silla', brand: 'RTX', model: 'Reciente'},
      {name: 'Mesa', brand: 'MBE', model: 'Reciente'},
      {name: 'Lamapara', brand: 'MSO', model: 'Reciente'},
      {name: 'Carro', brand: 'Nissan', model: 'Reciente'},
      {name: 'Camioneta', brand: 'Nissan', model: 'Reciente'},
      {name: 'Xbox', brand: 'Microsoft', model: 'Reciente'},
      {name: 'PlayStation', brand: 'Sony', model: 'Reciente'},
      {name: 'Nintendo', brand: 'Nintendo', model: 'Reciente'},
      {name: 'Computadora', brand: 'HP', model: 'Reciente'},
      {name: 'Laptop', brand: 'HP', model: 'Reciente'},
      {name: 'lavadora', brand: 'LG', model: 'Reciente'},
      {name: 'Licuadora', brand: 'Tfal', model: 'Reciente'},
      {name: 'TV', brand: 'Samsung', model: 'Reciente'},
      {name: 'MP3', brand: 'wav', model: 'Reciente'},
      {name: 'MP4', brand: 'wav', model: 'Reciente'},
      {name: 'Silla', brand: 'RTX', model: 'Reciente'},
      {name: 'Mesa', brand: 'MBE', model: 'Reciente'},
      {name: 'Lamapara', brand: 'MSO', model: 'Reciente'},
      {name: 'Carro', brand: 'Nissan', model: 'Reciente'},
      {name: 'Camioneta', brand: 'Nissan', model: 'Reciente'},
      {name: 'Xbox', brand: 'Microsoft', model: 'Reciente'},
      {name: 'PlayStation', brand: 'Sony', model: 'Reciente'},
      {name: 'Nintendo', brand: 'Nintendo', model: 'Reciente'},
      {name: 'Computadora', brand: 'HP', model: 'Reciente'},
      {name: 'Laptop', brand: 'HP', model: 'Reciente'},
      {name: 'lavadora', brand: 'LG', model: 'Reciente'},
      {name: 'Licuadora', brand: 'Tfal', model: 'Reciente'},
      {name: 'TV', brand: 'Samsung', model: 'Reciente'},
      {name: 'MP3', brand: 'wav', model: 'Reciente'},
      {name: 'MP4', brand: 'wav', model: 'Reciente'},
      {name: 'Silla', brand: 'RTX', model: 'Reciente'},
      {name: 'Mesa', brand: 'MBE', model: 'Reciente'},
      {name: 'Lamapara', brand: 'MSO', model: 'Reciente'},
      {name: 'Carro', brand: 'Nissan', model: 'Reciente'},
      {name: 'Camioneta', brand: 'Nissan', model: 'Reciente'},
      {name: 'Xbox', brand: 'Microsoft', model: 'Reciente'},
      {name: 'PlayStation', brand: 'Sony', model: 'Reciente'},
      {name: 'Nintendo', brand: 'Nintendo', model: 'Reciente'},
      {name: 'Computadora', brand: 'HP', model: 'Reciente'},
      {name: 'Laptop', brand: 'HP', model: 'Reciente'},
      {name: 'lavadora', brand: 'LG', model: 'Reciente'},
      {name: 'Licuadora', brand: 'Tfal', model: 'Reciente'},
      {name: 'TV', brand: 'Samsung', model: 'Reciente'},
      {name: 'MP3', brand: 'wav', model: 'Reciente'},
      {name: 'MP4', brand: 'wav', model: 'Reciente'},
      {name: 'Silla', brand: 'RTX', model: 'Reciente'},
      {name: 'Mesa', brand: 'MBE', model: 'Reciente'},
      {name: 'Lamapara', brand: 'MSO', model: 'Reciente'},
      {name: 'Carro', brand: 'Nissan', model: 'Reciente'},
      {name: 'Camioneta', brand: 'Nissan', model: 'Reciente'},
      {name: 'Xbox', brand: 'Microsoft', model: 'Reciente'},
      {name: 'PlayStation', brand: 'Sony', model: 'Reciente'},
      {name: 'Nintendo', brand: 'Nintendo', model: 'Reciente'},
      {name: 'Computadora', brand: 'HP', model: 'Reciente'},
      {name: 'Laptop', brand: 'HP', model: 'Reciente'},
    ]

const ModalPdfAssignement = ({
    assetRows,
    layoutSelected,
    setShowModal,
    showModal
    }) => {
    const [editorState, setEditorState] = useState(null)
    const [disabledButton, setDisabledButton] = useState(false)

  const handleCloseModal = () => {
    setShowModal(false);
    };

    useEffect(() => {
        getDB('settingsLayoutsEmployees')
        .then((response) => response.json())
        .then((data) => {
            const htmlPreview = data.response.filter(({ name }) => name === layoutSelected.label)
            const html = htmlPreview[0].layout
            const blocksFromHtml = htmlToDraft(html);
            const { contentBlocks, entityMap } = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(
              contentBlocks,
              entityMap
              );
            setEditorState(EditorState.createWithContent(contentState));
        })
        .catch((error) => console.log('error>', error));
    }, [layoutSelected])

    const previewPDF = () => {
        // setDisabledButton(true)
        // setTimeout(() => {
        //     window.print()
        //     setDisabledButton(false)
        // },250)
        let htmlToPrint = document.getElementsByClassName('modal-pdf-content')
        let windowToPrint = window.open('', 'Generate Report');
        windowToPrint.document.open() 
        windowToPrint.document.write(`<html><head><title>Generate Report</title></head>`)
        windowToPrint.document.write(htmlToPrint[0].innerHTML)
        windowToPrint.document.write(`</html>`)
        windowToPrint.document.close()
        windowToPrint.print();
    }

    const tableGeneratePdfRows = (ix) => (
     (ix % 2 === 0) ? {backgroundColor: 'white'} : {backgroundColor: '#CCD1D1'}
    )

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
            <div className='modal-pdf-content'>
                <PortletBody>
                    <div>
                        <table className='table-generate-pdf' style={{ width: '100%' }}>
                            <tr className='table-generate-pdf-headers' style={{ color: 'white', backgroundColor: '#154360'}}>
                                <th>Name</th>
                                <th>Brand</th>
                                <th>Model</th>
                            </tr>
                            {dataMock.map(({ name, brand, model }, ix) => (    
                            <tr className='table-generate-pdf-rows' style={tableGeneratePdfRows(ix)}>
                                <td>{name}</td>
                                <td>{brand}</td>
                                <td>{model}</td>
                            </tr>
                        ))
                    }
                        </table>
                        <Editor editorState={editorState} toolbarHidden={true} readOnly={true} />
                    </div>
                </PortletBody>
            </div>
        </div>
      </Dialog>
    </div>
  )
}

export default ModalPdfAssignement;
