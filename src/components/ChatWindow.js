import React, { useState, useEffect, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import './ChatWindow.css';

import MessageItem from './MessageItem';
import Api from '../Api';

import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';


export default ({ user, data }) => {

    const body = useRef();

    let recognition = null;
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition !== undefined) {
        recognition = new SpeechRecognition();
    }


    const [emojiOpen, setEmojiOpen] = useState(false);
    const [text, setText] = useState('');
    const [listening, setListening] = useState(false);
    const [list, setList] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {

        setList([]);
        let unsub = Api.onChatContent(data.chatId, setList, setUsers, user.id); // Passe user.id
        return unsub;
    }, [data.chatId]);

    useEffect(() => {
        if (body.current.scrollHeight > body.current.offsetHeight) {
            body.current.scrollTop = body.current.scrollHeight - body.current.offsetHeight;
        }
    }, [list])

    const handleEmojiClick = (emojiObject) => {
        setText(text + emojiObject.emoji);
    }

    const handleOpenEmoji = () => {
        setEmojiOpen(true);
    }

    const handleCloseEmoji = () => {
        setEmojiOpen(false);
    }

    const handleInputUp = (e) => {
        if (e.keyCode === 13) {
            handleSendClick();
        }
    }

    const handleSendClick = () => {
        if (text.trim() !== "") {
            Api.sendMessage(data, user.id, 'text', text, users);
            setText('');
            setEmojiOpen(false);
        }
    }
    const handleMicClick = () => {
        if (recognition !== null) {

            recognition.onstart = () => {
                setListening(true);
            }
            recognition.onend = () => {
                setListening(false);
            }
            recognition.onresult = (e) => {
                setText(e.results[0][0].transcript);
            }

            recognition.start();
        }

    }
    return (
        <div className="chatWindow">
            <div className="chatWindow--header">

                <div className="chatWindow--headerinfo">
                    <img className="chatWindow--avatar" src={data.image} alt="" />
                    <div className="chatWindow--name">{data.title}</div>
                </div>

            </div>
            <div ref={body} className="chatWindow--body">
                {list.map((item, key) => (
                    <MessageItem
                        key={key}
                        data={item}
                        user={user.id} // user é um objeto, não o id
                    />
                ))}
            </div>

            <div className="chatWindow--emojiarea"
                style={{ height: emojiOpen ? '200px' : '0px' }}>
                {emojiOpen && (
                    <EmojiPicker
                        key={data.chatId + emojiOpen} // força remount ao abrir
                        onEmojiClick={handleEmojiClick}
                        searchDisabled
                        skinTonesDisabled
                    />
                )}
            </div>
            <div className="chatWindow--footer">

                <div className="sendBar">

                    <div className="chatWindow--pre">

                        <div className="chatWindow--btn"
                            onClick={handleCloseEmoji}
                            style={{ width: emojiOpen ? 40 : 0 }}
                        >
                            <CloseIcon style={{ color: '#919191' }} />
                        </div>

                        <div className="chatWindow--btn"
                            onClick={handleOpenEmoji}>
                            <InsertEmoticonIcon style={{ color: '#4cd964' }} />
                        </div>

                    </div>

                    <div className="chatWindow--inputarea">
                        <input
                            className="chatWindow--input"
                            type="text"
                            placeholder="Digite uma mensagem"
                            value={text}
                            onChange={e => setText(e.target.value)}
                            onKeyUp={handleInputUp}
                        />
                    </div>

                    <div className="chatWindow--pos">

                        {text === '' &&
                            <div onClick={handleMicClick} className="chatWindow--btn">
                                <MicIcon style={{ color: listening ? '#126ECE' : '#f87171' }} />
                            </div>
                        }
                        {text !== '' &&
                            <div onClick={handleSendClick} className="chatWindow--btn">
                                <SendIcon style={{ color: '#60a5fa' }} />
                            </div>
                        }
                    </div>
                </div>

            </div>
        </div>
    );
}