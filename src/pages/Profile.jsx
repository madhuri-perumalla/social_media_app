import React, { useContext, useEffect, useState } from 'react'
import '../styles/ProfilePage.css'
import '../styles/Posts.css';
import { AiOutlineHeart, AiTwotoneHeart } from "react-icons/ai";
import { BiCommentDetail, BiEdit } from "react-icons/bi";
import { FaGlobeAmericas } from "react-icons/fa";
import { IoIosPersonAdd } from 'react-icons/io'
import { MdOutlineLogout } from 'react-icons/md'
import HomeLogo from '../components/HomeLogo'
import Navbar from '../components/Navbar'
import { AuthenticationContext } from '../context/AuthenticationContextProvider'
import { GeneralContext } from '../context/GeneralContextProvider'
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {

  const {logout} = useContext(AuthenticationContext);

  const {socket} = useContext(GeneralContext);

  const {id} = useParams();
  const userId = localStorage.getItem("userId");

  const [userProfile, setUserProfile] = useState([]);

const [updateProfilePic, setUpdateProfilePic] = useState('');
const [updateProfileUsername, setUpdateProfileUsername] = useState('');
const [updateProfileAbout, setUpdateProfileAbout] = useState('');

const [isUpdating, setIsUpdating] = useState(false);


  useEffect(()=>{

    socket.emit("fetch-profile", {_id: id});

    socket.on("profile-fetched", async({profile})=>{
      setUserProfile(profile);
      setUpdateProfilePic(profile.profilePic);
      setUpdateProfileUsername(profile.username);
      setUpdateProfileAbout(profile.about);
    })


  },[socket])


  const handleUpdate = async () =>{
    socket.emit('updateProfile', {userId: userProfile._id, profilePic: updateProfilePic, username: updateProfileUsername, about: updateProfileAbout});
    setIsUpdating(false);
  }


  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetchAllPosts');
      const fetchedPosts = response.data;
      setPosts(fetchedPosts);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLike = (userId, postId) =>{
    socket.emit('postLiked', {userId, postId});

}

const handleUnLike = (userId, postId) =>{
    socket.emit('postUnLiked', {userId, postId});

}

const handleFollow = async (userId) =>{
  socket.emit('followUser', {ownId: localStorage.getItem('userId'), followingUserId: userId});
}
const handleUnFollow = async (userId) =>{
  socket.emit('unFollowUser', {ownId: localStorage.getItem('userId'), followingUserId: userId});
}

useEffect(()=>{
  socket.on('userFollowed', ({following})=>{
    localStorage.setItem('following', following);
})

socket.on('userUnFollowed', ({following})=>{
  localStorage.setItem('following', following);
})
})



const [followDisplayType, setFollowDisplayType] = useState('followers');

const [comment, setComment] = useState('');

    const handleComment = (postId, username)=>{
        socket.emit('makeComment', {postId, username, comment});
        setComment('');
    }

const handleDeletePost = async (postId) =>{
    await socket.emit('delete-post', {postId});
}

useEffect(()=>{

  socket.on('post-deleted', async ({posts})=>{
    
    setPosts(posts)
  })

},[socket])


  return (
    <div className='profilePage'>
        <HomeLogo />
        <Navbar />

        <div className="profileContent">
            <div className={`profileCard card ${isUpdating ? 'hidden' : ''}`}>
                <div className="profileHeader">
                    <img src={userProfile.profilePic} alt={userProfile.username} />
                    <div className="profileInfo">
                        <h2>{userProfile.username}</h2>
                        <p className="about">{userProfile.about}</p>
                    </div>
                </div>

                <div className="profileStats">
                    <div className="stat">
                        <span className="count">{userProfile.followers ? userProfile.followers.length : 0}</span>
                        <span className="label">Followers</span>
                    </div>
                    <div className="stat">
                        <span className="count">{userProfile.following ? userProfile.following.length : 0}</span>
                        <span className="label">Following</span>
                    </div>
                </div>

                <div className="profileActions">
                    {userProfile._id === userId ? (
                        <>
                            <button className="actionBtn edit" onClick={() => setIsUpdating(true)}>
                                <BiEdit size={20} />
                                <span>Edit Profile</span>
                            </button>
                            <button className="actionBtn logout" onClick={async () => { await logout() }}>
                                <MdOutlineLogout size={20} />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            {localStorage.getItem('following').includes(userProfile._id) ? (
                                <>
                                    <button className="actionBtn unfollow" onClick={() => handleUnFollow(userProfile._id)}>
                                        <IoIosPersonAdd size={20} />
                                        <span>Unfollow</span>
                                    </button>
                                    <button className="actionBtn message">
                                        <BiCommentDetail size={20} />
                                        <span>Message</span>
                                    </button>
                                </>
                            ) : (
                                <button className="actionBtn follow" onClick={() => handleFollow(userProfile._id)}>
                                    <IoIosPersonAdd size={20} />
                                    <span>Follow</span>
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className={`profileEditCard card ${!isUpdating ? 'hidden' : ''}`}>
                <h2>Edit Profile</h2>
                <div className="formGroup">
                    <label>Profile Image URL</label>
                    <input
                        type="text"
                        placeholder="Enter image URL"
                        onChange={(e) => setUpdateProfilePic(e.target.value)}
                        value={updateProfilePic}
                    />
                </div>
                <div className="formGroup">
                    <label>Username</label>
                    <input
                        type="text"
                        placeholder="Enter username"
                        onChange={(e) => setUpdateProfileUsername(e.target.value)}
                        value={updateProfileUsername}
                    />
                </div>
                <div className="formGroup">
                    <label>About</label>
                    <textarea
                        placeholder="Tell us about yourself"
                        onChange={(e) => setUpdateProfileAbout(e.target.value)}
                        value={updateProfileAbout}
                    />
                </div>
                <div className="editActions">
                    <button className="cancelBtn" onClick={() => setIsUpdating(false)}>Cancel</button>
                    <button className="saveBtn" onClick={handleUpdate}>Save Changes</button>
                </div>
            </div>

            <div className="profilePostsContainer">
                <h3 className="sectionTitle">Posts</h3>
                {posts.filter(post => post.userId === userProfile._id).map((post) => (
                    <div className="Post card" key={post._id}>
                        <div className="postTop">
                            <div className="postTopDetails">
                                <img src={post.userPic} alt="" className="userpic" />
                                <h3 className="usernameTop">{post.userName}</h3>
                            </div>
                            {post.userId === userId && (
                                <button className='deleteBtn' onClick={() => handleDeletePost(post._id)}>
                                    Delete
                                </button>
                            )}
                        </div>

                        {post.fileType === 'photo' ? (
                            <img src={post.file} className='postimg' alt="" />
                        ) : (
                            <video className='postimg' controls muted>
                                <source src={post.file} />
                            </video>
                        )}

                        <div className="postActions">
                            <div className="actionGroup">
                                {post.likes.includes(localStorage.getItem('userId')) ? (
                                    <button className="likeBtn active" onClick={() => handleUnLike(localStorage.getItem('userId'), post._id)}>
                                        <AiTwotoneHeart size={24} />
                                        <span>{post.likes.length}</span>
                                    </button>
                                ) : (
                                    <button className="likeBtn" onClick={() => handleLike(localStorage.getItem('userId'), post._id)}>
                                        <AiOutlineHeart size={24} />
                                        <span>{post.likes.length}</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
)
}

export default Profile