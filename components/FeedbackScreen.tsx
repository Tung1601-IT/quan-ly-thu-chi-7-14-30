import React, { useState } from 'react';

interface FeedbackScreenProps {
  onSubmit: () => void;
  onBack: () => void;
}

const StarIcon: React.FC<{ filled: boolean; onClick: () => void; onMouseEnter: () => void; onMouseLeave: () => void; }> = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
  <svg
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    className={`w-10 h-10 cursor-pointer transition-colors duration-200 ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const FeedbackScreen: React.FC<FeedbackScreenProps> = ({ onSubmit, onBack }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Rating: ${rating}, Feedback: ${feedbackText}`);
    onSubmit();
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-md">
        <header className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Phản hồi người dùng</h1>
        </header>
        <form onSubmit={handleFeedbackSubmit}>
          <div className="mb-6 text-center">
            <p className="text-lg text-gray-700 mb-4">Bạn cảm thấy ứng dụng như thế nào?</p>
            <div className="flex justify-center" onMouseLeave={() => setHoverRating(0)}>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  filled={(hoverRating || rating) >= star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => {}}
                />
              ))}
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
              Ý kiến của bạn
            </label>
            <textarea
              id="feedback"
              name="feedback"
              rows={4}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
              placeholder="Nhập phản hồi..."
            />
          </div>
          <div className="space-y-4">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300"
            >
              Gửi phản hồi
            </button>
            <button
              type="button"
              onClick={onBack}
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-lg font-bold text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors duration-300"
            >
              Quay về Bảng điều khiển
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackScreen;