import React from 'react';
import { Link } from 'react-router-dom';

const HomePageEn: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to QA Learning App
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Master your testing skills and practice QA scenarios
          </p>
          
          <div className="space-x-4">
            <Link
              to="/login"
              className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3">Real-world Scenarios</h3>
            <p className="text-gray-600">
              Practice with real application scenarios including e-commerce, banking, and social media
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3">Interactive Learning</h3>
            <p className="text-gray-600">
              Gain hands-on experience with various UI components and features
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3">Comprehensive Testing</h3>
            <p className="text-gray-600">
              Learn functional, usability, accessibility, and performance testing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageEn;