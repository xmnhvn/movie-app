import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
  <footer className="bg-gray-800 text-white py-4">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-center mb-2">
          <nav className="flex gap-6">
            <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">FAQs</a>
            <a href="/" className="text-purple-400 hover:text-purple-300 transition-colors">GoWatch</a>
          </nav>
        </div>
        <div className="flex flex-col items-center text-center mb-2">
          <p className="text-gray-300 leading-tight max-w-md pb-3">
            GoWatch is a free Movies streaming site. 
            <br />Enjoy movies and TV series online with no registration required.
          </p>
        </div>
        <div className="border-t border-gray-700 pt-2">
          <div className="flex flex-col items-center">
            <p className="text-gray-400 text-sm text-center pt-4 pb-2">
              © 2025 GoWatch. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}