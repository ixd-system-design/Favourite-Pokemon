import { createProfile } from './profile.js';
import { isFavourite } from './favourites.js';

// create a listing for a single pokemon item
const createListing = (pokemon, pokemonType) => {
  console.log(pokemon)
  // get the ID from the URL for this pokemon
  // e.g. 25 from https://pokeapi.co/api/v2/pokemon/25/
  const id = pokemon.url.split('/').filter(e => Number(e)).pop()
  // Skip any pokemon with an ID > 10000 
  // NOTE: these IDs are alternate forms that often lack images
  if (id > 10000) return null
  // get a sprite icon directly from GitHub based on the ID  
  const iconURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
  // assign a unique ID to the popover 
  // include the name of the pokemonType in the popoverId
  // to account for pokemon possibly having multiple types
  const popoverId = `${pokemonType.name}-${pokemon.name}`
  const heartIcon = isFavourite(pokemon.name) ?
    'heart-fill.svg' : 'heart-outline.svg'
  // make a div / template for each listing. 
  const div = document.createElement('div')
  div.classList.add('listing')
  div.classList.add(`listing-${pokemon.name}`)
  // the template includes a button to open the popover
  // as well as a favorite button icon (no count)
  let template =
    `<div class="listing-buttons">
      <button class="openButton" popoverTarget="${popoverId}" >
        <img src="${iconURL}" onError="this.src='pokeball.svg'"/>
        <span>${pokemon.name}</span>
        <img class="open" src="open.svg" />
      </button>
      <button class="favorite" data-pokemon-name="${pokemon.name}" data-pokemon-url="${pokemon.url}">
        <img src="${heartIcon}" class="heart" />
      </button>
    </div>
    <div popover id="${popoverId}">
      <div class="profile">
        <p>Loading...</p>
      </div>
    </div>`
  div.innerHTML = DOMPurify.sanitize(template)

  // when the popover is opened, fetch details and build a profile
  // we only do this when opened to avoid excessive API calls 
  div.querySelector(`#${popoverId}`)
    .addEventListener('toggle', async (event) => {
      if (event.newState == 'open') {
        let popover = event.target
        let template = await createProfile(popoverId, pokemon.url, pokemon.name)
        popover.innerHTML = template
      }
    })

  return div
}


// Create all pokemon listings for a given pokemon type
// We receive a pokemon type with a list of its members
const createListings = (pokemonType) => {
  // get existing section or create a new one if necessary
  let section = document.querySelector(`section.${pokemonType.name}`)
  if (!section) {
    section = document.createElement('section')
    section.classList.add(pokemonType.name)
    document.querySelector('main').appendChild(section)
  }
  section.innerHTML = ''

  // Iterate over the list of members for this type. 
  // Members live inside a nested "pokemon" array 
  pokemonType.pokemon.forEach(item => {
    const div = createListing(item.pokemon, pokemonType)
    if (div) {
      section.appendChild(div)
    }
  })

}


export { createListings, createListing }

