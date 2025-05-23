import axios from 'axios';

const API_URL = 'http://localhost:8080/api/game';

const gameService = {
    getAllGames: async () => {
        try {
            const response = await axios.get(`${API_URL}/get/all`);
            return response.data;
        } catch (error) {
            console.error('Error fetching games:', error);
            throw error;
        }
    },

    getGameById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/get/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching game:', error);
            throw error;
        }
    },

    createGame: async (matchData) => {
        try {
            const gameData = {
                gameName: `${matchData.homeTeam} vs ${matchData.awayTeam}`,
                gameDate: new Date(matchData.date).toISOString(),
                gameResult: matchData.result,
                finalScore: matchData.score,
                comments: ''
            };
            const response = await axios.post(`${API_URL}/post`, gameData);
            return response.data;
        } catch (error) {
            console.error('Error creating game:', error);
            throw error;
        }
    },

    updateGame: async (id, matchData) => {
        try {
            const gameData = {
                gameName: `${matchData.homeTeam} vs ${matchData.awayTeam}`,
                gameDate: new Date(matchData.date).toISOString(),
                gameResult: matchData.result,
                finalScore: matchData.score
            };
            const response = await axios.put(`${API_URL}/put/${id}`, gameData);
            return response.data;
        } catch (error) {
            console.error('Error updating game:', error);
            throw error;
        }
    },

    deleteGame: async (id) => {
        try {
            await axios.delete(`${API_URL}/delete/${id}`);
        } catch (error) {
            console.error('Error deleting game:', error);
            throw error;
        }
    }
};

export default gameService; 