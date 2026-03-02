import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Heart, MessageCircle, Send, Trash2, Shield, User, Loader2, Clock } from 'lucide-react';
import { Button, Card, Badge, cn } from '../components/UI';
import { useAuth } from '../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { io } from 'socket.io-client';

interface Post {
  _id: string;
  author: { _id: string; name: string };
  title: string;
  content: string;
  likes: string[];
  comments: any[];
  timestamp: string;
}

const PostCard = ({ post, user, onLike, onComment }: { post: Post; user: any; onLike: (id: string) => void; onComment: (id: string, content: string) => void }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  return (
    <Card glow variant="cyan" className="hover:border-neon-cyan/30 transition-all border-white/5 bg-dark-surface/40 backdrop-blur-xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-1 h-12 bg-neon-cyan shadow-[0_0_10px_rgba(0,245,255,0.5)]" />
      
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-lg font-black text-neon-cyan shadow-[0_0_15px_rgba(0,245,255,0.1)] group-hover:scale-110 transition-transform relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
            {post.author?.name?.charAt(0) || '?'}
          </div>
          <div>
            <p className="text-sm font-black tracking-tight text-text-primary">{post.author.name}</p>
            <p className="text-[10px] text-text-secondary font-mono uppercase tracking-[0.2em] flex items-center gap-2">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(post.timestamp))} ago
            </p>
          </div>
        </div>
        <Badge variant="cyan" className="text-[8px] font-mono tracking-widest">BROADCAST_ID: {post._id.slice(-6).toUpperCase()}</Badge>
      </div>

      <h3 className="text-2xl font-black mb-4 tracking-tight group-hover:text-neon-cyan transition-colors">{post.title}</h3>
      <p className="text-text-secondary text-sm leading-relaxed mb-8 font-mono opacity-80">{post.content}</p>

      <div className="flex items-center gap-8 border-t border-white/5 pt-6">
        <button 
          onClick={() => onLike(post._id)}
          disabled={!user}
          className={cn(
            "flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all group/btn",
            user && post.likes.includes(user.id) ? "text-soft-red drop-shadow-[0_0_5px_rgba(255,77,77,0.5)]" : "text-text-secondary hover:text-soft-red"
          )}
        >
          <Heart className={cn("w-4 h-4 transition-transform group-hover/btn:scale-125", user && post.likes.includes(user.id) && "fill-soft-red")} />
          <span>{post.likes.length} UPLINKS</span>
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary hover:text-neon-cyan transition-all group/btn"
        >
          <MessageCircle className="w-4 h-4 transition-transform group-hover/btn:scale-125" />
          <span>{post.comments.length} COMMS</span>
        </button>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-8 space-y-6 pt-6 border-t border-white/5">
              {post.comments.map((comment, i) => (
                <div key={i} className="flex gap-4 group/comment">
                  <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black shrink-0 group-hover/comment:border-neon-cyan/30 transition-colors">
                    {comment.author?.name?.charAt(0) || '?'}
                  </div>
                  <div className="flex-grow bg-white/5 p-4 rounded-2xl border border-white/5 group-hover/comment:border-white/10 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black tracking-tight text-text-primary">{comment.author.name}</span>
                      <span className="text-[9px] text-text-secondary font-mono uppercase tracking-widest">{formatDistanceToNow(new Date(comment.timestamp))} ago</span>
                    </div>
                    <p className="text-xs text-text-secondary font-mono leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              ))}
              
              {user && (
                <div className="flex gap-4 pt-4">
                  <div className="w-8 h-8 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-[10px] font-black shrink-0 text-neon-cyan">
                    {user?.name?.charAt(0) || '?'}
                  </div>
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      onComment(post._id, commentInput);
                      setCommentInput('');
                    }}
                    className="flex-grow flex gap-3"
                  >
                    <input
                      type="text"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Input encrypted response..."
                      className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-mono focus:outline-none focus:border-neon-cyan focus:bg-neon-cyan/5 transition-all text-text-primary"
                    />
                    <button type="submit" className="p-2 bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20 rounded-xl transition-all border border-neon-cyan/20">
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

const Community = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    const socket = io();
    socket.on('new_post', (post: Post) => {
      setPosts(prev => [post, ...prev]);
    });

    socket.on('post_updated', (updatedPost: Post) => {
      setPosts(prev => prev.map(p => p._id === updatedPost._id ? { ...p, ...updatedPost } : p));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
      if (res.ok) {
        setNewPost({ title: '', content: '' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (id: string) => {
    if (!user) return;
    try {
      await fetch(`/api/posts/${id}/like`, { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId: string, content: string) => {
    if (!content.trim() || !user) return;
    try {
      await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-16">
        <Badge variant="cyan" className="mb-4">Neural Network</Badge>
        <h1 className="text-5xl font-black tracking-tighter mb-2">COMMUNITY <span className="text-neon-cyan drop-shadow-[0_0_10px_rgba(0,245,255,0.3)]">FEED</span></h1>
        <p className="text-text-secondary font-mono text-sm">&gt; Share intelligence, ask questions, and connect with fellow researchers.</p>
      </div>

      {/* Post Input */}
      {user ? (
        <Card glow variant="cyan" className="mb-16 border-neon-cyan/20 bg-dark-surface/40 backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/5 rounded-full blur-3xl -mr-16 -mt-16" />
          <form onSubmit={handleAddPost} className="space-y-6 relative z-10">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-neon-cyan/10 flex items-center justify-center border border-neon-cyan/30 shadow-[0_0_15px_rgba(0,245,255,0.1)]">
                <User className="w-6 h-6 text-neon-cyan" />
              </div>
              <div>
                <span className="text-sm font-black tracking-tight text-text-primary">{user.name}</span>
                <p className="text-[10px] text-neon-cyan font-mono uppercase tracking-widest">Authorized User</p>
              </div>
            </div>
            <input
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm font-black tracking-tight focus:outline-none focus:border-neon-cyan focus:bg-neon-cyan/5 transition-all text-text-primary"
              placeholder="INTEL DESIGNATION (TITLE)"
            />
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm font-mono focus:outline-none focus:border-neon-cyan focus:bg-neon-cyan/5 transition-all text-text-primary h-40 resize-none"
              placeholder="What intelligence do you wish to broadcast, researcher?"
            />
            <div className="flex justify-end">
              <Button type="submit" variant="cyan" disabled={isSubmitting} className="gap-3 uppercase tracking-[0.3em] text-xs py-3 px-8 shadow-[0_0_20px_rgba(0,245,255,0.2)]">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> BROADCAST INTEL</>}
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <Card className="mb-16 text-center py-12 border-white/5 glass-panel">
          <Shield className="w-12 h-12 text-text-secondary/20 mx-auto mb-4" />
          <p className="text-text-secondary font-mono text-sm uppercase tracking-widest">Authentication required to join the neural network.</p>
        </Card>
      )}

      {/* Feed */}
      <div className="space-y-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-12 h-12 border-4 border-neon-cyan/20 border-t-neon-cyan rounded-full animate-spin shadow-[0_0_15px_rgba(0,245,255,0.2)]" />
            <p className="text-neon-cyan font-mono text-xs animate-pulse">DECRYPTING FEED...</p>
          </div>
        ) : (
          <AnimatePresence>
            {posts.map((post) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
              >
                <PostCard 
                  post={post} 
                  user={user} 
                  onLike={handleLike} 
                  onComment={handleAddComment} 
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Community;
