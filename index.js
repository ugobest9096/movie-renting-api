const http = require('http');
const movies = require('./movies-db');

const port = 3000;

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/api/movies') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(movies));
    } else if (req.method === 'GET' && req.url.startsWith('/api/movies/')) {
        const movieId = req.url.split('/')[3];
        const movie = movies.find(movie => movie.id === parseInt(movieId));
        if (movie) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(movie));
        } else {
            res.writeHead(404);
            res.end('Movie not found');
        }
    } else if (req.method === 'POST' && req.url === '/api/movies') {
        // Parse JSON body for new movie data
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const newMovie = JSON.parse(body);
                // Validate new movie data (e.g., required fields, unique ID)
                // ...

                // Assign a new ID if not provided
                if (!newMovie.id) {
                    newMovie.id = Math.max(...movies.map(movie => movie.id)) + 1;
                }

                movies.push(newMovie);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newMovie));
            } catch (err) {
                console.error(err);
                res.writeHead(400);
                res.end('Invalid request body');
            }
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});