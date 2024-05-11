import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Import your Tailwind CSS file for global styles

const AnimatedCover = () => {
  const [animationFinished, setAnimationFinished] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const animationTimeout = setTimeout(() => {
      setAnimationFinished(true);
      navigate('/dashboard'); // Redirect to "/dashboard" after 5 seconds
    }, 5000); // 5 seconds timeout

    return () => clearTimeout(animationTimeout);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="animation-container">
        {!animationFinished ? (
          <div className="w-16 h-16 border-4 border-t-4 border-gray-200 rounded-full animate-spin"></div>
        ) : (
          // Your placeholder animation component when animation is finished
          <div className="w-40 h-40 bg-blue-500 rounded-full"></div>
        )}
      </div>
      {animationFinished && (
        <div className="text-center">
          {/* Your cover page content goes here */}
          <h1 className="text-4xl font-bold">Welcome to Splitwise</h1>
          <p className="text-lg">The easiest way to split bills with friends.</p>
          {/* Additional content */}
        </div>
      )}
    </div>
  );
};

export default AnimatedCover;
