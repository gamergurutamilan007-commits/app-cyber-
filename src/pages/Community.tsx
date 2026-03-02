import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Heart, MessageCircle, Send, Trash2, Shield, User } from 'lucide-react';
import { Button, Card, Badge, cn } from '../components/UI';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Post } from '../types';
import { formatDistanceToNow } from 'date-fns';

const Community = () => {
  const [posts, setPosts] = useLocalStorage<Post[]>('cyber_posts', [
    {
      id: '1',
      author: 'Neural Expert',
      title: 'How to secure LLM endpoints against prompt injection?',
      content: 'I have been working on a new middleware that uses another small LLM to sanitize inputs. What do you guys think?',
      likes: 24,
      comments: [],
      timestamp: Date.now() - 3600000 * 2
    },
    {
      id: '2',
      author: 'Cipher Master',
      title: 'Zero-Day CTF Writeup: AI Challenge',
      content: 'Just finished writing the solution for the AI-guarded vault challenge. Check out my GitHub for the full exploit script.',
      likes: 42,
      comments: [],
      timestamp: Date.now() - 3600000 * 5
    }
  ]);

  const [newPost, setNewPost] = useState({ title: '', content: '' });

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;

    const post: Post = {
      id: Date.now().toString(),
      author: 'Cyber Cadet',
      title: newPost.title,
      content: newPost.content,
      likes: 0,
      comments: [],
      timestamp: Date.now()
    };

    setPosts([post, ...posts]);
    setNewPost({ title: '', content: '' });
  };

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  const handleLike = (id: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Community <span className="text-neon-blue">Feed</span></h1>
        <p className="text-slate-400">Share knowledge, ask questions, and connect with fellow researchers.</p>
      </div>

      {/* Post Input */}
      <Card className="mb-12 border-neon-blue/20">
        <form onSubmit={handleAddPost} className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-neon-blue/10 flex items-center justify-center">
              <User className="w-5 h-5 text-neon-blue" />
            </div>
            <span className="font-bold text-sm">Cyber Cadet</span>
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
            <Button type="submit" className="gap-2">
              <Send className="w-4 h-4" /> Broadcast Post
            </Button>
          </div>
        </form>
      </Card>

      {/* Feed */}
      <div className="space-y-6">
        <AnimatePresence>
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              layout
            >
              <Card className="hover:border-white/20 transition-all border-white/5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold">
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{post.author}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{formatDistanceToNow(post.timestamp)} ago</p>
                    </div>
                  </div>
                  {post.author === 'Cyber Cadet' && (
                    <button 
                      onClick={() => handleDeletePost(post.id)}
                      className="p-2 text-slate-500 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-3">{post.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">{post.content}</p>

                <div className="flex items-center gap-6 border-t border-white/5 pt-4">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-rose-500 transition-colors group"
                  >
                    <Heart className={cn("w-4 h-4", post.likes > 0 && "fill-rose-500 text-rose-500")} />
                    <span>{post.likes}</span>
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
      </div>
    </div>
  );
};

export default Community;
