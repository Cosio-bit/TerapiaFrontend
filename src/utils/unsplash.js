import axios from 'axios';

const UNSPLASH_ACCESS_KEY = 'QkjMm1DzbXbkQDPZha7IrUSE_8UYBb-JHMrMbskJgis';

export const fetchImage = async (id) => {
  try {
    const response = await axios.get(`https://api.unsplash.com/photos/${id}`, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });
    return response.data.urls.full; // Full-size image URL
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error);
    throw error;
  }
};
