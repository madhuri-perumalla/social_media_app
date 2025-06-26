
import React, { useState } from 'react';
import '../styles/landingpage.css';

import snapTalkLogo from '../images/SnapTalk.png';
import About1 from '../images/about-1.png';
import About2 from '../images/about-2.jpg';
import landingpic from '../images/landing-pic.png';
import { FaComments, FaCamera, FaHeart, FaUserFriends } from 'react-icons/fa';

import Login from '../components/Login';
import Register from '../components/Register';

const LandingPage = () => {
    const [isLoginBox, setIsLoginBox] = useState(true);

    return (
        <div className='landingPage'>
            <nav className="landing-header">
                <span className="landing-header-logo">
                    <img src={snapTalkLogo} alt="SnapTalk Logo" />
                </span>
                <ul>
                    <li className='header-li'><a href="#home">Home</a></li>
                    <li className='header-li'><a href="#features">Features</a></li>
                    <li className='header-li'><a href="#about">About</a></li>
                </ul>
            </nav>

            <main className="landing-body">
                <section className="landing-hero" id='home'>
                    <div className="landing-hero-content">
                        <h1>SnapTalk</h1>
                        <p className="hero-tagline">Connect, Share, and Chat in Style</p>
                        <p className="hero-description">
                            Join millions of users 🙋‍♀️ on SnapTalk, where meaningful connections meet beautiful moments. Share your story, connect with friends, and discover amazing content.
                        </p>

                        <div className="authentication-form">
                            {isLoginBox ? (
                                <Login setIsLoginBox={setIsLoginBox} />
                            ) : (
                                <Register setIsLoginBox={setIsLoginBox} />
                            )}
                        </div>
                    </div>

                    <div className="landing-hero-image">
                        <div id='landing-image-sidebar-left'></div>
                        <div className="back"></div>
                        <div id='landing-image-sidebar-right'></div>
                        <img src={landingpic} className='about-2-img' alt="SnapTalk" />
                    </div>
                </section>

                <section className="features-section" id="features">
                    <h2>Why Choose SnapTalk?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <FaCamera className="feature-icon" />
                            <h3>Share Moments</h3>
                            <p>Share your life's beautiful moments through photos and stories</p>
                        </div>
                        <div className="feature-card">
                            <FaComments className="feature-icon" />
                            <h3>Real-time Chat</h3>
                            <p>Connect instantly with friends through our seamless chat system</p>
                        </div>
                        <div className="feature-card">
                            <FaHeart className="feature-icon" />
                            <h3>Engage & React</h3>
                            <p>React to posts and engage with your favorite content</p>
                        </div>
                        <div className="feature-card">
                            <FaUserFriends className="feature-icon" />
                            <h3>Build Community</h3>
                            <p>Find and connect with like-minded people</p>
                        </div>
                    </div>
                </section>

                <section className="landing-about" id='about'>
                    <div className="about-1">
                        <img src={About1} className='about-1-img' alt="Stay Connected" />
                        <div className="about-1-content">
                            <h3>Connect with the World🌍</h3>
                            <p>Never miss a moment with SnapTalk's real-time updates. Share photos, chat with friends, and keep up with what matters most to you👋. Our platform makes it easy to maintain meaningful connections, no matter the distance.</p>
                            <a href='#home' className="cta-button">Share now</a>
                        </div>
                    </div>
                    
                    <div className="about-2">
                        <div className="about-2-content">
                            <h3>Share Your Story✨</h3>
                            <p>SnapTalk is your canvas for self-expression. Share your stories, photos, and experiences with a community that celebrates authenticity. Whether you're an artist, photographer, or someone with a story to tell, SnapTalk gives you the perfect platform.</p>
                            <a href='#home' className="cta-button">Share now</a>
                        </div>
                        <img src={About2} className='about-2-img' alt="Share Your Story" />
                    </div>
                </section>

                <footer className="footer">
                    <div className="footer-content">
                        <p>SnapTalk - Connect with the world</p>
                        <div className="footer-links">
                            <a href="#home">Home</a>
                            <a href="#features">Features</a>
                            <a href="#about">About</a>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default LandingPage;


