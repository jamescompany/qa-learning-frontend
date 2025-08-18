import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import Loading from '../components/common/Loading';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  createdAt: string;
  likes: number;
  comments: number;
}

const PostListPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching posts
    setTimeout(() => {
      setPosts([
        {
          id: '1',
          title: 'Best Practices for API Testing',
          content: 'Learn the essential techniques for effective API testing...',
          author: 'James Kang',
          tags: ['API', 'Testing', 'Automation'],
          createdAt: '2024-01-15',
          likes: 24,
          comments: 5,
        },
        {
          id: '2',
          title: 'Introduction to Selenium WebDriver',
          content: 'A comprehensive guide to getting started with Selenium...',
          author: 'Sarah Kim',
          tags: ['Selenium', 'Automation', 'Tutorial'],
          createdAt: '2024-01-14',
          likes: 18,
          comments: 3,
        },
        {
          id: '3',
          title: 'Mobile App Testing Strategies',
          content: 'Explore different approaches to testing mobile applications...',
          author: 'Michael Park',
          tags: ['Mobile', 'Testing', 'Strategy'],
          createdAt: '2024-01-13',
          likes: 15,
          comments: 7,
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loading size="large" text="Loading posts..." />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">QA Learning Posts</h1>
          <Link
            to="/posts/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Post
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Tags Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                !selectedTag
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedTag === tag
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid gap-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No posts found</p>
            </div>
          ) : (
            filteredPosts.map(post => (
              <article key={post.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <Link
                      to={`/posts/${post.id}`}
                      className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {post.title}
                    </Link>
                    <span className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {post.content}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        By {post.author}
                      </span>
                      <div className="flex gap-2">
                        {post.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        ❤️ {post.likes}
                      </span>
                      <span className="flex items-center">
                        💬 {post.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PostListPage;