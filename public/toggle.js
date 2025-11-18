// Shared toggle functionality for adding/removing Pokemon from collection

const toggleFavorite = async (pokemonName, pokemonUrl) => {
    try {
        // Add loading spinner animation to all hearts for this pokemon
        let hearts = document
            .querySelectorAll(`.favorite[data-pokemon-name="${pokemonName}"] .heart`)


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

        // Update UI based on action (two-state system)
        const isAdded = result.action === 'added'
        const newSrc = isAdded ? 'heart-fill.svg' : 'heart-outline.svg'

        // Update all hearts for this pokemon
        hearts.forEach(heart => {
            heart.src = newSrc
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

export { toggleFavorite }
