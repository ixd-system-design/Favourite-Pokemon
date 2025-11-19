let favourites = {
    name: 'favourites',
    pokemon: []
}

// Fetch the latest favourites from the API
const getFavourites = async () => {
    try {
        const response = await fetch('/data')
        const items = await response.json()
        favourites = {
            name: 'favourites',
            pokemon: items.map(item => ({
                pokemon: item.data
            }))
        }
        return favourites
    } catch (err) {
        console.error('Failed to fetch collection:', err)
        return favourites
    }
}

// Shared toggle functionality for adding/removing Pokemon from collection
const toggleFavorite = async (pokemonName, pokemonUrl) => {
    try {
        // find all hearts for this pokemon
        let hearts = document
            .querySelectorAll(`.favorite[data-pokemon-name="${pokemonName}"] .heart`)

        //Add loading spinner animation to hearts
        hearts.forEach(heart => heart.classList.add('loading'))

        // Send pokemon data (just name and url)
        const response = await fetch('/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: pokemonName,
                url: pokemonUrl
            })
        })
        const result = await response.json()

        // Update favourites state based on action
        if (result.action === 'added') {
            favourites.pokemon.push({
                pokemon: {
                    name: pokemonName,
                    url: pokemonUrl
                }
            })
        } else {
            favourites.pokemon = favourites.pokemon.filter(
                item => item.pokemon.name !== pokemonName
            )
            // remove from favourites section
            document.querySelector(`section.favourites .listing-${pokemonName}`)?.remove()
        }
        // Update UI based on action  for all hearts 
        hearts.forEach(heart => {
            heart.src = result.action === 'added' ? 'heart-fill.svg' : 'heart-outline.svg'
            heart.classList.remove('loading')
        })


        return result

    } catch (err) {
        console.error('Failed to toggle favorite:', err)
        // Remove loading state on error
        hearts.forEach(heart => heart.classList.remove('loading'))
        throw err
    }
}

const isFavourite = (pokemonName) => {
    return favourites.pokemon.some(item => item.pokemon.name === pokemonName)
}


export { toggleFavorite, getFavourites, isFavourite, favourites }
