import React, { useContext, useState } from 'react'
import '../styles/CreatePosts.css'
import { RxCross2 } from 'react-icons/rx'
import { BiImageAdd, BiVideo } from 'react-icons/bi'
import { MdLocationOn } from 'react-icons/md'
import { GeneralContext } from '../context/GeneralContextProvider'
import axios from "axios";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../firebase.js';
import { v4 as uuidv4 } from 'uuid';

const CreatePost = () => {
    const { isCreatPostOpen, setIsCreatePostOpen } = useContext(GeneralContext);
    const [postType, setPostType] = useState('photo');
    const [postDescription, setPostDescription] = useState('');
    const [postLocation, setPostLocation] = useState('');
    const [postFile, setPostFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState();

    if (uploadProgress === 100) {
        setPostDescription('');
        setPostLocation('');
        setPostFile(null);
        setIsCreatePostOpen(false);
        setUploadProgress();
    }

    const handlePostUplload = async (e) => {
        e.preventDefault();
        if (!postFile) {
            alert('Please select a file to upload');
            return;
        }
        const storageRef = ref(storage, uuidv4());
        const uploadTask = uploadBytesResumable(storageRef, postFile);
        uploadTask.on('state_changed',
            (snapshot) => {
                setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            },
            (error) => {
                console.log(error);
            }, () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    try {
                        const inputs = {
                            userId: localStorage.getItem('userId'),
                            userName: localStorage.getItem('username'),
                            userPic: localStorage.getItem('profilePic'),
                            fileType: postType,
                            file: downloadURL,
                            description: postDescription,
                            location: postLocation,
                            comments: { "New user": "This is my first comment" }
                        }

                        await axios.post('http://localhost:6001/createPost', inputs)
                            .catch((err) => {
                                console.log(err);
                            });

                    } catch (err) {
                        console.log(err);
                    }
                });
            });
    }

    return (
        <div className="createPostModalBg" style={isCreatPostOpen ? { display: 'flex' } : { display: 'none' }}>
            <div className="createPostContainer card">
                <div className="createPostHeader">
                    <h2 className="createPostTitle">Create New Post</h2>
                    <button className="closeBtn" onClick={() => setIsCreatePostOpen(false)}>
                        <RxCross2 />
                    </button>
                </div>

                <div className="createPostBody">
                    <form>
                        <div className="postTypeSelector">
                            <button
                                type="button"
                                className={`typeBtn ${postType === 'photo' ? 'active' : ''}`}
                                onClick={() => setPostType('photo')}
                            >
                                <BiImageAdd size={24} />
                                <span>Photo</span>
                            </button>
                            <button
                                type="button"
                                className={`typeBtn ${postType === 'video' ? 'active' : ''}`}
                                onClick={() => setPostType('video')}
                            >
                                <BiVideo size={24} />
                                <span>Video</span>
                            </button>
                        </div>

                        <div className="uploadBox">
                            <label htmlFor="uploadPostFile" className="uploadLabel">
                                <BiImageAdd size={32} />
                                <span>{postFile ? postFile.name : 'Choose a file to upload'}</span>
                            </label>
                            <input
                                type="file"
                                name="PostFile"
                                id="uploadPostFile"
                                onChange={(e) => setPostFile(e.target.files[0])}
                                accept={postType === 'photo' ? 'image/*' : 'video/*'}
                            />
                        </div>

                        <div className="inputGroup">
                            <textarea
                                className="descriptionInput"
                                placeholder="Write a description..."
                                onChange={(e) => setPostDescription(e.target.value)}
                                value={postDescription}
                            />
                        </div>

                        <div className="inputGroup">
                            <div className="locationInput">
                                <MdLocationOn size={20} />
                                <input
                                    type="text"
                                    placeholder="Add location"
                                    onChange={(e) => setPostLocation(e.target.value)}
                                    value={postLocation}
                                />
                            </div>
                        </div>

                        <button
                            className="submitBtn"
                            onClick={handlePostUplload}
                            disabled={uploadProgress}
                        >
                            {uploadProgress ? `Uploading... ${Math.round(uploadProgress)}%` : 'Share Post'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreatePost