import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand Section */}
        <div className="space-y-4">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            NodeMatch
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed">
            The developer-first platform to find co-founders, hackathon partners, and open-source collaborators. 
            Swipe, Match, Code.
          </p>
        </div>

        {/* Product Links */}
        <div>
          <h4 className="text-white font-semibold mb-6">Product</h4>
          <ul className="space-y-4">
            <li><a href="#features" className="text-gray-400 hover:text-indigo-400 transition text-sm">Features</a></li>
            <li><Link to="/hackathons" className="text-gray-400 hover:text-indigo-400 transition text-sm">Hackathons</Link></li>
            <li><Link to="/discover" className="text-gray-400 hover:text-indigo-400 transition text-sm">Discover</Link></li>
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="text-white font-semibold mb-6">Company</h4>
          <ul className="space-y-4">
            <li><Link to="/about" className="text-gray-400 hover:text-indigo-400 transition text-sm">About Us</Link></li>
            <li><Link to="/contact" className="text-gray-400 hover:text-indigo-400 transition text-sm">Contact</Link></li>
            <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition text-sm">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="text-white font-semibold mb-6">Follow Us</h4>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center hover:border-indigo-500 transition group">
              <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
            <a href="#" className="w-10 h-10 bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center hover:border-indigo-500 transition group">
              <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </a>
            <a href="#" className="w-10 h-10 bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center hover:border-indigo-500 transition group">
              <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} NodeMatch. Built for developers by developers.
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-gray-500 hover:text-white transition text-sm">Terms</a>
          <a href="#" className="text-gray-500 hover:text-white transition text-sm">Privacy</a>
          <a href="#" className="text-gray-500 hover:text-white transition text-sm">Cookies</a>
        </div>
      </div>
    </footer>
  );
}
