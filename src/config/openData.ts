export const OPEN_DATA_ENDPOINTS = {
  paris: "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/sanisettesparis/records",
  ileDeFrance:
    "https://data.iledefrance.fr/api/explore/v2.1/catalog/datasets/toilettes-publiques-en-ile-de-france/records"
} as const;

export const GEOCODING_ENDPOINTS = {
  search: "https://data.geopf.fr/geocodage/search",
  completion: "https://data.geopf.fr/geocodage/completion"
} as const;
