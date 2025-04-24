import Constants from 'expo-constants';

const API_KEY = Constants.expoConfig?.extra?.TMDB_API_KEY;

export const TMDB_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  API_KEY,
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};


export const fetchMovies = async ({ query }: {query: string}) => {
  const endpoint = query
  ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
  : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: TMDB_CONFIG.headers,
  });
  if (!response.ok) {
    throw new Error('Failed to fetch movies (status${response.status})');
  }

  const data = await response.json();

  return data.results;
}


