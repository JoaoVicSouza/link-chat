import React, { useState } from 'react';
import './App.css';

import Api from './Api';

import ChatListItem from './components/ChatListItem';
import ChatIntro from './components/ChatIntro';
import ChatWindow from './components/ChatWindow';
import NewChat from './components/NewChat';
import Login from './Login';

import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';

export default function App() {
  // Estado de login
  const [userName, setUserName] = useState('');
  const [user, setUser] = useState(null);

  // Lista de chats e chat ativo
  const [chatList, setChatList] = useState([]);
  const [activeChat, setActiveChat] = useState({});
  const [showNewChat, setShowNewChat] = useState(false);

  // URL padrão de avatar
  const defaultAvatar = 'https://sm.ign.com/t/ign_pk/cover/a/avatar-gen/avatar-generations_rpge.600.jpg';

  // Ao submeter o Login
  const handleLogin = async (name, password) => {
    let newUser = {
      id: Date.now(),
      name: name,
      avatar: defaultAvatar,
      password: password
    }

    setUserName(name);
    setUser(newUser);
    await Api.addUser(newUser);
  };

  // Se não estiver logado, mostra Login
  if (!userName) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App-window">
      <div className="sidebar">
        <NewChat
          chatlist={chatList}
          user={user}
          show={showNewChat}
          setShow={setShowNewChat}
        />
        <header>
          <img
            className="header--avatar"
            src={user.avatar || defaultAvatar}
            alt={userName}
          />
          <div className="header--buttons">
            <div className="header--btn">
              <DonutLargeIcon style={{ color: '#919191' }} />
            </div>
            <div onClick={() => setShowNewChat(true)} className="header--btn">
              <ChatIcon style={{ color: '#919191' }} />
            </div>
            <div className="header--btn">
              <MoreVertIcon style={{ color: '#919191' }} />
            </div>
          </div>
        </header>

        <div className="search">
          <div className="search--input">
            <SearchIcon fontSize="small" style={{ color: '#919191' }} />
            <input
              type="search"
              placeholder="Procurar ou começar uma nova conversa"
            />
          </div>
        </div>

        <div className="chatlist">
          {chatList.map((item) => (
            <ChatListItem
              key={item.chatId}
              data={item}
              active={activeChat.chatId === item.chatId}
              onClick={() => setActiveChat(item)}
            />
          ))}
        </div>
      </div>
      <div className="contentarea">
        {activeChat.chatId !== undefined ? (
          <ChatWindow user={user} />
        ) : (
          <ChatIntro />
        )}
      </div>
    </div>
  );
}
