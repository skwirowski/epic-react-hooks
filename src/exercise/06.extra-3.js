// useEffect: HTTP requests - store the state in an object
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

const statuses = {
  idle: 'idle', // no request made yet
  pending: 'pending', // request started
  resolved: 'resolved', // request successful
  rejected: 'rejected', // request failed
}

function PokemonInfo({pokemonName}) {
  const [{status, pokemon, error}, setState] = React.useState({
    status: 'idle',
    pokemon: null,
    error: null,
  })

  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!

  React.useEffect(() => {
    // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
    if (pokemonName) {
      // 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null.
      // (This is to enable the loading state when switching between different pokemon.)

      // 🐨 setPokemon(null)
      setState({status: statuses.pending})

      // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
      //   fetchPokemon('Pikachu').then(
      //     pokemonData => {/* update all the state here */},
      //   )

      fetchPokemon(pokemonName).then(
        pokemonData => {
          setState({status: statuses.resolved, pokemon: pokemonData})
        },
        error => {
          setState({error, status: statuses.rejected})
        },
      )
    }
  }, [pokemonName])

  if (status === statuses.rejected) {
    return (
      <div role="alert">
        There was an error:{' '}
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      </div>
    )
  }

  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'

  if (status === statuses.idle) {
    return 'Submit a pokemon'
  }

  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />

  if (status === statuses.pending) {
    return <PokemonInfoFallback name={pokemonName} />
  }

  //   3. pokemon: <PokemonDataView pokemon={pokemon} />

  if (status === statuses.resolved) {
    return <PokemonDataView pokemon={pokemon} />
  }

  throw new Error('Exception')
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
