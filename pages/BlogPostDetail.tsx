
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { BlogPost, Comment } from '../types';

const BlogPostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Comment State
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      if (id) {
        const foundPost = await dbService.getBlogPostById(Number(id));
        if (foundPost) {
           setPost(foundPost);
           // Fetch Related
           const related = await dbService.getRelatedPosts(foundPost.category, foundPost.id);
           setRelatedPosts(related);
           
           // Load Comments from LocalStorage
           const savedComments = localStorage.getItem(`saff_blog_comments_${id}`);
           if (savedComments) {
               try {
                   setComments(JSON.parse(savedComments));
               } catch (e) {
                   console.error("Failed to parse comments", e);
                   setComments([]);
               }
           } else {
               setComments([]);
           }
        }
      }
      setLoading(false);
    };
    fetchPost();
    // Scroll to top when changing posts
    window.scrollTo(0,0);
  }, [id]);

  const handleShare = async () => {
      const shareData = {
          title: post?.title,
          text: post?.excerpt,
          url: window.location.href,
      };
      
      try {
          if (navigator.share) {
              await navigator.share(shareData);
          } else {
              await navigator.clipboard.writeText(window.location.href);
              alert("Link copied to clipboard!");
          }
      } catch (err) {
          console.log("Share failed:", err);
      }
  };

  const submitComment = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newComment.trim() || !userName.trim()) return;
      
      const comment: Comment = {
          id: Math.random().toString(36).substr(2, 9),
          user: userName,
          text: newComment,
          date: new Date().toLocaleDateString()
      };
      
      const updatedComments = [...comments, comment];
      setComments(updatedComments);
      setNewComment('');
      
      // Save to LS
      if (id) localStorage.setItem(`saff_blog_comments_${id}`, JSON.stringify(updatedComments));
  };

  // Helper to parse Markdown-style formatting (Bold **, Italic *, Lists *)
  const parseFormatting = (text: string) => {
    // Split by bold **
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
      }
      
      // Check for italic * inside the non-bold parts
      const subParts = part.split(/(\*.*?\*)/g);
      if (subParts.length > 1) {
          return subParts.map((sp, j) => {
              // Ensure it's not just a single * or empty
              if (sp.startsWith('*') && sp.endsWith('*') && sp.length > 2) {
                  return <em key={`${i}-${j}`} className="italic text-gray-600">{sp.slice(1, -1)}</em>;
              }
              return sp;
          });
      }
      return part;
    });
  };

  const renderContent = (content: string) => {
    return content.split('\n').map((line, idx) => {
        const trimmed = line.trim();
        
        // Headers ###
        if (trimmed.startsWith('###')) {
            return <h3 key={idx} className="text-2xl font-serif font-bold text-gray-900 mt-8 mb-4">{trimmed.replace(/^###\s*/, '')}</h3>;
        }
        
        // List items * or -
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            return (
                <div key={idx} className="flex items-start mb-3 ml-4">
                    <span className="text-hospital-600 mr-3 mt-1.5">•</span>
                    <span className="text-gray-700 leading-relaxed">{parseFormatting(trimmed.substring(2))}</span>
                </div>
            );
        }

        // Empty lines
        if (trimmed === '') return <div key={idx} className="h-2"></div>;

        // Regular paragraphs
        return <p key={idx} className="text-gray-700 text-lg leading-relaxed mb-4">{parseFormatting(line)}</p>;
    });
  };

  if (loading) return <div className="p-20 text-center text-hospital-600 font-bold">Loading Article...</div>;
  if (!post) return <div className="p-20 text-center">Article not found. <Link to="/blog" className="text-hospital-600 underline">Back to Blog</Link></div>;

  return (
    <div className="bg-gray-50 min-h-screen animate-fade-in pb-20">
       
       {/* Hero Image */}
       <div className="h-[40vh] md:h-[50vh] relative overflow-hidden">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white max-w-5xl mx-auto">
             <span className="bg-hospital-600 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-3 inline-block">{post.category}</span>
             <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">{post.title}</h1>
             <div className="flex items-center space-x-6 text-sm md:text-base font-medium">
                <span>By {post.author}</span>
                <span>•</span>
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.readTime}</span>
             </div>
          </div>
       </div>

       <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
             
             {/* Article Content */}
             <div className="mb-12">
                <div className="font-bold text-xl text-gray-900 mb-8 border-l-4 border-hospital-500 pl-6 py-2 italic bg-gray-50 rounded-r-lg shadow-sm">
                    {post.excerpt}
                </div>
                {post.content ? renderContent(post.content) : <p className="text-gray-500">Content loading...</p>}
             </div>

             {/* Share Section */}
             <div className="border-t border-b border-gray-100 py-6 flex justify-between items-center mb-12">
                <span className="font-bold text-gray-900">Share this article:</span>
                <div className="flex space-x-2">
                   <button onClick={handleShare} className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></button>
                   <button onClick={handleShare} className="bg-blue-800 text-white p-2 rounded-full hover:bg-blue-900 transition"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></button>
                   <button onClick={handleShare} className="bg-gray-200 text-gray-600 p-2 rounded-full hover:bg-gray-300 transition"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg></button>
                </div>
             </div>

             {/* Comments Section */}
             <div className="mb-16">
                 <h3 className="text-2xl font-serif font-bold mb-6 text-gray-900 border-b border-gray-100 pb-4">
                    Comments <span className="text-hospital-600 text-lg">({comments.length})</span>
                 </h3>
                 
                 {/* Comments List */}
                 <div className="space-y-6 mb-10">
                     {comments.length > 0 ? comments.map(c => (
                         <div key={c.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-md transition">
                             <div className="flex justify-between items-center mb-3">
                                 <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-full bg-hospital-100 text-hospital-700 flex items-center justify-center font-bold text-sm">
                                         {c.user.charAt(0).toUpperCase()}
                                     </div>
                                     <span className="font-bold text-gray-900">{c.user}</span>
                                 </div>
                                 <span className="text-xs text-gray-500 font-medium bg-white px-2 py-1 rounded border border-gray-200">{c.date}</span>
                             </div>
                             <p className="text-gray-700 leading-relaxed text-sm ml-11">{c.text}</p>
                         </div>
                     )) : (
                         <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                             <p className="text-gray-500 italic">No comments yet. Be the first to share your thoughts!</p>
                         </div>
                     )}
                 </div>

                 {/* Comment Form */}
                 <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-lg relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-hospital-50 rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>
                     <h4 className="font-bold text-xl mb-6 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-hospital-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                        Leave a Reply
                     </h4>
                     <form onSubmit={submitComment}>
                         <div className="mb-5">
                             <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Your Name</label>
                             <input 
                               type="text" 
                               placeholder="Enter your name" 
                               required
                               className="w-full border border-gray-300 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-hospital-500 focus:border-transparent transition bg-gray-50 focus:bg-white"
                               value={userName}
                               onChange={(e) => setUserName(e.target.value)}
                             />
                         </div>
                         <div className="mb-6">
                             <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Your Comment</label>
                             <textarea 
                               placeholder="Write your thoughts here..." 
                               required
                               rows={4}
                               className="w-full border border-gray-300 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-hospital-500 focus:border-transparent transition bg-gray-50 focus:bg-white resize-none"
                               value={newComment}
                               onChange={(e) => setNewComment(e.target.value)}
                             ></textarea>
                         </div>
                         <button 
                            type="submit" 
                            className="w-full sm:w-auto bg-hospital-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-hospital-700 transition shadow-lg shadow-hospital-500/30 transform hover:-translate-y-0.5"
                         >
                            Post Comment
                         </button>
                     </form>
                 </div>
             </div>

             {/* Related Posts */}
             <div>
                <h3 className="text-2xl font-serif font-bold mb-8 text-gray-900 border-l-4 border-hospital-600 pl-4">Related Articles</h3>
                <div className="grid md:grid-cols-3 gap-8">
                    {relatedPosts.map(rp => (
                        <Link to={`/blog/${rp.id}`} key={rp.id} className="group block h-full">
                            <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
                                <div className="h-40 overflow-hidden relative">
                                    <img src={rp.image} alt={rp.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-xs font-bold text-hospital-700 shadow-sm">{rp.category}</div>
                                </div>
                                <div className="p-4 flex flex-col flex-grow">
                                    <h4 className="font-bold text-gray-900 group-hover:text-hospital-600 transition line-clamp-2 mb-2 text-lg">{rp.title}</h4>
                                    <p className="text-xs text-gray-500 mt-auto flex items-center">
                                        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                        {rp.date}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                    {relatedPosts.length === 0 && <p className="text-gray-500 italic col-span-3 text-center py-8">No related posts found.</p>}
                </div>
             </div>

          </div>
       </div>
    </div>
  );
};

export default BlogPostDetail;
