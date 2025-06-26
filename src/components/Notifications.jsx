import React, { useContext } from 'react'
import '../styles/Notifications.css'
import { RxCross2 } from 'react-icons/rx'
import { IoNotificationsOffOutline } from 'react-icons/io5'
import { GeneralContext } from '../context/GeneralContextProvider'

const Notifications = () => {
    const { isNotificationsOpen, setNotificationsOpen } = useContext(GeneralContext);

    return (
        <div 
            className="notificationsModalBg" 
            style={isNotificationsOpen ? { display: 'flex' } : { display: 'none' }}
            onClick={(e) => {
                // Close when clicking the background
                if (e.target.className === 'notificationsModalBg') {
                    setNotificationsOpen(false);
                }
            }}
        >
            <div className="notificationsContainer card">
                <div className="notificationsHeader">
                    <h2 className="notificationsTitle">Notifications</h2>
                    <button 
                        className="closeBtn" 
                        onClick={() => setNotificationsOpen(false)}
                        aria-label="Close notifications"
                    >
                        <RxCross2 />
                    </button>
                </div>
                
                <div className="notificationsBody">
                    <div className="noNotifications">
                        <IoNotificationsOffOutline size={40} />
                        <p>No new notifications</p>
                        <span>We'll notify you when something arrives</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Notifications;