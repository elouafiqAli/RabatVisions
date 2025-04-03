interface LoadingOverlayProps {
  isVisible: boolean;
}

export default function LoadingOverlay({ isVisible }: LoadingOverlayProps) {
  if (!isVisible) return null;
  
  return (
    <div className="absolute inset-0 bg-dark bg-opacity-80 z-30 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
        <p className="text-white text-lg font-medium">Preparing your immersive experience...</p>
      </div>
    </div>
  );
}
