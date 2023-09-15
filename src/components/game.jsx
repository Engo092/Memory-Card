import { useState, useEffect } from 'react'
import '../styles/game.css'
import pokecard from '../assets/pokecard.jpg'

async function getAPokemon(id = null) {
  if (id === null) {
    id = getRandomNum(0, 1000);
  }
  const pokeFetcher = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (pokeFetcher.status == 200) {
    const newPokemon = await pokeFetcher.json();
    return newPokemon;
  } else {
    throw new Error(pokeFetcher.status);
  }
}

function getRandomNum(min, max) {
  // Maximum is inclusive and minimum is inclusive
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getGamePokemons() {
  let idArray = [];
  for (let i = 0; i < 12; i++) {
    let noRepeat = true;

    // This while loop ensures that no two pokemon will be the same
    while(noRepeat) {
      let newId = getRandomNum(0, 1000);
      if (!idArray.some(pokemon => pokemon['id'] === newId)) {
        noRepeat = false;
        idArray.push({id: newId, hasBeenClicked: false});
      }
    }
  }
  return idArray
}

// Randomizes the pokemons after the user scores
// got it from https://stackoverflow.com/questions/68409330/how-to-shuffle-change-the-order-of-array-objects-in-javascript
function shufflePokemons(pokemons) {
  const shuffledArray = [];
  while (pokemons.length) {
    const index = Math.floor(Math.random() * pokemons.length);
    shuffledArray.push(pokemons.splice(index, 1)[0]);
  }
  return shuffledArray;
}


function Card({ pokemonId, onClickCard }) {
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    if (pokemon === null) {
      getAPokemon(pokemonId.id)
      .then(pokemonToRender => setPokemon(pokemonToRender));
    } else {
      return;
    }
    
  }, [pokemon, pokemonId]);

  return (
    <>
      {pokemon ? (
        <button className='gameCard' onClick={onClickCard}>
          <img src={pokemon ? pokemon.sprites.other['official-artwork']['front_default'] : ''} alt="" />
          <span className='cardName'>{pokemon ? pokemon.name : 'Loading...'}</span>
        </button>
      ) : <div className='gameCard withPokecard'>
            <img className='pokecard' src={pokecard} alt="loading" />
          </div>}
    </>
  )
}


function Game({score, setScore}) {
  const [pokemonIds, setPokemonIds] = useState(null);

  useEffect(() => {
    if (pokemonIds === null) {
      const pokemons = getGamePokemons()
      setPokemonIds(pokemons);
    } else {
      return;
    }
  }, [pokemonIds]);


  // This resets all pokemon after all have been clicked
  useEffect(() => {
    if (pokemonIds !== null) {
      let allHaveBeenClicked = true;
      pokemonIds.forEach(pokemon => {
        if (!pokemon.hasBeenClicked) {
          allHaveBeenClicked = false;
        }
      });
      if (allHaveBeenClicked === true) {
        setPokemonIds(null);
      }
    }
  }, [pokemonIds]);

  return (
    <>
      <h2 className='instructions'>
        Click on an image to score points, but don't click on the same image more than once!
      </h2>

      <section className='cardGrid'>
        {pokemonIds ? (pokemonIds.map(pokemon => 
          <Card 
            key={pokemon.id}
            pokemonId={pokemon}
            onClickCard={() => {
              if (!pokemon.hasBeenClicked) {

                let updatePokemon = (pokemonIds.map(updatedPokemon => {
                  if (updatedPokemon.id === pokemon.id) {
                    return {...updatedPokemon, hasBeenClicked: true};
                  } else {
                    return updatedPokemon;
                  }
                }));

                let shuffledIds = shufflePokemons(updatePokemon);
                setPokemonIds(shuffledIds);
                setScore(score + 1);
              }
              else {
                setPokemonIds(null);
                setScore(0);
              }
            }} />
        )) : null}
      </section>
    </>
  )
}

export default Game