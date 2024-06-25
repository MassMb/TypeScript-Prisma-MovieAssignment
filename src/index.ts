import readlineSync from 'readline-sync';
import { PrismaClient, Movie, Genre } from '@prisma/client';

const prisma = new PrismaClient();

async function addMovie() {
    const title: string = readlineSync.question('Enter movie title: ').toLowerCase();
    const year: number = readlineSync.questionInt('Enter movie year: ');

    const movie: Movie = await prisma.movie.create({
        data: {
            title,
            year,
        },
    });
    console.log("----------------- Added Movie Result --------------------------");
    console.log("");
    console.log(`You've Added the Movie: ${movie}`);
}

async function updateMovie() {
    // Expected:
    // 1. Prompt the user for movie ID to update.
    // 2. Prompt the user for new movie title, year, and genre ID.
    const movieId: number = readlineSync.questionInt('Enter movie ID: ');
    const movieTitle: string = readlineSync.question('Enter new movie Title: ').toLowerCase();
    const movieYear: number = readlineSync.questionInt('Enter new movie Year: ');
    // const movieGenreId: number = readlineSync.questionInt('Enter new movie Gengre id: ');
    // 3. Use Prisma client to update the movie with the provided ID with the new details.
    const movie = await prisma.movie.update({
        where: { id: movieId },
        data: {
            title: movieTitle,
            year: movieYear,
            // genreId: movieGenreId
        }
    })
    console.log("----------------- Updated Movie Result --------------------------");
    console.log("");
    console.log(`The Updated Movie: ${movie}`);
    //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#update
}

async function deleteMovie() {
    // Expected:
    // 1. Prompt the user for movie ID to delete.
    const movieId: number = readlineSync.questionInt('Enter movie ID: ');
    // 2. Use Prisma client to delete the movie with the provided ID.
    const movie = await prisma.movie.delete({
        where : { id: movieId }
    })
    // 3. Print a message confirming the movie deletion.
    console.log("----------------- Delete a Movie Result --------------------------");
    console.log("");
    console.log(`You've deleted this movie ${movie}`);
    //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#delete
    
}

async function listMovies() {
    // Expected:
    // 1. Use Prisma client to fetch all movies.
    const movieList = await prisma.movie.findMany({
        // 2. Include the genre details in the fetched movies.
        include: {
            genre: true,
        },
    });
    // 3. Print the list of movies with their genres. 
    movieList.forEach(movie => {
        console.log(`Movie: ${movie.title}`);
        console.log(`Genre:`);
        movie.genre.forEach(genre => {
            console.log("----------------- List of Movies Result --------------------------");
            console.log("");
            console.log(`       ${genre.name}`);
        });
        
        //  Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findmany
    });

    
}

async function listMovieById() {
    // Expected:
    // 1. Prompt the user for movie ID to list.
    const movieId: number = readlineSync.questionInt('Enter movie ID: ');
    // 2. Use Prisma client to fetch the movie with the provided ID.
    const movie = await prisma.movie.findUnique({
        where: { id: movieId },
         // 3. Include the genre details in the fetched movie.
        include: {
            genre: true
        } 
    });
    // 4. Print the movie details with its genre.
    console.log("----------------- List of Movie by ID Result --------------------------");
    console.log("");

    console.log(`Movie: ${movie?.title}`);
    movie?.genre.forEach(genre => {
        console.log(`       ${genre.name}`);
    });  
    //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findunique 
}

async function listMoviesByYear() {
    // Expected:
    // 1. Prompt the user for the year to list movies.
    const movieYear: number = readlineSync.questionInt('Enter a movie Year: ');
    // 2. Use Prisma client to fetch movies from the provided year.
    const movies = await prisma.movie.findMany({
        where: { year: movieYear },
        // 3. Include the genre details in the fetched movies.
        include: {
            genre: true
        }
    }) 
    // 4. Print the list of movies from that year with their genres.
    movies.forEach(movie => {
        console.log("----------------- List of Movies by Year Result --------------------------");
        console.log("");

        console.log(`Movie: ${movie.title}`);
        console.log(`Genre:`);
        movie.genre.forEach(genre => {
            console.log(`       ${genre.name}`);
        });
        
        //  Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findmany
    });
    //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findmany
    
   
}

async function listMoviesByGenre() {
    // Expected:
    // 1. Prompt the user for genre Name to list movies.
    const genreName: string = readlineSync.question('Enter a movie genre name: ').toLowerCase();
    // 2. Use Prisma client to fetch movies with the provided genre ID.
    const genreMovies  = await  prisma.genre.findMany({
        where: { name: genreName },
        // 3. Include the genre details in the fetched movies
        include: {
            movies: true
        }
    });
    genreMovies.forEach(genre => {
        console.log("----------------- List of Movies by Year Result --------------------------");
        console.log("");
         // 4. Print the list of movies with the provided genre.
        console.log(`Movie: ${genre.name}`);
        console.log(`Genre:`);
        genre.movies.forEach(movie => {
            console.log(`       ${movie.title}`);
        });
    });
    //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findmany   
}

async function addGenre() {
    // Expected:
    //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#create
    // 1. Prompt the user for genre name.
    const genreName: string = readlineSync.question('Enter new movie genre: ').toLowerCase();
    // 2. Use Prisma client to create a new genre with the provided name.
    const genre: Genre = await prisma.genre.create({
        data: {
            name: genreName
        },
    });
    // 3. Print the created genre details.
    console.log("----------------- Added Genre Result --------------------------");
    console.log("");
    console.log(`Added new Genre:  ${genre}`);
}

async function addGenreToMovie() {
    // Expected:
    // 1. Prompt the user for multiple genres to add (comma separated).
    const genres = readlineSync.question("Enter multiple genre seperated by comma:  ").toLowerCase();
    // 2. Split the input into an array of genre names.
    const newGenres = genres.split(',');
    // 3. Use Prisma client to create multiple genres with the provided names.
    console.log("----------------- Added Multiple Genre Result --------------------------");
    console.log(`You added these new Genres: `);
    
    for (let i = 0; i < newGenres.length; i++) {
        await prisma.genre.create({ 
            data: {
                name: newGenres[i]
            }
        });
        // 4. Print the created genres details.
        console.log(newGenres[i])
    }
    //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#create
    
}

async function main() {
    let exit = false;

    while (!exit) {
        console.log("\n--- Movie Management System ---");
        console.log("1. Add Movie");
        console.log("2. Update Movie");
        console.log("3. Delete Movie");
        console.log("4. List All Movies");
        console.log("5. List Movie by ID");
        console.log("6. List Movies by Year");
        console.log("7. List Movies by Genre");
        console.log("8. Add Genre");
        console.log("9. Add Genre to Movie");
        console.log("0. Exit");

        const choice: number = readlineSync.questionInt('Enter your choice: ');

        switch (choice) {
            case 1:
                await addMovie();
                break;
            case 2:
                await updateMovie();
                break;
            case 3:
                await deleteMovie();
                break;
            case 4:
                await listMovies();
                break;
            case 5:
                await listMovieById();
                break;
            case 6:
                await listMoviesByYear();
                break;
            case 7:
                await listMoviesByGenre();
                break;
            case 8:
                await addGenre();
                break;
            case 9:
                await addGenreToMovie();
                break;
            case 0:
                exit = true;
                break;
            default:
                console.log('Invalid choice. Please try again.');
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });