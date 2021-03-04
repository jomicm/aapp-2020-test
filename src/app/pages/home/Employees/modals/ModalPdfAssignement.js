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

const ModalPdfAssignement = ({
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
        setDisabledButton(true)
        setTimeout(() => {
            window.print()
            setDisabledButton(false)
        },250)
    }

  return (
    <div style={{ width: '100%' }}>
      <Dialog
        aria-labelledby='customized-dialog'
        onClose={handleCloseModal}
        open={showModal}
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
