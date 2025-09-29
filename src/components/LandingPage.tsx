import { Button } from './ui/button';
import { Input } from './ui/input';
import { Footer } from './Footer';
import { motion } from 'motion/react';
import React, { useState } from 'react';
import GoWatchLogo from './GoWatch-logo.png';

const LandingPage: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  const [searchQuery, setSearchQuery] = useState('');
  return (
  <div className="min-h-screen dark:bg-gray-900" style={{ backgroundColor: '#EFE4F4' }}>
    <br />
    <br />
      <div className="flex flex-col items-center py-8">
        <div className="mb-4">
          <img 
            src={GoWatchLogo} 
            alt="GoWatch Logo" 
            className="h-16 w-auto mx-auto drop-shadow-lg" 
            style={{ filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))' }}
          />
        </div>
        <br />
        <div className="w-full max-w-2xl mx-auto relative">
          <Input
            type="text"
            placeholder="Enter title..."
            className="w-full h-12 pl-4 pr-12 bg-white/95 dark:bg-gray-800/95 dark:text-white border-0 rounded-tl-lg rounded-bl-lg rounded-tr-none rounded-br-none shadow-lg focus:bg-white dark:focus:bg-gray-800 transition-colors placeholder:text-gray-500 dark:placeholder:text-gray-400"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 drop-shadow-sm">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
          </span>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 py-11 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
                <Button 
                  size="lg" 
                  onClick={onEnter}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:brightness-110 dark:shadow-purple-500/20"
                  style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}
            >
              Go Watch Now →
            </Button>
          </motion.div>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full max-w-[320px] mx-auto bg-transparent"
        >
          <h2 className="text-4xl font-bold text-gray-700 mb-6">About GoWatch</h2>
          <p className="text-base text-gray-600 mb-8 text-justify">
            GoWatch is a free online movie streaming website where users can enjoy a wide collection of films anytime, anywhere—without the need to sign up or create an account. Designed to be simple and user-friendly, GoWatch allows visitors to search by title, browse through genres, and explore recommendations based on trending and popular movies. Whether you are a fan of action, romance, comedy, fantasy, thriller, or family films, GoWatch brings entertainment right at your fingertips.
          </p>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Watch Movies Online for Free</h3>
          <p className="text-base text-gray-600 mb-6 text-justify">
            GoWatch was built with the vision of making quality entertainment accessible to everyone without the hassle of subscriptions, hidden costs, or logins. Movies are available in HD quality with smooth playback, ensuring that users enjoy their favorite titles without interruptions.
        </p>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Our Platform Includes:</h3>
        <ul className="list-none mb-6 pl-0">
          <li className="flex items-start mb-1"><span className="text-purple-500 mr-2 mt-1">✓</span><span>No account required – stream movies instantly without registration.</span></li>
          <li className="flex items-start mb-1"><span className="text-purple-500 mr-2 mt-1">✓</span><span>Wide range of genres – from timeless classics to the latest blockbusters.</span></li>
          <li className="flex items-start mb-1"><span className="text-purple-500 mr-2 mt-1">✓</span><span>Smart recommendations – discover new titles based on what you love to watch.</span></li>
          <li className="flex items-start mb-1"><span className="text-purple-500 mr-2 mt-1">✓</span><span>Mobile-friendly experience – stream movies on any device, anytime.</span></li>
          <li className="flex items-start mb-1"><span className="text-purple-500 mr-2 mt-1">✓</span><span>No installation required – simply visit GoWatch, search your movie, and enjoy.</span></li>
        </ul>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Why Choose GoWatch?</h3>
    <p className="text-base text-gray-600 mb-6 text-justify">
          Other streaming platforms often come with costly subscriptions, logins, and limited free trials. GoWatch provides unlimited access to films without requiring payment or personal details. We are committed to keeping the platform updated with new releases and ensuring the best viewing experience for all users.
        </p>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Is GoWatch Safe?</h3>
        <p className="text-base text-gray-600 mb-6">
          GoWatch prioritizes user safety and accessibility. The site is built with modern web technologies, designed to be ad-light, secure, and easy to navigate. For an even better experience, users are encouraged to enable basic browsing safety tools such as ad-blockers or VPNs.
        </p>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">The Student Project Behind GoWatch</h3>
    <p className="text-base text-gray-600 mb-2 text-justify">
          GoWatch is one of the deliverables of Mona Arsonillo & Xnea Manlangit a 4th year BSIT - Business Technology Management students, created as part of their Learning Evidence (LE) requirement. It showcases not only technical skills in web development but also creativity in design, functionality, and user experience. The project demonstrates how technology can provide accessible, free, and enjoyable online platforms for entertainment.
        </p>
        <br />
        <p className="text-base text-gray-600 text-justify">
          With GoWatch, movie lovers everywhere can find a convenient, safe, and enjoyable way to watch their favorite films—free, simple, and no account required.
        </p>
        <br />
        <br />
        <br />
      </motion.section>
    </main>

    <Footer />
  </div>
);
}

export default LandingPage;