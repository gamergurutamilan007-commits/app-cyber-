import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Heart, MessageCircle, Send, Trash2, Shield, User, Loader2 } from 'lucide-react';
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

const Community = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data);
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Community <span className="text-neon-blue">Feed</span></h1>
        <p className="text-slate-400">Share knowledge, ask questions, and connect with fellow researchers.</p>
      </div>

      {/* Post Input */}
      {user ? (
        <Card className="mb-12 border-neon-blue/20 bg-dark-bg/40 backdrop-blur-xl">
          <form onSubmit={handleAddPost} className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-neon-blue/10 flex items-center justify-center border border-neon-blue/20">
                <User className="w-5 h-5 text-neon-blue" />
              </div>
              <span className="font-bold text-sm">{user.name}</span>
            </div>
            <input
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm font-bold focus:outline-none focus:border-neon-blue transition-colors"
              placeholder="Post Title"
            />
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neon-blue transition-colors h-32 resize-none"
              placeholder="What's on your mind, researcher?"
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Broadcast Post</>}
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <Card className="mb-12 text-center py-8 border-white/5">
          <p className="text-slate-400 text-sm">Please login to join the conversation.</p>
        </Card>
      )}

      {/* Feed */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-neon-blue animate-spin" />
          </div>
        ) : (
          <AnimatePresence>
            {posts.map((post) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
              >
                <Card className="hover:border-white/20 transition-all border-white/5 bg-dark-bg/20">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-neon-blue">
                        {post.author.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{post.author.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter">
                          {formatDistanceToNow(new Date(post.timestamp))} ago
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-3">{post.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">{post.content}</p>

                  <div className="flex items-center gap-6 border-t border-white/5 pt-4">
                    <button 
                      onClick={() => handleLike(post._id)}
                      disabled={!user}
                      className={cn(
                        "flex items-center gap-2 text-sm transition-colors group",
                        user && post.likes.includes(user.id) ? "text-rose-500" : "text-slate-400 hover:text-rose-500"
                      )}
                    >
                      <Heart className={cn("w-4 h-4", user && post.likes.includes(user.id) && "fill-rose-500")} />
                      <span>{post.likes.length}</span>
                    </button>
                    <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-neon-blue transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments.length} Comments</span>
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Community;
