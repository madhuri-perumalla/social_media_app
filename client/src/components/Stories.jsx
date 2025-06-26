import React, { useContext, useEffect, useState } from 'react'
import '../styles/Stories.css'
import { BiPlusCircle } from 'react-icons/bi'
import { GeneralContext } from '../context/GeneralContextProvider';
import axios from 'axios';
import {RxCross2} from 'react-icons/rx'

const Stories = () => {
    const {socket, setIsCreateStoryOpen} = useContext(GeneralContext);
    const [stories, setStories] = useState([])
    const [isStoryPlaying, setIsStoryPlaying] = useState(false);
    const [story, setStory] = useState();

    const addStory = () => {
        try {
            // Check if required localStorage items exist
            const profilePic = localStorage.getItem('profilePic');
            const userId = localStorage.getItem('userId');
            
            if (!profilePic || !userId) {
                alert('Please log in to add a story');
                return;
            }
            
            setIsCreateStoryOpen(true);
        } catch (error) {
            console.error('Error in addStory:', error);
            alert('Error opening story creator. Please try again.');
        }
    }

    useEffect(() => {
        fetchStories();
    }, []);
    
    const fetchStories = async () => { 
        try {
            const response = await axios.get('http://localhost:6001/fetchAllStories');
            setStories(response.data)
        } catch (error) {
            console.error('Error fetching stories:', error);
        }
    };

    const handleOpenStory = async (story) =>{
        try {
            setStory(story);
            await socket.emit('story-played', {storyId: story._id, userId: localStorage.getItem('userId')});
            setIsStoryPlaying(true);
        } catch (error) {
            console.error('Error opening story:', error);
        }
    }

    return (
        <div className='storiesContainer'> 
            <div className="storiesBody" style={isStoryPlaying ? {display: 'none'} : {}}>
                <div className="stories">
                    <div 
                        className="story self-story" 
                        onClick={addStory}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="story-avatar">
                            <img 
                                src={localStorage.getItem('profilePic')} 
                                alt="Profile" 
                                onError={(e) => {
                                    console.error('Error loading profile picture');
                                    e.target.src = 'https://via.placeholder.com/56';
                                }}
                            />
                            <span className="add-story-icon">
                                <BiPlusCircle style={{ width: '100%', height: '100%' }} />
                            </span>
                        </div>
                        <p>Your story</p>
                    </div>

                    {stories && stories
                        .filter(story => {
                            const following = localStorage.getItem('following');
                            const userId = localStorage.getItem('userId');
                            return (
                                (following && following.includes(story.userId) || story.userId === userId)
                                && (Math.abs(Math.round((new Date().getTime() - new Date(story.createdAt).getTime()) / (1000 * 60 * 60)))) < 24
                            );
                        })
                        .map((story) => (
                            <div 
                                className="story user-story" 
                                key={story._id} 
                                onClick={() => handleOpenStory(story)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div 
                                    className="story-avatar"
                                    style={
                                        story.viewers.includes(localStorage.getItem('userId'))
                                        ? { borderColor: '#a5a7a995' }
                                        : { borderColor: '#569bdfc9' }
                                    }
                                >
                                    <img 
                                        src={story.userPic} 
                                        alt="" 
                                        onError={(e) => {
                                            console.error('Error loading story user picture');
                                            e.target.src = 'https://via.placeholder.com/56';
                                        }}
                                    />
                                </div>
                                <p>{story.username}</p>
                            </div>
                        ))
                    }
                </div>
            </div>

            {story && 
                <div className="storyPlayContainer" style={isStoryPlaying ? {} : {display: 'none'}}>
                    <div className="storyPlayBodyTop">
                        <p>{story.username}</p>
                        <span 
                            onClick={() => setIsStoryPlaying(false)}
                            style={{ cursor: 'pointer' }}
                        >
                            <RxCross2 />
                        </span>
                    </div>
                    <div className="storyPlayBodyContent">
                        {story.fileType === 'photo' ?
                            <img 
                                src={story.file} 
                                alt="" 
                                onError={(e) => {
                                    console.error('Error loading story content');
                                    e.target.src = 'https://via.placeholder.com/400x600';
                                }}
                            />
                            : 
                            <video id="videoPlayer" className='postimg' controls autoPlay muted>
                                <source src={story.file} />
                            </video>
                        }
                        <p>{story.text}</p>
                    </div>
                </div>
            }
        </div>
    )
}

export default Stories