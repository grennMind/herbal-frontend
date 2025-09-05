import React from 'react'
import './Hero.css'
import dark_arrow from '../../assets/dark-arrow.png'
function Hero() {
  return (
    <div className='Hero container'>
        <div className="hero-text">
        <h1>We Ensure better education for a better world</h1>
        <p>Better Education is a transformative approach focused on improving
        the quality, accessibility, and effectiveness of learning. It emphasizes 
        student-centered teaching, modern tools, inclusive practices, and lifelong 
        learning to help every learner reach their full potential.</p>
        <button className='btn'>Explore more  <img src={dark_arrow} alt="" /></button>
        </div>
        
    </div>
    
  )
}

export default Hero