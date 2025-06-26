import React, { useContext, useState, useEffect } from 'react';
import '../styles/CreatePosts.css'
import { GeneralContext } from '../context/GeneralContextProvider';
import { RxCross2 } from 'react-icons/rx';
import {ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {storage} from '../firebase.js';
import { v4 as uuidv4 } from 'uuid';

const CreateStory = () => {
    const {socket, isCreateStoryOpen, setIsCreateStoryOpen} = useContext(GeneralContext);
    const [storyType, setStoryType] = useState('photo');
    const [storyDescription, setStoryDescription] = useState('');
    const [storyFile, setStoryFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        // Setup socket event listeners
        if (socket) {
            socket.on('story-created', handleStoryCreated);
            socket.on('story-creation-error', handleStoryError);
            
            // Cleanup listeners on unmount
            return () => {
                socket.off('story-created', handleStoryCreated);
                socket.off('story-creation-error', handleStoryError);
            };
        }
    }, [socket]);

    const handleStoryCreated = () => {
        setError('');
        resetForm();
    };

    const handleStoryError = (error) => {
        setError(error.message || 'Failed to create story. Please try again.');
        setIsUploading(false);
        setUploadProgress(0);
    };

    const resetForm = () => {
        setStoryDescription('');
        setStoryFile(null);
        setUploadProgress(0);
        setError('');
        setIsUploading(false);
        setIsCreateStoryOpen(false);
    };

    const handleStoryUpload = async (e) => {
        e.preventDefault();
        setError('');
        setIsUploading(true);

        try {
            // Validate inputs
            if (!storyFile) {
                throw new Error('Please select a file to upload');
            }

            // Validate file type
            if (storyType === 'photo' && !storyFile.type.startsWith('image/')) {
                throw new Error('Please select an image file for photo story');
            }
            if (storyType === 'video' && !storyFile.type.startsWith('video/')) {
                throw new Error('Please select a video file for video story');
            }

            // Validate file size (max 10MB)
            if (storyFile.size > 10 * 1024 * 1024) {
                throw new Error('File size should be less than 10MB');
            }

            const storageRef = ref(storage, `stories/${uuidv4()}`);
            const uploadTask = uploadBytesResumable(storageRef, storyFile);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    console.error('Upload error:', error);
                    throw new Error('Failed to upload file. Please try again.');
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        
                        if (!socket?.connected) {
                            throw new Error('Not connected to server. Please try again.');
                        }

                        // Emit socket event for story creation
                        socket.emit('create-new-story', {
                            userId: localStorage.getItem('userId'),
                            username: localStorage.getItem('username'),
                            userPic: localStorage.getItem('profilePic'),
                            fileType: storyType,
                            file: downloadURL,
                            text: storyDescription
                        });

                    } catch (err) {
                        console.error('Error in upload completion:', err);
                        throw new Error('Failed to process uploaded file. Please try again.');
                    }
                }
            );
        } catch (err) {
            console.error('Story upload error:', err);
            setError(err.message || 'Failed to start upload. Please try again.');
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    return (
        <div className="createPostModalBg" style={isCreateStoryOpen ? {
            display: 'flex',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
        } : {display: 'none'}}>
            <div className="createPostContainer" style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '20px',
                width: '90%',
                maxWidth: '500px',
                position: 'relative'
            }}>
                <RxCross2 
                    className='closeCreatePost' 
                    onClick={resetForm}
                    style={{
                        position: 'absolute',
                        right: '20px',
                        top: '20px',
                        cursor: 'pointer',
                        fontSize: '24px'
                    }}
                />
                <h2 className="createPostTitle" style={{ marginBottom: '20px' }}>Add new story</h2>
                
                <div className="createPostBody">
                    <form onSubmit={handleStoryUpload}>
                        <select 
                            className="form-select" 
                            value={storyType}
                            onChange={(e) => setStoryType(e.target.value)}
                            disabled={isUploading}
                            style={{
                                marginBottom: '20px',
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #dee2e6'
                            }}
                        >
                            <option value="photo">Photo</option>
                            <option value="video">Video</option>
                        </select>

                        <div className="uploadBox" style={{
                            marginBottom: '20px',
                            border: '2px dashed #dee2e6',
                            borderRadius: '8px',
                            padding: '20px',
                            textAlign: 'center',
                            backgroundColor: '#f8f9fa'
                        }}>
                            <div style={{
                                marginBottom: '10px',
                                color: '#6c757d'
                            }}>
                                {storyFile ? storyFile.name : `Choose a ${storyType} to upload`}
                            </div>
                            <input 
                                type="file" 
                                name="PostFile" 
                                id="uploadPostFile"
                                accept={storyType === 'photo' ? 'image/*' : 'video/*'}
                                onChange={(e) => setStoryFile(e.target.files[0])}
                                disabled={isUploading}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    marginBottom: '10px'
                                }}
                            />
                            <div style={{
                                fontSize: '12px',
                                color: '#adb5bd'
                            }}>
                                Maximum file size: 10MB
                            </div>
                        </div>

                        <div className="form-floating mb-3 authFormInputs descriptionInput">
                            <input 
                                type="text" 
                                className="form-control descriptionInput" 
                                id="floatingDescription" 
                                placeholder="Description"
                                value={storyDescription}
                                onChange={(e) => setStoryDescription(e.target.value)}
                                disabled={isUploading}
                            />
                            <label htmlFor="floatingDescription">Text (optional)</label>
                        </div>

                        {error && <div className="alert alert-danger">{error}</div>}

                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={isUploading || !storyFile}
                            style={{
                                width: '100%',
                                padding: '10px',
                                marginTop: '10px'
                            }}
                        >
                            {isUploading ? `Uploading... ${Math.round(uploadProgress)}%` : 'Upload Story'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateStory;