# Favourite Pokemon
This demo illustrates how we can combine Third Party Data from [https://pokeapi.co](https://pokeapi.co) with our own backend API. The app allows users to mark Third Party data (pokemon) as 'favourites' by storing them in MongoDB.

## Local Setup
- Open the terminal and run the command `npm install` to setup `express` and `prisma` libraries 
- NOTE: `postinstall` will run `prisma generate` automatically to create the Prisma Client based on `./prisma/schema.prisma` 
- Add a `.env` file to the root of your project containing the variable `DATABASE_URL` with a MongoDB connection String as the value.

## Deploying to Vercel
This project is compatible with [Vercel](https://vercel.com/docs/frameworks/backend/express). Connect your Git Repo to vercel, and add the `DATABASE_URL` as an environment variable during deployment.

## Iteration
If you find the patterns in this demo useful, you may apply the same approach in your own project. You may be able to borrow this pattern for use in other contexts where a favourites feature is useful.
