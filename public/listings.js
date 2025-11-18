import { createProfile } from './profile.js';
import { toggleFavorite } from './toggle.js';

// Create pokemon listings for a single type
// We receive a pokemon type with a list of its members
const createListings = (pokemonType, collectionSet = new Set()) => {
  // add a section to the page to hold pokemon of this type
  const section = document.createElement('section')
  section.classList.add(pokemonType.name)
  // Iterate over the list of members for this type. 
  // Members live inside a nested "pokemon" array 
  pokemonType.pokemon
    .forEach(item => {
      // get the ID from the URL for this pokemon
      // e.g. 25 from https://pokeapi.co/api/v2/pokemon/25/
      const id = item.pokemon.url.split('/').filter(e => Number(e)).pop()
      // Skip any pokemon with an ID > 10000 
      // NOTE: these IDs are alternate forms that often lack images
      if (id > 10000) return
      // get a sprite icon directly from GitHub based on the ID  
      const iconURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
      // assign a unique ID to the popover 
      // include the name of the pokemonType in the popoverId
      // to account for pokemon possibly having multiple types
      const popoverId = `${pokemonType.name}-${id}`
      // Check if this pokemon is in the collection (two-state system)
      const isInCollection = collectionSet.has(item.pokemon.name)
      const heartIcon = isInCollection ? 'heart-fill.svg' : 'heart-outline.svg'

      // make a div / template for each listing. 
      const div = document.createElement('div')
      div.classList.add('listing')
      // the template includes a button to open the popover
      // as well as a favorite button icon (no count)
      let template =
        `<div class="listing-buttons">
              <button class="openButton" popoverTarget="${popoverId}" >
                <img src="${iconURL}" onError="this.src='pokeball.svg'"/>
                <span>${item.pokemon.name}</span>
                <img class="open" src="open.svg" />
              </button>
              <button class="favorite" data-pokemon-name="${item.pokemon.name}" data-pokemon-url="${item.pokemon.url}">
                <img src="${heartIcon}" class="heart" />
              </button>
            </div>
            <div popover id="${popoverId}">
              <div class="profile">
                <p>Loading...</p>
              </div>
            </div>`
      div.innerHTML = DOMPurify.sanitize(template)

      // Add click handler for favorite button
      div.querySelector('.favorite')
        .addEventListener('click', () => toggleFavorite(item.pokemon.name, item.pokemon.url))

      // when the popover is opened, fetch details and build a profile
      // we only do this when opened to avoid excessive API calls 
      div.querySelector(`#${popoverId}`)
        .addEventListener('toggle', async (event) => {
          if (event.newState == 'open') {
            let popover = event.target
            // Fetch current favorite state on demand
            let template = await createProfile(popoverId, item.pokemon.url)
            popover.innerHTML = template
            // Activate favorite button inside profile 
            popover.querySelector('.favorite')
              .addEventListener('click', () => toggleFavorite(item.pokemon.name, item.pokemon.url))

          }
        })
      // add this listing to the section for this type
      section.appendChild(div)

    })
  // add this section to the main part of the page
  document.querySelector('main').appendChild(section)
}


export { createListings }

