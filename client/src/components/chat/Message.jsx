import React, { useContext, useEffect, useRef } from 'react'
import { GeneralContext } from '../../context/GeneralContextProvider';

const Message = ({message}) => {
  const {chatData} = useContext(GeneralContext);
  const ref = useRef();
  const userId = localStorage.getItem('userId');
  const isOwner = message.senderId === userId;
  
  const formatTime = (date) => {
    const messageDate = new Date(date);
    const hours = messageDate.getHours();
    const minutes = messageDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  useEffect(() => {
    ref.current?.scrollIntoView({behavior: 'smooth'})
  }, [message]);

  return (
    <div ref={ref} className={`message ${isOwner ? "owner" : ""}`}>
      <div className="messageInfo">
        <img 
          src={isOwner ? localStorage.getItem('profilePic') : chatData.user.profilePic} 
          alt="Profile" 
        />
        <span>{formatTime(message.date)}</span>
      </div>
      <div className="messageContent">
        {message.text && <p>{message.text}</p>}
        {message.file && (
          <img 
            src={message.file} 
            alt="Shared" 
            loading="lazy"
          />
        )}
      </div>
    </div>
  )
}

export default Message