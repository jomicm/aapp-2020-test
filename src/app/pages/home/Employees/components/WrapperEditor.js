import React, { useEffect, useState } from 'react';
import { EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import htmlToDraft from 'html-to-draftjs';

const WrapperEditor = ({ html }) => {
  const [editorState, setEditorState] = useState(null);

  useEffect(() => {
    const firstBlocksFromHtml = htmlToDraft(html);
    const { contentBlocks, entityMap } = firstBlocksFromHtml;
    const contentState = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap
    );
    setEditorState(EditorState.createWithContent(contentState));
  }, [html])

  return (
    <Editor editorState={editorState} readOnly={true} toolbarHidden={true} />
  )
}

export default WrapperEditor;
