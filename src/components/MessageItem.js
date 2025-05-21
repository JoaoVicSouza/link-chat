import React from 'react';
import './MessageItem.css';

export default ({data, user}) => {

    return (
        <div 
        className="messageLine"
        style={{
            justifyContent: user === data.author ? 'flex-end': 'flex-start'
        }}
        >
            <div 
            className="messageItem"
                style={{backgroundColor: user === data.author ? '#dcf8c6' : '#fff'}}
            >
                <div className="messageText">{data.body}</div>
                <div className="messageDate">18:99</div>
            </div>
        </div>
    )
}


