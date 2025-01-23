import { useState, useEffect } from "react";
import axios from "axios";

const UNSPLASH_ACCESS_KEY = "QkjMm1DzbXbkQDPZha7IrUSE_8UYBb-JHMrMbskJgis";

export const useUnsplashBackground = (query = "nature", orientation = "landscape") => {
  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    const fetchRandomImage = async () => {
      try {
        const response = await axios.get("https://api.unsplash.com/photos/random", {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
          params: { query, orientation },
        });
        setBackgroundImage(response.data.urls.full);
      } catch (error) {
        console.error("Error fetching Unsplash image:", error);
      }
    };

    fetchRandomImage();
  }, [query, orientation]);

  return backgroundImage;
};
