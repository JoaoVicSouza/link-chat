import React, { useState, useEffect, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import './ChatWindow.css';

import MessageItem from './MessageItem';
import Api from '../Api';

import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

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
    
    const [showWallpaperInput, setShowWallpaperInput] = useState(false);
    const [tempWallpaperUrl, setTempWallpaperUrl] = useState('');
    const [wallpaperUrl, setWallpaperUrl] = useState('');


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

    const handleAddPhotoClick = () => {
        setTempWallpaperUrl(wallpaperUrl);
        setShowWallpaperInput(true);
    };
    
    const handleSetWallpaper = () => {
        if (tempWallpaperUrl.trim() === '') {
            setWallpaperUrl('');
        } else{
            try{
                new URL(tempWallpaperUrl);
                setWallpaperUrl(tempWallpaperUrl);
            } catch (error) {
                alert('URL inválida. Por favor, insira uma URL válida.');
                return;
        }
    }
        setShowWallpaperInput(false);
    };
    
    const handleCloseWallpaperInput = () => {
        setShowWallpaperInput(false);
    };

    return (
        <div className="chatWindow">
            <div className="chatWindow--header">

                <div className="chatWindow--headerinfo">
                    <img className="chatWindow--avatar" src={data.image} alt="" />
                    <div className="chatWindow--name">{data.title}</div>
                </div>

                <div className="chatWindow--headerbuttons"> 
                    
                    <div className="chatWindow--btn" onclick={handleAddPhotoClick}> 
                        <AddPhotoAlternateIcon style={{color: '#919191'}} />
                    </div>

                </div>



            </div>
            <div
                ref={body}
                className="chatWindow--body"    
                style={{
                    backgroundImage: wallpaperUrl ? `url(${wallpaperUrl})` : 'none',
                    backgroundSize: wallpaperUrl ? 'cover' : 'auto',
                    backgroundPosition: wallpaperUrl ? 'center' : 'initial',
                    backgroundRepeat: wallpaperUrl ? 'no-repeat' : 'repeat'
                }}>
                {list.map((item, key) => (
                    <MessageItem
                        key={key}
                        data={item}
                        user={user.id} // user é um objeto, não o id
                    />
                ))}
            </div>

                {showWallpaperInput && (
                <div className="chatWindow--wallpaperInputArea">
                    <input
                        type="text"
                        placeholder="Cole a URL da imagem ou deixe em branco para remover"
                        value={tempWallpaperUrl}
                        onChange={(e) => setTempWallpaperUrl(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSetWallpaper()}
                    />
                    <div className="chatWindow--wallpaperButtons">
                        <button onClick={handleSetWallpaper}>OK</button>
                        <button onClick={handleCloseWallpaperInput}>Cancelar</button>
                        {wallpaperUrl && 
                            <button onClick={() => { setWallpaperUrl(''); setTempWallpaperUrl(''); setShowWallpaperInput(false); }}>
                                Remover Atual
                            </button>
                        }
                    </div>
                </div>
            )}

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