import { Toilet, ToiletSource, Location, ToiletStatus } from "../models/types";

const API_PARIS =
  "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/sanisettesparis/records";
const API_IDF =
  "https://data.iledefrance.fr/api/explore/v2.1/catalog/datasets/toilettes-publiques-en-ile-de-france/records";
const API_RATP =
  "https://data.ratp.fr/api/explore/v2.1/catalog/datasets/sanitaires-reseau-ratp/records";

// Helper de calcul de distance (Formule de Haversine)
function getDistance(loc1: Location, loc2: Location): number {
  const R = 6371e3; // Rayon de la terre en mètres
  const φ1 = (loc1.latitude * Math.PI) / 180;
  const φ2 = (loc2.latitude * Math.PI) / 180;
  const Δφ = ((loc2.latitude - loc1.latitude) * Math.PI) / 180;
  const Δλ = ((loc2.longitude - loc1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// ================= NORMALIZERS =================

const normalizeParis = (records: any[]): Toilet[] => {
  return records
    .filter((r) => r.geo_point_2d)
    .map((r) => ({
      id: r.objectid
        ? `paris_${r.objectid}`
        : `paris_${Math.random().toString(36).substr(2, 9)}`,
      source: "paris",
      location: {
        latitude: r.geo_point_2d.lat,
        longitude: r.geo_point_2d.lon,
      },
      address: r.adresse || "Toilettes Publiques",
      arrondissement: r.arrondissement,
      isPMR: r.acces_pmr === "Oui",
      hasBabyRelay: r.relais_bebe === "Oui",
      isPaid: false,
      openingHours: r.horaire || "Heures d'ouverture non précisées",
      status: "open", // Forcer 'open' car l'API Paris est trop pessimiste (75% hors service)
      negativeReportsCount: 0,
      lastUpdate: Date.now(),
    }));
};

const normalizeIDF = (records: any[]): Toilet[] => {
  return records
    .filter((r) => r.coord_geo || r.geo_point_2d)
    .map((r) => {
      const coords = r.coord_geo || r.geo_point_2d;
      return {
        id: `idf_${Math.random().toString(36).substr(2, 9)}`,
        source: "idf",
        location: {
          latitude: coords.lat,
          longitude: coords.lon,
        },
        address: r.adresse || r.nom_de_la_commune || "Toilettes IDF",
        isPMR:
          r.accessibilite_pmr?.toString().toLowerCase().includes("oui") ||
          r.acces_pmr === "Oui" ||
          false,
        hasBabyRelay:
          r.relais_bebe?.toString().toLowerCase().includes("oui") || false,
        isPaid: r.tarif?.toString().toLowerCase().includes("oui") || false,
        price:
          r.tarif && !isNaN(parseFloat(r.tarif))
            ? parseFloat(r.tarif)
            : undefined,
        openingHours:
          r.horaires_d_ouverture || r.horaires_ouverture || "Non précisées",
        status: "open", // Forcer 'open' partout pour l'instant
        negativeReportsCount: 0,
        lastUpdate: Date.now(),
      };
    });
};

const normalizeRATP = (records: any[]): Toilet[] => {
  return records
    .filter((r) => r.coord_geo || r.coordonnees_geo)
    .map((r) => {
      const coords = r.coord_geo || r.coordonnees_geo;
      return {
        id: `ratp_${r.id_sanitaire || Math.random().toString(36).substr(2, 9)}`,
        source: "ratp",
        location: {
          latitude: coords.lat,
          longitude: coords.lon,
        },
        address: `Station RATP: ${r.station || "Inconnue"}`,
        isPMR:
          r.accessibilite_pmr?.toString().toLowerCase().includes("oui") ||
          false,
        hasBabyRelay:
          r.relais_bebes?.toString().toLowerCase() === "oui" || false,
        isPaid:
          r.tarif_gratuit_payant?.toString().toLowerCase().includes("payant") ||
          false,
        openingHours: r.horaires_ouverture || "Horaires de la station",
        status: "open", // Toujours open par défaut
        negativeReportsCount: 0,
        lastUpdate: Date.now(),
      };
    });
};

// ================= MERGE & FETCH =================

import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../config/firebase";

export const fetchAllToilets = async (
  userLocation: Location,
  radiusMetres: number = 5000,
  showGlobal: boolean = false,
): Promise<Toilet[]> => {
  try {
    const { latitude, longitude } = userLocation;
    const limitParams = "?limit=100";

    // ODS V2.1 syntax: where=distance(field, geom'POINT(lon lat)', distance)
    // Note: lon lat order in WKT POINT
    const pointWKT = `geom'POINT(${longitude} ${latitude})'`;

    const parisWhere = showGlobal
      ? ""
      : `&where=distance(geo_point_2d, ${pointWKT}, ${radiusMetres})`;
    const idfWhere = showGlobal
      ? ""
      : `&where=distance(coord_geo, ${pointWKT}, ${radiusMetres})`;
    const ratpWhere = showGlobal
      ? ""
      : `&where=distance(coord_geo, ${pointWKT}, ${radiusMetres})`;

    const [parisRes, idfRes, ratpRes] = await Promise.all([
      fetch(API_PARIS + limitParams + encodeURI(parisWhere)),
      fetch(API_IDF + limitParams + encodeURI(idfWhere)),
      fetch(API_RATP + limitParams + encodeURI(ratpWhere)),
    ]);

    const parisData = await parisRes.json();
    const idfData = await idfRes.json();
    const ratpData = await ratpRes.json();

    console.log("📊 API Paris:", parisData.results?.length || 0);
    console.log("📊 API IDF:", idfData.results?.length || 0);
    console.log("📊 API RATP:", ratpData.results?.length || 0);

    const allToilets: Toilet[] = [
      ...normalizeParis(parisData.results || []),
      ...normalizeIDF(idfData.results || []),
      ...normalizeRATP(ratpData.results || []),
    ];

    const nearbyToilets = allToilets;

    console.log("📍 User Location:", userLocation);
    console.log(
      "📍 Loaded Toilets (" +
        (showGlobal ? "Global" : radiusMetres + "m") +
        "):",
      nearbyToilets.length,
    );

    // Si Firebase est configuré et l'utilisateur est authentifié, on merge avec les signalements
    if (db && auth?.currentUser) {
      try {
        const overridesQuery = await getDocs(
          collection(db, "Toilets_Overrides"),
        );
        const overrides = new Map();
        overridesQuery.forEach((doc) => {
          overrides.set(doc.id, doc.data());
        });

        return nearbyToilets.map((toilet) => {
          if (overrides.has(toilet.id)) {
            const overrideData = overrides.get(toilet.id);
            return {
              ...toilet,
              status: overrideData.status || toilet.status,
              negativeReportsCount: overrideData.negativeReportsCount || 0,
              lastUpdate: overrideData.lastUpdate
                ? overrideData.lastUpdate.toMillis()
                : toilet.lastUpdate,
            };
          }
          return toilet;
        });
      } catch (firestoreError) {
        console.warn(
          "Firestore Overrides error (check rules):",
          firestoreError,
        );
        // En cas d'erreur Firestore on retourne quand même les toilettes de base
        return nearbyToilets;
      }
    }

    return nearbyToilets;
  } catch (error) {
    console.error("Erreur critique Fetch API (OpenData):", error);
    return [];
  }
};
