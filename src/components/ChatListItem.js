import React from 'react';
import './ChatListItem.css';

export default () => {
    return(
        <div className="chatListItem"> 
            <img className="chatListItem--avatar" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6SGvshARHJ5GYSH_Kig8-cYNw5rO3nWn7mA&s" alt="" />
            <div className="chatListItem--lines">
                <div className="chatListItem--line">

                    <div className="chatListItem--name">diego oliveira</div>
                    <div className="chatListItem--date">19:00</div>

                </div>
                <div className="chatListItem--line">
                    <div className="chatListItem--lastMsg">
                        <p>fala joao</p>
                    </div>
                </div>
            </div>
        </div>
    );
}