import React, { Component, useState } from 'react';
import { EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import htmlToDraft from 'html-to-draftjs';

const Preview = ({ preview }) => {

  const html = preview;
  const blocksFromHtml = htmlToDraft(html);
  const { contentBlocks, entityMap } = blocksFromHtml;
  const contentState = ContentState.createFromBlockArray(
    contentBlocks,
    entityMap
  );
  const editorState = EditorState.createWithContent(contentState);

  return (
    <div className='__container-p'>
      <Editor editorState={editorState} toolbarHidden={true} readOnly={true} />
    </div>
  );
};

export default Preview;
