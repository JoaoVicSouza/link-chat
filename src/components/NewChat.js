import React, { useState, useEffect } from 'react';
import './NewChat.css';

import Api from '../Api';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default ({user, chatlist, show, setShow}) => {
    const [list, setList] = useState([]);

    useEffect(() => {
        const getList = async () => {
            if(user !== null){
                let results = await Api.getContactList(user.id);
                setList(results);
            }
        }
        getList();
    }, [user]);
    
    const addNewChat = async (user2) => {
        // Verifica se já existe chat com esse usuário
        const alreadyExists = chatlist.some(
            chat => chat.with === user2.id
        );
        if (alreadyExists) {
            alert('Você já tem uma conversa com esse usuário.');
            handleClose();
            return;
        }
        await Api.addNewChat(user, user2);
        handleClose();
    }

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
                    <div onClick={()=>addNewChat(item)}className="newChat--item" key={key}>
                        <img className="newChat--itemavatar" src={item.avatar} alt="" />
                        <div className="newChat--itemName"> {item.name} </div>
                    </div>
                ))}
            </div>
        </div>
    );
}