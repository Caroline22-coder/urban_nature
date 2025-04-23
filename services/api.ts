const url = 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZDQwYjUwN2E0OGY1ODUxNzEwZWU0YmY2NzNlYjk4ZCIsIm5iZiI6MTc0NTM5Nzk5OC41NzIsInN1YiI6IjY4MDhhOGVlYjZjNjNkMjcwZmFhZGFmMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.84FC1xGEhaZgK7VneKjyccDPgxReCmjciDidv-RsyAc'
  }
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));