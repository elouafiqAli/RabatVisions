import { Landmark } from "@shared/schema";

interface LandmarkSelectorProps {
  landmarks: Landmark[];
  selectedLandmark: Landmark | null;
  onSelect: (slug: string) => void;
}

export default function LandmarkSelector({ 
  landmarks, 
  selectedLandmark, 
  onSelect 
}: LandmarkSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSelect(e.target.value);
  };

  return (
    <div className="relative">
      <select 
        id="landmarkSelect" 
        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary"
        value={selectedLandmark?.slug || ""}
        onChange={handleChange}
      >
        <option value="">Choose a landmark</option>
        {landmarks.map((landmark) => (
          <option key={landmark.slug} value={landmark.slug}>
            {landmark.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-dark">
        <i className="bx bx-chevron-down text-lg"></i>
      </div>
    </div>
  );
}
