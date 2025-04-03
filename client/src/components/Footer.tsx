export default function Footer() {
  return (
    <footer className="bg-dark text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-sm">© {new Date().getFullYear()} Discover Rabat VR Experience</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              <i className="bx bxl-github text-xl"></i>
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              <i className="bx bxl-twitter text-xl"></i>
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              <i className="bx bxl-instagram text-xl"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
