import Constants from 'expo-constants';

const API_KEY = Constants.expoConfig?.extra?.TREFLE_API_KEY || "vCXGS-3CTvuiKDbgp6sr6asl_TP--Foj1L5Sy2np92E";

export const TREFLE_CONFIG = {
  BASE_URL: 'https://trefle.io/api/v1/species',
  API_KEY,
  headers: {
    accept: 'application/json',
  },
};

export const fetchTrees = async ({ query }: { query: string }) => {
  const endpoint = `${TREFLE_CONFIG.BASE_URL}?token=${TREFLE_CONFIG.API_KEY}`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: TREFLE_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch trees (status ${response.status})`);
  }

  const data = await response.json();

  // Perform local filtering based on the query
  const filteredData = query
    ? data.data.filter((tree: any) =>
        (tree.common_name || tree.scientific_name)
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    : data.data;

  return filteredData.map((tree: any) => ({
    id: tree.id,
    name: tree.common_name || tree.scientific_name,
    scientific_name: tree.scientific_name,
    image_url: tree.image_url,
  }));
};


