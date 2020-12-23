import React, { useState } from 'react';

const messages = ['msg 1', 'msg 2', 'msg 3', '<h1>Title</h1>'];
// const messagess = [{id: '', subject: '', sender: '', content: '', date}]

const Example = () => {
  const [content, setContent] = useState('Init Val');

  return (
    <div style={{ width: '100%', backgroundColor: 'red', minHeight: '600px', display: 'flex' }}>
      <div style={{ width: '20%', backgroundColor: 'green', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
        {messages.map(msg => (
          <div onClick={() => setContent(msg)} style={{ margin:'15px', backgroundColor: 'orange', minHeight: '100px' }}>
            {msg}
          </div>  
        ))}
      </div>
      <div style={{ width: '80%', backgroundColor: 'yellow', minHeight: '600px' }}>
        <div style={{ backgroundColor: 'red', minHeight: '100px' }}>
          Header
        </div>
        <div style={{ backgroundColor: 'purple', minHeight: '500px', color: 'white' }}>
          {`Content: > ${content}`}
        </div>
      </div>
    </div>
  )
}

export default Example;
