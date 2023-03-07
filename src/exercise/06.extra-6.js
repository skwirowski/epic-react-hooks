// useEffect: use react-error-boundary, reset it and add reset keys
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
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
    status: pokemonName ? 'pending' : 'idle',
    pokemon: null,
    error: null,
  })

  React.useEffect(() => {
    if (pokemonName) {
      setState({status: statuses.pending})

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
    throw error
  }

  if (status === statuses.idle) {
    return 'Submit a pokemon'
  }

  if (status === statuses.pending) {
    return <PokemonInfoFallback name={pokemonName} />
  }

  if (status === statuses.resolved) {
    return <PokemonDataView pokemon={pokemon} />
  }

  throw new Error('Exception')
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={handleReset}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
