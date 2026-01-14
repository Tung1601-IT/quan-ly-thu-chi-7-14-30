import React from 'react';

const BackArrowIcon: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button 
    onClick={onClick} 
    className="absolute top-6 left-6 text-gray-500 hover:text-gray-900 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
    aria-label="Quay lại"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  </button>
);

const challenges = [
  {
    duration: '7 NGÀY',
    description: 'Làm quen quản lý chi tiêu',
  },
  {
    duration: '14 NGÀY',
    description: 'Duy trì chi tiêu hợp lý',
  },
  {
    duration: '30 NGÀY',
    description: 'Hình thành thói quen tiết kiệm',
  },
];

interface ChallengeSelectScreenProps {
  onBack: () => void;
  onChallengeSelect: (duration: string) => void;
}

const ChallengeSelectScreen: React.FC<ChallengeSelectScreenProps> = ({ onBack, onChallengeSelect }) => {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-md relative">
        <BackArrowIcon onClick={onBack} />
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Chọn thử thách</h1>
        </div>

        <div className="space-y-4">
          {challenges.map((challenge, index) => (
            <button
              key={index}
              onClick={() => onChallengeSelect(challenge.duration)}
              className="w-full text-left p-5 border border-gray-200 rounded-xl hover:bg-green-50 hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 ease-in-out transform hover:-translate-y-1"
              aria-label={`Chọn thử thách ${challenge.duration}, ${challenge.description}`}
            >
              <p className="font-bold text-green-600 text-lg">{challenge.duration}</p>
              <p className="text-gray-600 mt-1">{challenge.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChallengeSelectScreen;
