import { Landmark } from "@shared/schema";
import LandmarkSelector from "./LandmarkSelector";

interface HeaderProps {
  landmarks: Landmark[];
  selectedLandmark: Landmark | null;
  onSelect: (slug: string) => void;
}

export default function Header({ landmarks, selectedLandmark, onSelect }: HeaderProps) {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <i className="bx bxs-map text-3xl text-primary"></i>
          <h1 className="text-2xl font-serif font-bold text-dark">
            Discover <span className="text-primary">Rabat</span>
          </h1>
        </div>
        
        <LandmarkSelector 
          landmarks={landmarks} 
          selectedLandmark={selectedLandmark} 
          onSelect={onSelect} 
        />
      </div>
    </header>
  );
}
