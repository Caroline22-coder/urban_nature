import Constants from 'expo-constants';

const API_KEY = Constants.expoConfig?.extra?.TREFLE_API_KEY || "vCXGS-3CTvuiKDbgp6sr6asl_TP--Foj1L5Sy2np92E";

export const TREFLE_CONFIG = {
  BASE_URL: 'https://trefle.io/api/v1/plants',
  API_KEY,
  headers: {
    accept: 'application/json',
  },
};

export const fetchTrees = async ({ query }: { query: string }) => {
  const endpoint = query
    ? `${TREFLE_CONFIG.BASE_URL}/search?token=${TREFLE_CONFIG.API_KEY}&q=${encodeURIComponent(query)}`
    : `${TREFLE_CONFIG.BASE_URL}?token=${TREFLE_CONFIG.API_KEY}`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: TREFLE_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch trees (status ${response.status})`);
  }

  const data = await response.json();

  return data.data.map((tree: any) => ({
    id: tree.id,
    name: tree.common_name || tree.scientific_name,
    scientific_name: tree.scientific_name,
    image_url: tree.image_url,
  }));
};


