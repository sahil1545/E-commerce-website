import axios from "axios";

const ML_BASE_URL = "http://localhost:8000"; // Python ML API

const getRecommendations = async (userId) => {
  const response = await axios.post(
    `${ML_BASE_URL}/recommend`,
    { user_id: userId }
  );

  return response.data;
};

export default {
  getRecommendations
};
