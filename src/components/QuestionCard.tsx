
import type { Question } from '../data/quizQuestions';

interface QuestionCardProps {
  question: Question;
  selectedOption: string | null;
  onOptionSelect: (option: string) => void;
  isAnswered: boolean;
}

const QuestionCard = ({ question, selectedOption, onOptionSelect, isAnswered }: QuestionCardProps) => {
  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold md:text-2xl">{question.question_text}</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {question.options.map((option, index) => (
          <button
            key={index}
            disabled={isAnswered}
            onClick={() => onOptionSelect(option)}
            className={`
              rounded-lg border-2 p-4 text-left transition-all duration-300
              ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1 hover:shadow-md'}
              ${selectedOption === option ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}
            `}
          >
            <p>{option}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;