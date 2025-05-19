import React, {useState, useEffect} from 'react';
import './App.css';

import ChatListItem from './components/ChatListItem';
import ChatIntro from './components/ChatIntro';
import ChatWindow from './components/ChatWindow';
import NewChat from './components/NewChat';

import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';

export default () => {

  const [chatlist, setChatList] = useState([
    {chatId: 1, title: 'Nalu', image: 'https://cdn.los-animales.org/fotos/419458454_7009928_thumb.jpg'},
    {chatId: 2, title: 'Diego Oliveira', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTS7aezC2HKwn4q1O_MWwOWj73PuXTxExqwqQ&s'},
    {chatId: 3, title: 'Gustavo', image: 'https://www.locaweb.com.br/blog/wp-content/uploads/2018/06/linus-torvalds-linux.png'},
    {chatId: 4, title: 'Crisley', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6SGvshARHJ5GYSH_Kig8-cYNw5rO3nWn7mA&s'},
    {chatId: 5, title: 'Luizão', image: 'https://img.cdndsgni.com/preview/11728274.jpg'},
    {chatId: 6, title: 'bolsonaro', image: 'https://jpimg.com.br/uploads/2025/05/bolsonaro.jpg'},
    {chatId: 7, title: 'gustavo lima', image: 'https://tv.sbt.com.br/_next/image?url=https%3A%2F%2Fstatic.sbt.com.br%2Fnoticias%2Fimages%2F281153.jpg&w=1080&q=90'},
    {chatId: 8, title: 'mulher da umbanda', image: 'https://www.astrocentro.com.br/blog/wp-content/uploads/2017/10/como-funciona-umbanda.jpg'},
  ]);
  const [activeChat, setActiveChat] = useState({});
  const [user, setUser] = useState({
    id: 1234,
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6SGvshARHJ5GYSH_Kig8-cYNw5rO3nWn7mA&s',
    name: 'João'
  });
  const [showNewChat, setShowNewChat] = useState(false);

  const handleNewChat = () => {
    setShowNewChat(true);
  }

  return (
    <div className="App-window">
      <div className="sidebar">
        <NewChat
            chatlist={chatlist}    
            user={user} 
            show={showNewChat}
            setShow={setShowNewChat}
        />
        <header>
          <img className= "header--avatar" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6SGvshARHJ5GYSH_Kig8-cYNw5rO3nWn7mA&s" alt="" />
          <div className="header--buttons">
            <div className="header--btn">
              <DonutLargeIcon style={{color: '#919191'}} />
            </div>
            <div onClick={handleNewChat}className="header--btn">
              <ChatIcon style={{color: '#919191'}} />
            </div>
            <div className="header--btn">
              <MoreVertIcon style={{color: '#919191'}} />
            </div>
          </div>
        </header>

        <div className="search">
          <div className="search--input">
            <SearchIcon fontSize='small' style={{color: '#919191'}} />
            <input type="search" placeholder="Procurar ou começar uma nova conversa" />
          </div>
        </div>

        <div className="chatlist">
          {chatlist.map((item, key) => (
            <ChatListItem
                key={key}
                data={item}
                active={activeChat.chatId === chatlist[key].chatId}
                onClick={() => setActiveChat(chatlist[key])}
            />
          ))}
        </div>
      </div>
      <div className="contentarea">
          {activeChat.chatId !== undefined &&
              <ChatWindow
                user={user}
              />   
          }
          {activeChat.chatId === undefined &&
              <ChatIntro/>
          }
      </div>
    </div>
  );
}