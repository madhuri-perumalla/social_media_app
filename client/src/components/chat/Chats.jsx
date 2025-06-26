import React, { useContext, useEffect, useState } from 'react'
import { GeneralContext } from '../../context/GeneralContextProvider';

const Chats = () => {
  const { socket, chatFirends, setChatFriends, dispatch, chatData } = useContext(GeneralContext);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    socket.emit('fetch-friends', { userId });

    socket.on("friends-data-fetched", ({ friendsData }) => {
      setChatFriends(friendsData);
    });
  }, [socket, setChatFriends]);

  const handleSelect = (data) => {
    dispatch({ type: "CHANGE_USER", payload: data });
  }

  useEffect(() => {
    if (chatData.chatId !== null) {
      socket.emit('fetch-messages', { chatId: chatData.chatId });
    }
  }, [chatData, socket]);

  return (
    <div className='chats'>
      {chatFirends.length === 0 ? (
        <div className="no-chats">
          <p>No conversations yet</p>
          <span>Search for users to start chatting</span>
        </div>
      ) : (
        chatFirends.map((data) => (
          <div 
            className={`userInfo ${chatData.user?._id === data._id ? 'active' : ''}`}
            key={data._id} 
            onClick={() => handleSelect(data)}
          >
            <img src={data.profilePic} alt={data.username} />
            <div className="userChatInfo">
              <span>{data.username}</span>
              {/* You can add last message preview here if available */}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default Chats
