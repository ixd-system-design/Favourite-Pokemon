import { createNavigation } from './navigation.js';
import { createListings } from './listings.js';
import { getFavourites, toggleFavorite } from './favourites.js';

// Handle favorite button clicks 
document.addEventListener('click', (e) => {
  const favoriteBtn = e.target.closest('.favorite')
  if (favoriteBtn) {
    const { pokemonName, pokemonUrl } = favoriteBtn.dataset
    toggleFavorite(pokemonName, pokemonUrl)
  }
})

// Fetch favourites from our API 
const favourites = await getFavourites()
console.log('Favourites', favourites)

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

// Now we can build the navigation menu and listings for each type
createNavigation(pokemonTypes)

// Create listings for each pokemon type (filter out empty types)
pokemonTypes
  .filter(pokemonType => pokemonType.pokemon.length > 0)
  .forEach(pokemonType => createListings(pokemonType))



