import { createNavigation } from './navigation.js';
import { createListings } from './listings.js';

// fetch a simple list of all pokemon types (fighting, flying, etc.)
// This only includes the name and url for each.
const response = await fetch('https://pokeapi.co/api/v2/type/?limit=100')
const json = await response.json()

console.log('List of Pokemon Types', json.results)

// Let's get more details for each of the types of pokemon
// this will include a list of member pokemon for each type  
// note the use of Promise.all to fetch all at once
const pokemonTypes = await Promise.all(
  json.results.map(async (pokemonType) => {
    const data = await fetch(pokemonType.url)
    return data.json()
  })
)
console.log('Pokemon Types with Details', pokemonTypes)

// Fetch collection data from our API
// This now returns an array of items with full pokemon data
let collectionSet = new Set()
let collectionList = []
try {
  const collectionResponse = await fetch('/data')
  const items = await collectionResponse.json()
  collectionList = items
  // Build a Set of pokemon names for quick lookup
  collectionSet = new Set(items.map(item => item.data.name))
  console.log('Collection Data', items)
  console.log('Collection Set', collectionSet)
} catch (err) {
  console.error('Failed to fetch collection:', err)
}

// Create a special "collection" type that matches the pokemonTypes structure
// This will only include pokemon that are in the collection
const collectionType = {
  name: 'favourites',
  pokemon: collectionList.map(item => ({
    pokemon: {
      name: item.data.name,
      url: `https://pokeapi.co/api/v2/pokemon/${item.id}/`
    }
  }))
}

// Now we can build the navigation menu and listings for each type
createNavigation(pokemonTypes, collectionType)

// Create listings for each pokemon type (filter out empty types)
pokemonTypes
  .filter(pokemonType => pokemonType.pokemon.length > 0)
  .forEach(pokemonType => createListings(pokemonType, collectionSet))

// Also create the collection section
if (collectionType.pokemon.length > 0) {
  createListings(collectionType, collectionSet)
}

