import { useEffect, useState } from 'react'
import Header from './Header'
import Game from './game'


function App() {
  const [bestScore, setBestScore] = useState(0);
  const [score, setScore] = useState(0);

  function updateScore(newScore) {
    if (newScore > bestScore) {
      setBestScore(newScore);
    }
  }

  return (
    <>
      <Header currentScore={score} bestScore={bestScore} />
      <Game score={score} setScore={(newScore) => {setScore(newScore); updateScore(newScore)}} />
    </>
  )
}

export default App
