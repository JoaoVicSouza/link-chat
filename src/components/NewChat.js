import React, { useState, useEffect } from 'react';
import './NewChat.css';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default ({user, chatlist, show, setShow}) => {
    const [list, setList] = useState([]);

    useEffect(() => {
        const getList = async () => {

        }
        getList();
    }, [user]);

    const handleClose = () => {
        setShow(false);
    }

    return (
        <div className="newChat" style={{left: show ? 0 : -415}}>
            <div className="newChat--head"> 
                <div onClick={handleClose} className="newChat--backButton">
                    <ArrowBackIcon style={{color: '#FFFFFF'}} />
                </div>
                <div className="newChat--headtitle"> Nova conversa </div> 
            </div>
            <div className="newChat--list"> 
                {list.map((item, key) => (
                    <div className="newChat--item" key={key}>
                        <img className="newChat--itemavatar" src={item.avatar} alt="" />
                        <div className="newChat--itemName"> {item.name} </div>
                    </div>
                ))}
            </div>
        </div>
    );
}