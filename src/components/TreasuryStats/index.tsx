import React, { useEffect, useState } from 'react'
import { useFormFields } from 'payload/components/forms';
import '../styles/styles.scss';
import { getMessage, setMessage, registerCallback } from '../../frontHelpers/state/notifications';

const TreasuryStats: React.FC = (props: { text, type, subTxt }) => {
    const text = props.text;
    const msgType = props.type;
    const description = props.subTxt;

    const [message, setMessage] = useState(''); // create state for message
    const [hidden, setHidden] = useState(false); // create state for component visibility

    useEffect(() => {
        const updateMessage = (newMessage) => {
            console.log("REACT  | updateMessage | newMessage: ", newMessage)
            setMessage(newMessage); // update state with new message
        };

        getMessage(updateMessage); // get initial message from state manager
        registerCallback(updateMessage); // register updateMessage function as a callback
    }, []);

    useEffect(() => {
        setHidden(message === ''); // set visibility based on message state
    }, [message]);

    return (
        <div className={`app-msg-container ${msgType} `}>
            <div className='suffix'>
                <div className='app-message'>{message}</div>
            </div>
        </div>
    );
};

export default TreasuryStats;
