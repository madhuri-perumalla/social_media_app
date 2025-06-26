import React from 'react';
import '../styles/Home.css';
import Post from '../components/Post';
import HomeLogo from '../components/HomeLogo';
import Navbar from '../components/Navbar';
import Stories from '../components/Stories';

const Home = () => {
  return (
    <div className='homePage'>
      <HomeLogo />
      <Navbar />
      <div className="homeContent">
        <div className="card">
          <h2 className="section-title">Stories</h2>
          <Stories />
        </div>
        <Post />
      </div>
    </div>
  )
}

export default Home;