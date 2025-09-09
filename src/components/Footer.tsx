import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-purple-400 mb-4">GoWatch</h3>
            <p className="text-gray-300 leading-relaxed">
              GoWatch is a free Movies streaming site. Enjoy movies and TV series online with no registration required.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Home</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Movies</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">TV Shows</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Watchlist</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300">info@gowatch.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300">New York, NY</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Links */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap gap-6 mb-4 md:mb-0">
              <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">Contacts</a>
              <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">FAQs</a>
              <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">GoWatch</a>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 GoWatch. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}