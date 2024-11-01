import { MovieCard } from "@/app/components/MovieCard";
import { getAllMovies } from "@/app/api/getMovies"; // Importing the new function
import { useUser } from "@clerk/nextjs"; // Import Clerk's hook
import Image from "next/image";

export default async function Watchlist() {
  // Use Clerk's useUser hook to get the current user's session

  try {
    // Use the getAllMovies function to fetch movies
    const data = await getAllMovies();

    if (!data || data.length === 0) {
      return (
        <>
          <div className="items-center justify-center flex flex-col">
            <h1 className="text-gray-400 text-4xl font-bold underline mt-10 px-5 sm:px-0 pt-9">
              Films
            </h1>
            <p>No films found.</p>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="recently-added-container mb-20"> {/* Add margin-bottom to this container */}
          <div className="items-center justify-center flex ">
            <h1 className="text-gray-400 text-4xl font-bold items-center justify-center mt-10 px-5 sm:px-0 pt-9">
              All Films
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-5 sm:px-0 mt-10 gap-6">
            {data.map((movie) => (
              <div key={movie?.id} className="relative h-60">
                <Image
                  src={movie?.imageString as string}
                  alt="Movie"
                  width={500}
                  height={400}
                  className="rounded-sm absolute w-full h-full object-cover"
                />
                <div className="h-60 relative z-10 w-full transform transition duration-500 hover:scale-125 opacity-0 hover:opacity-100">
                  <div className="bg-gradient-to-b from-transparent via-black/50 to-black z-10 w-full h-full rounded-lg flex items-center justify-center">
                    <Image
                      src={movie?.imageString as string}
                      alt="Movie"
                      width={800}
                      height={800}
                      className="absolute w-full h-full -z-10 rounded-lg object-cover"
                    />

                    {movie && (
                      <MovieCard
                        key={movie?.id}
                        age={movie?.age as number}
                        movieId={movie?.id as number}
                        overview={movie?.overview as string}
                        time={movie?.duration as number}
                        title={movie?.title as string}
                        year={parseInt(movie?.release.toString())}
                        youtubeUrl={movie?.youtubeString as string}
                        initialRatings={0}
                        watchList={false}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error("Error fetching watchlist data:", error);
    return (
      <>
        <h1 className="text-white text-4xl font-bold underline mt-10 px-5 sm:px-0">
          Films
        </h1>
        <p>Error fetching film data. Please try again later.</p>
      </>
    );
  }
}
