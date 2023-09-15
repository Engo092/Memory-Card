import { useState } from 'react'
import '../styles/header.css'

function Header({currentScore, bestScore}) {

  return (
    <div className='titleAndScores'>
      <header>
        <h1>Memory Card</h1>
      </header>
      <section className='scores'>
        <span className='currentScore'>Current Score: {currentScore}</span>
        <span className='highScore'>Best Score: {bestScore}</span>
      </section>
    </div>
  )
}

export default Header
