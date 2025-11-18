// Below we will use the Express Router to define a series of API endpoints.
// Express will listen for API requests and respond accordingly
import express from 'express'
const router = express.Router()

// Set this to match the model name in your Prisma schema
const model = 'item'

// Prisma lets NodeJS communicate with MongoDB
// Let's import and initialize the Prisma client
// See also: https://www.prisma.io/docs
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Connect to the database
prisma.$connect().then(() => {
    console.log('Prisma connected to MongoDB')
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err)
})

// Note: This is a community-curated collection where any user can add or remove items.
// No user tracking or authentication is required.

// ----- Toggle Item (Add/Remove) -----
// For any given Pokemon, if it exists in the collection, remove it.
// If it doesn't exist, add it with basic data from PokeAPI.

router.post('/data', async (req, res) => {
    try {
        const { name, url } = req.body

        if (!name || !url) {
            return res.status(400).send({ error: 'Invalid pokemon data. Must include name and url.' })
        }

        // Extract ID from URL (e.g., "25" from "https://pokeapi.co/api/v2/pokemon/25/")
        const id = url.split('/').filter(e => Number(e)).pop()

        if (!id) {
            return res.status(400).send({ error: 'Could not extract ID from pokemon URL.' })
        }

        // Check if this pokemon already exists in the collection
        const existing = await prisma[model].findFirst({
            where: {
                id: id
            }
        })

        let action, item
        if (existing) {
            // Already in collection, so remove it
            item = await prisma[model].delete({
                where: { id: existing.id }
            })
            action = 'removed'
        } else {
            // Not in collection, so add it
            item = await prisma[model].create({
                data: {
                    id: id,
                    data: { name, url }
                }
            })
            action = 'added'
        }

        res.status(action === 'added' ? 201 : 200).send({
            action,
            item
        })

    } catch (err) {
        console.error('POST /data error:', err)
        res.status(500).send({ error: 'Failed to toggle item', details: err.message || err })
    }
})


// ----- READ (GET) all items ----- 
router.get('/data', async (req, res) => {
    try {
        // Get all items from the collection
        const items = await prisma[model].findMany({
            orderBy: { id: 'asc' }
        })

        res.send(items)
    } catch (err) {
        console.error('GET /data error:', err)
        res.status(500).send({ error: 'Failed to fetch items', details: err.message || err })
    }
})


// ----- READ (GET) single item by ID ----- 
router.get('/data/:pokemonId', async (req, res) => {
    try {
        const pokemonId = req.params.pokemonId

        // Find item by ID
        const item = await prisma[model].findUnique({
            where: {
                id: pokemonId
            }
        })

        res.send({
            exists: !!item,
            item: item || null
        })

    } catch (err) {
        console.error('GET /data/:pokemonId error:', err)
        res.status(500).send({ error: 'Failed to fetch item', details: err.message || err })
    }
})


// export the api routes for use elsewhere in our app 
// (e.g. in index.js )
export default router;

