import React, { useState } from 'react';
import './NewChat.css';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default ({user, chatlist, show, setShow}) => {
    const [list, setList] = useState([
        {id: 123, avatar: 'https://cdn.los-animales.org/fotos/419458454_7009928_thumb.jpg', name: 'Nalu'},
        {id: 123, avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTS7aezC2HKwn4q1O_MWwOWj73PuXTxExqwqQ&s', name: 'Diego Oliveira'},
        {id: 123, avatar: 'https://www.locaweb.com.br/blog/wp-content/uploads/2018/06/linus-torvalds-linux.png', name: 'Gustavo'},
        {id: 123, avatar: 'https://img.cdndsgni.com/preview/11728274.jpg', name: 'Luizão'}
    ]);

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