import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Landmark } from "@shared/schema";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MapView from "@/components/MapView";
import VRView from "@/components/VRView";
import LoadingOverlay from "@/components/LoadingOverlay";

export default function Home() {
  const [view, setView] = useState<"map" | "vr">("map");
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all landmarks
  const { data: landmarks, isLoading: isLoadingLandmarks } = useQuery({
    queryKey: ["/api/landmarks"],
    queryFn: async () => {
      const response = await fetch("/api/landmarks");
      if (!response.ok) {
        throw new Error("Failed to fetch landmarks");
      }
      return response.json() as Promise<Landmark[]>;
    }
  });

  // Handle landmark selection
  const handleLandmarkSelect = async (slug: string) => {
    if (!landmarks) return;
    
    const landmark = landmarks.find(lm => lm.slug === slug);
    if (landmark) {
      setSelectedLandmark(landmark);
    }
  };

  // Handle immerse button click
  const handleImmerseClick = () => {
    if (!selectedLandmark) return;
    
    setIsLoading(true);
    // Simulate loading time for VR resources
    setTimeout(() => {
      setView("vr");
      setIsLoading(false);
    }, 1500);
  };

  // Handle exit VR click
  const handleExitVR = () => {
    setIsLoading(true);
    setTimeout(() => {
      setView("map");
      setIsLoading(false);
    }, 1000);
  };

  // Set the first landmark as default when data loads
  useEffect(() => {
    if (landmarks && landmarks.length > 0 && !selectedLandmark) {
      setSelectedLandmark(landmarks[0]);
    }
  }, [landmarks, selectedLandmark]);

  return (
    <>
      <Header 
        landmarks={landmarks || []} 
        selectedLandmark={selectedLandmark} 
        onSelect={handleLandmarkSelect} 
      />
      
      <main className="flex-grow relative">
        {/* Map View */}
        <div className={`absolute inset-0 z-10 ${view === "map" ? "" : "hidden"}`}>
          <MapView 
            landmarks={landmarks || []} 
            selectedLandmark={selectedLandmark}
            onLandmarkClick={handleLandmarkSelect}
            onImmerseClick={handleImmerseClick}
          />
        </div>
        
        {/* VR View */}
        <div className={`absolute inset-0 bg-dark z-20 ${view === "vr" ? "" : "hidden"}`}>
          {selectedLandmark && (
            <VRView 
              landmark={selectedLandmark} 
              onExitVR={handleExitVR} 
            />
          )}
        </div>
        
        {/* Loading Overlay */}
        <LoadingOverlay isVisible={isLoading || isLoadingLandmarks} />
      </main>
      
      <Footer />
    </>
  );
}
