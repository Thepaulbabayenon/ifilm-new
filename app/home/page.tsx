import { FilmGrid } from "../components/FilmGrid";
import { FilmSlider } from "../components/FilmSliders/FilmSlider";
import { FilmSliderComedy } from "../components/FilmSliders/FilmSliderComedy";
import { FilmSliderDrama } from "../components/FilmSliders/FilmSliderDrama";
import { FilmSliderFolklore } from "../components/FilmSliders/FilmSliderFolklore";
import { FilmSliderHorror } from "../components/FilmSliders/FilmSliderHorror";
import { FilmSliderReco } from "../components/FilmSliders/FilmSliderReco";
import FilmVideo from "../components/FilmVideo";
import RatingComponent from "../components/RatingComponent";
import RecentlyAdded from "../components/RecentlyAdded";

export default async function HomePage() {
    // Assume we have the userId from somewhere (like session, context, or hardcoded for now)
    const userId = 1; // Replace with the actual way of getting userId dynamically

    return (
        <div className="p-5 lg:p-0">
            <FilmVideo />
            <h1 className="text-3xl font-bold text-gray-400">BEST FILMS</h1>
            <RecentlyAdded />
            <h1 className="text-3xl font-bold text-gray-400">POPULAR FILMS</h1>
            <FilmSlider />

            <h1 className="text-3xl font-bold text-gray-400">COMEDY</h1>
            <FilmSliderComedy />

            <h1 className="text-3xl font-bold text-gray-400">DRAMA</h1>
            <FilmSliderDrama />

            <h1 className="text-3xl font-bold text-gray-400">FOLKLORE</h1>
            <FilmSliderFolklore />

            <h1 className="text-3xl font-bold text-gray-400">HORROR</h1>
            <FilmSliderHorror />
            
            <h1 className="text-3xl font-bold text-gray-400">RECOMMENDED FOR YOU</h1>
            <FilmSliderReco userId={userId.toString()} />
            <RatingComponent filmId={123}/>
            <h1 className="text-3xl font-bold text-gray-400">SOME OF THE BEST</h1>
            <FilmGrid/>
        </div>
    );
}
