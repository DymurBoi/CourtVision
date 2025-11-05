import axios from 'axios';
import { API_BASE_URL } from '../utils/axiosConfig';

const API_URL = `${API_BASE_URL}/games`;

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

    getGameByTeam: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/get/team/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching game:', error);
            throw error;
        }
    },

    createGame: async (matchData) => {
        try {
            // Ensure we handle invalid date values gracefully
            let gameDate = new Date(matchData.gameDate);
            if (isNaN(gameDate)) {
                console.warn('Invalid game date, defaulting to current date.');
                gameDate = new Date();  // Set to current date if invalid
            }

            const gameData = {
                gameName: `${matchData.homeTeam} vs ${matchData.awayTeam}`,
                gameDate: gameDate.toISOString(),  // Always convert to ISO format
                gameResult: matchData.gameResult,
                finalScore: matchData.finalScore,
                comments: matchData.comments || '',
            };

            // Check for duplicate game (same teams, same date)
            const existingGames = await axios.get(`${API_URL}/get/all`);
            const duplicateGame = existingGames.data.find((game) => {
                return (
                    game.gameName === gameData.gameName &&
                    new Date(game.gameDate).toISOString().split("T")[0] === gameData.gameDate.split("T")[0] // Match only the date part
                );
            });

            if (duplicateGame) {
                console.warn('Duplicate game found for this date. Skipping creation.');
                return null;  // Return null if duplicate found
            }

            const response = await axios.post(`${API_URL}/post`, gameData);
            return response.data;
        } catch (error) {
            console.error('Error creating game:', error);
            throw error;
        }
    },

    updateGame: async (id, matchData) => {
        try {
            // Ensure we handle invalid date values gracefully
            let gameDate = new Date(matchData.gameDate);
            if (isNaN(gameDate)) {
                console.warn('Invalid game date, defaulting to current date.');
                gameDate = new Date();  // Set to current date if invalid
            }

            const gameData = {
                gameName: `${matchData.homeTeam} vs ${matchData.awayTeam}`,
                gameDate: gameDate.toISOString(),  // Always convert to ISO format
                gameResult: matchData.gameResult,
                finalScore: matchData.finalScore,
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
