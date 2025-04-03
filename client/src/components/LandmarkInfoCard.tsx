import { Landmark } from "@shared/schema";

interface LandmarkInfoCardProps {
  landmark: Landmark;
  onImmerseClick: () => void;
}

export default function LandmarkInfoCard({ 
  landmark, 
  onImmerseClick 
}: LandmarkInfoCardProps) {
  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-11/12 max-w-md bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300">
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <img 
            className="h-48 w-full object-cover md:w-48" 
            src={landmark.imageUrl} 
            alt={landmark.name} 
          />
        </div>
        <div className="p-4 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold text-dark mb-1">{landmark.name}</h2>
            <p className="text-sm text-gray-600 mb-3">{landmark.shortDescription}</p>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <i className="bx bx-time mr-1"></i>
              <span>{landmark.openingHours}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <i className="bx bx-map mr-1"></i>
              <span>{landmark.location}</span>
            </div>
          </div>
          <div className="mt-4">
            <button 
              className="w-full bg-accent hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              onClick={onImmerseClick}
            >
              <i className="bx bx-glasses"></i>
              <span>Immerse Yourself</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
