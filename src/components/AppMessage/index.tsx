import React from 'react'
import { useFormFields } from 'payload/components/forms';
import '../styles/styles.scss';

const AppMessage: React.FC = (props: { text, type, subTxt }) => {
  const text = props.text;
  const msgType = props.type;
  const description = props.subTxt;

  let icon ="icon-info" 
  if(msgType == "warnMsg")icon =" icon-warn" 
  else if(msgType == "errMsg")icon =" icon-err" 
  else if(msgType == "waitMsg")icon =" icon-wait"
  else if(msgType == "guideMsg")icon =" icon-up"
  
  return (
    <div className={`app-msg-container ${msgType}`}>
      <div className='prefix'><div className={`r-icon ${icon}`}></div></div>
      <div className='suffix'>
        <div className='app-message'>{text}</div>
        <span>{description}</span>
      </div>
    </div>
  );

};

export default AppMessage;
