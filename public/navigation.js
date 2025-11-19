import { getFavourites } from './favourites.js';
import { createListings } from './listings.js';


const createNavItem = (name) => {
  const button = document.createElement('button')
  button.className = name
  button.textContent = name
  button.addEventListener('click', async () => {
    if (name === 'favourites') {
      const favourites = await getFavourites()
      createListings(favourites)
    }
    document.querySelectorAll(`section`)
      .forEach(el => el.classList.remove('active'))
    document.querySelectorAll(`section.${name}`)
      .forEach(el => el.classList.add('active'))
  })
  document.querySelector('nav').appendChild(button)
}

// Let's build a navigation menu for all given types of pokemon 
const createNavigation = (pokemonTypes) => {
  // iterate over the list of pokemon types
  // filter out the ones that have no pokemon (e.g. "unknown", "shadow")
  pokemonTypes
    .filter(pokemonType => pokemonType.pokemon.length > 0)
    .forEach(pokemonType => createNavItem(pokemonType.name))

  // Add special "favourites" button at the end 
  createNavItem('favourites')
}

export { createNavigation }
