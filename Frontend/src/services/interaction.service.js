const API_URL = 'https://anitrack-back.vercel.app/api/interactions';
const AUTH_TOKEN_LOCALSTORAGE_KEY = "auth_token";

function getAuthToken() {

    return localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY);

}

export async function toggleFavorite(anime_id) {

    try {

        const token = getAuthToken();

        const response_http = await fetch(`${API_URL}/favorite`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify({
                anime_id
            })

        });

        const data = await response_http.json();

        if (!response_http.ok || !data.ok) {
            throw new Error(data.message || "Error al actualizar favorito");
        }

        return data;

    } catch (error) {

        console.error("Error en toggleFavorite:", error);

        throw error;

    }

}
export async function getFavorites() {

    try {

        const token = getAuthToken();

        const response_http = await fetch(`${API_URL}/favorite`, {

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        const data = await response_http.json();

        if (!response_http.ok || !data.ok) {
            throw new Error(data.message || "Error al obtener favoritos");
        }

        return data;

    } catch (error) {

        console.error("Error en getFavorites:", error);

        throw error;

    }

}
export async function addOrUpdateInList(anime_id, estado) {

    try {

        const token = getAuthToken();

        const response_http = await fetch(`${API_URL}/list`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify({
                anime_id,
                estado
            })

        });

        const data = await response_http.json();

        if (!response_http.ok || !data.ok) {
            throw new Error(data.message || "Error al actualizar la lista");
        }

        return data;

    } catch (error) {

        console.error("Error en addOrUpdateInList:", error);

        throw error;

    }

}