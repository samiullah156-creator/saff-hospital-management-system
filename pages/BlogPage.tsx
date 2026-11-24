
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { BlogPost } from '../types';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const BlogPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  useScrollAnimation();

  const categories = ['All', 'Cardiology', 'General Health', 'Wellness', 'Pediatrics', 'Psychiatry', 'Neurology', 'Endocrinology', 'Dermatology', 'Dental Care'];

  useEffect(() => {
    const fetchPosts = async () => {
        const data = await dbService.getBlogPosts();
        setPosts(data);
        setLoading(false);
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
  });

  // Improved Image Fallback Handler - Replaces broken images with a high-quality medical placeholder
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800"; // Reliable Generic Medical Image
    e.currentTarget.onerror = null; // Prevent infinite loops
  };

  if (loading) return <div className="p-20 text-center text-teal-600 font-bold">Loading Blog...</div>;

  return (
    <div className="animate-fade-in bg-gray-50 min-h-screen">
      
      {/* Hero Section - Teal Gradient */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-900 relative py-20 overflow-hidden">
         <div className="absolute inset-0">
            <img 
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=100&w=2560" 
                className="w-full h-full object-cover opacity-50" 
                alt="Blog Background" 
                onError={handleImageError}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 to-teal-800/80"></div>
         </div>
         <div className="text-center relative z-10 px-4 max-w-4xl mx-auto">
            <span className="text-teal-300 font-bold uppercase tracking-widest text-sm mb-2 block animate-fade-in-up">Health & Insights</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-white animate-fade-in-up delay-100">Saff Hospital Blog</h1>
            <p className="text-lg text-teal-100 mb-8 animate-fade-in-up delay-200 leading-relaxed">
              Stay informed with the latest medical news, health tips, and hospital updates directly from our expert doctors.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative animate-fade-in-up delay-300">
               <input 
                 type="text" 
                 placeholder="Search articles..." 
                 className="w-full py-4 px-6 rounded-full text-gray-800 focus:outline-none focus:ring-4 focus:ring-teal-500/50 shadow-2xl transition bg-white/95 backdrop-blur"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
               <div className="absolute right-3 top-2.5 bg-teal-600 p-2 rounded-full text-white cursor-pointer hover:bg-teal-700 transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
               </div>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
         
         {/* Category Filter */}
         <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in-up delay-300">
            {categories.map(cat => (
               <button
                 key={cat}
                 onClick={() => setActiveCategory(cat)}
                 className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 border ${
                   activeCategory === cat 
                   ? 'bg-teal-600 text-white border-teal-600 shadow-lg transform scale-105' 
                   : 'bg-white text-gray-600 border-gray-200 hover:border-teal-400 hover:text-teal-600 hover:shadow-sm'
                 }`}
               >
                 {cat}
               </button>
            ))}
         </div>

         {/* Blog Grid */}
         {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post, index) => (
                <div key={post.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group flex flex-col border border-gray-100 h-full reveal-on-scroll hover:-translate-y-2 transform" style={{animationDelay: `${Math.min(index * 50, 1000)}ms`}}>
                    <div className="relative aspect-[16/9] overflow-hidden">
                        <img 
                            src={post.image} 
                            alt={post.title} 
                            className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-out" 
                            loading="lazy" 
                            onError={handleImageError}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition duration-500"></div>
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-teal-700 shadow-md border border-white/50">
                            {post.category}
                        </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow relative">
                        <div className="flex justify-between items-center text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">
                            <span className="flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            {post.date}
                            </span>
                            <span className="flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            {post.readTime}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif group-hover:text-teal-600 transition leading-tight">{post.title}</h3>
                        <p className="text-gray-600 text-sm mb-6 leading-relaxed flex-grow line-clamp-3">{post.excerpt}</p>
                        
                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                            <span className="text-xs font-bold text-gray-500 uppercase flex items-center"><span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2 text-[10px]">{post.author.charAt(0)}</span>{post.author}</span>
                            <Link to={`/blog/${post.id}`} className="text-teal-600 font-bold text-xs uppercase tracking-wider hover:underline flex items-center group/link">
                            Read Full Article 
                            <svg className="w-4 h-4 ml-1 transform group-hover/link:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                            </Link>
                        </div>
                    </div>
                </div>
                ))}
            </div>
         ) : (
             <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 reveal-on-scroll">
                 <div className="text-6xl mb-4">📄</div>
                 <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
                 <button onClick={() => { setSearchQuery(''); setActiveCategory('All'); }} className="mt-4 text-teal-600 font-bold hover:underline">Clear Filters</button>
             </div>
         )}

         {/* Newsletter Signup */}
         <div className="mt-20 bg-teal-50 rounded-[2.5rem] p-8 md:p-12 text-center border border-teal-100 relative overflow-hidden shadow-lg reveal-on-scroll">
            <div className="absolute top-0 right-0 w-40 h-40 bg-teal-200 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-200 rounded-full blur-3xl opacity-50"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
               <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">Subscribe to Our Newsletter</h2>
               <p className="text-gray-600 mb-8">Get the latest health tips, hospital news, and wellness advice delivered straight to your inbox.</p>
               <form className="flex flex-col sm:flex-row gap-3">
                  <input type="email" placeholder="Enter your email address" className="flex-1 px-5 py-4 rounded-xl border border-gray-300 focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 focus:outline-none bg-white transition shadow-sm text-gray-800" />
                  <button type="submit" className="bg-teal-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-teal-700 transition shadow-lg transform hover:-translate-y-0.5">Subscribe</button>
               </form>
            </div>
         </div>
      </div>
    </div>
  );
};

export default BlogPage;
