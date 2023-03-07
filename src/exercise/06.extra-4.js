// useEffect: create an ErrorBoundary component and re-mount it
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {error: null}
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return {error}
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo)
  }

  render() {
    if (this.state.error) {
      // You can render any custom fallback UI
      return <this.props.FallbackComponent error={this.state.error} />
    }

    return this.props.children
  }
}

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
  // this will be handled by ErrorBoundary component
  throw new Error('Exception')
}

function ErrorFallback({error}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>
  )
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
        <ErrorBoundary key={pokemonName} FallbackComponent={ErrorFallback}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
