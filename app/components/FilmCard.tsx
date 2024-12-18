"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, PlayCircle, Star } from "lucide-react";
import PlayVideoModal from "./PlayVideoModal";
import { usePathname } from "next/navigation";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

interface FilmCardProps {   
  filmId: number;
  overview: string;
  title: string;
  watchList: boolean;
  watchListId?: string; // Optional, for identifying the watchlist entry
  youtubeUrl: string;
  year: number;
  age: number;
  time: number; // Duration in minutes
  initialRatings: number; // External ratings (initial ratings)
  category: string; // Add category here to pass to PlayVideoModal
}

export function FilmCard({
  filmId,
  overview,
  title,
  watchList: initialWatchList,
  watchListId,
  youtubeUrl,
  year,
  age,
  time,
  initialRatings,
  category,  // Add category here to destructure it
}: FilmCardProps) {
  const { user } = useUser();
  const userId = user?.id;

  const [open, setOpen] = useState(false);
  const [watchList, setWatchList] = useState(initialWatchList);
  const [userRating, setUserRating] = useState<number>(0); // For the current user
  const [averageRating, setAverageRating] = useState<number>(initialRatings); // Average rating for all users
  const [isSavingWatchlist, setIsSavingWatchlist] = useState(false); // State to track if we're saving watchlist
  const [isSavingRating, setIsSavingRating] = useState(false); // State to track if we're saving rating
  const pathName = usePathname();

  // Function to mark a film as watched
  const markAsWatched = async (userId: string, filmId: number) => {
    try {
      if (!userId) {
        console.error("User ID is not available.");
        return;
      }
  
      // Send both userId and filmId in the request body
      await axios.post(
        `/api/films/${filmId}/watchedFilms`,
        { userId, filmId }, // Include filmId here as well
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(`Film ${filmId} marked as watched for user ${userId}`);
    } catch (error) {
      console.error("Error marking film as watched:", error);
    }
  };

  // Fetch user rating and average rating from the backend when the component mounts
  useEffect(() => {
    if (!userId) return; // Exit if user is not authenticated

    const fetchRatings = async () => {
      try {
        // Fetch user rating
        const response = await axios.get(`/api/films/${filmId}/user-rating`, {
          params: { userId },
        });

        if (response.data && response.data.rating !== undefined) {
          setUserRating(response.data.rating); // Set the user's rating
        }

        // Fetch average rating for the film
        const avgResponse = await axios.get(`/api/films/${filmId}/average-rating`);
        if (avgResponse.data && avgResponse.data.averageRating !== undefined) {
          setAverageRating(avgResponse.data.averageRating); // Set the average rating
        } else {
          setAverageRating(initialRatings); // Fallback to initial rating if none is found
        }
      } catch (error) {
        console.error("Error fetching ratings from the database:", error);
        setAverageRating(initialRatings); // Fallback to initial rating in case of error
      }
    };

    fetchRatings();
  }, [filmId, initialRatings, userId]);

  // Save user rating to the database when userRating changes
  useEffect(() => {
    if (!userId || userRating === 0) return; // Exit if user is not authenticated or rating is 0

    const saveUserRating = async () => {
      try {
        setIsSavingRating(true);
        await axios.post(
          `/api/films/${filmId}/user-rating`,
          { userId, rating: userRating },
          { headers: { "Content-Type": "application/json" } }
        );

        // Fetch the updated average rating after saving the user's rating
        const avgResponse = await axios.get(`/api/films/${filmId}/average-rating`);
        if (avgResponse.data && avgResponse.data.averageRating !== undefined) {
          setAverageRating(avgResponse.data.averageRating); // Update the average rating
        }
      } catch (error) {
        console.error("Error saving user rating:", error);
      } finally {
        setIsSavingRating(false);
      }
    };

    // Save the rating only if it has changed
    saveUserRating();
  }, [userRating, filmId, userId]);

  // Handle watchlist toggle
  const handleToggleWatchlist = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!userId) {
      alert("Please log in to manage your watchlist.");
      return;
    }

    setWatchList((prev) => !prev);
    setIsSavingWatchlist(true);

    try {
      if (watchList) {
        // Remove from watchlist
        await axios.delete(`/api/watchlist/${watchListId}`, {
          data: { userId },
        });
      } else {
        // Add to watchlist
        await axios.post("/api/watchlist", {
          filmId,
          pathname: pathName,
          userId,
        });
      }
    } catch (error) {
      console.error("Error toggling watchlist:", error);
      setWatchList((prev) => !prev);
    } finally {
      setIsSavingWatchlist(false);
    }
  };

  // Handle rating click
  const handleRatingClick = async (newRating: number) => {
    if (isSavingRating) {
      return;
    }

    if (!userId) {
      alert("Please log in to rate films.");
      return;
    }

    setUserRating(newRating); // Optimistically update UI

    try {
      setIsSavingRating(true);
      await axios.post(
        `/api/films/${filmId}/user-rating`,
        { userId, rating: newRating },
        { headers: { "Content-Type": "application/json" } }
      );

      const avgResponse = await axios.get(`/api/films/${filmId}/average-rating`);
      if (avgResponse.data && avgResponse.data.averageRating !== undefined) {
        setAverageRating(avgResponse.data.averageRating); // Update the average rating
      }
    } catch (error) {
      console.error("Error saving user rating:", error);
    } finally {
      setIsSavingRating(false);
    }
  };

  // Ensure averageRating is a valid number before calling toFixed
  const safeAverageRating = typeof averageRating === "number" && !isNaN(averageRating) ? averageRating : NaN;

  return (
    <>
      <button onClick={() => setOpen(true)} className="-mt-14">
        <PlayCircle className="h-20 w-20" />
      </button>

      <div className="right-5 top-5 absolute z-10">
        <Button variant="outline" size="icon" onClick={handleToggleWatchlist} disabled={isSavingWatchlist}>
          <Heart className={`w-4 h-4 ${watchList ? "text-red-500" : ""}`} />
        </Button>
      </div>

      <div className="p-5 absolute bottom-0 left-0">
        <h1 className="font-bold text-lg line-clamp-1">{title}</h1>
        <div className="flex gap-x-2 items-center">
          <p className="font-normal text-sm">{year}</p>
          <p className="font-normal border py-0.5 px-1 border-gray-200 rounded text-sm">{age}+</p>
          <p className="font-normal text-sm">{time}m</p>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 cursor-pointer ${userRating >= star ? "text-yellow-400" : "text-gray-400"}`}
                onClick={() => handleRatingClick(star)}
              />
            ))}
          </div>
        </div>
        <p className="line-clamp-1 text-sm text-gray-200 font-light">{overview}</p>
        <p className="font-normal text-sm mt-2">
          Average Rating: {isNaN(safeAverageRating) ? "N/A" : safeAverageRating.toFixed(2)} / 5
        </p>
      </div>

      <PlayVideoModal
        youtubeUrl={youtubeUrl}
        key={filmId}
        title={title}
        overview={overview}
        state={open}
        changeState={setOpen}
        age={age}
        duration={time}
        release={year}
        ratings={userRating}
        setUserRating={setUserRating}
        userId={userId || ""}
        filmId={filmId}
        markAsWatched={markAsWatched}
        category={category}  // Add category here
      />
    </>
  );
}
