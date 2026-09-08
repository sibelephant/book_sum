import React from 'react';

export default function QuizCard({ question, index, total, selected, onSelect, showResults = false }) {
  return (
    <div className="quiz-card">
      <div className="quiz-card-head">
        <span className="quiz-number">
          Question {index + 1} of {total}
        </span>
        <span className="quiz-points">1 point</span>
      </div>
      <h3 className="quiz-question">{question.question}</h3>
      <div className="quiz-options">
        {question.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = showResults && i === question.correctIndex;
          const isWrong = showResults && isSelected && !isCorrect;
          let cls = 'quiz-option';
          if (showResults) {
            if (isCorrect) cls += ' quiz-option-correct';
            else if (isWrong) cls += ' quiz-option-wrong';
            else cls += ' quiz-option-dim';
          } else if (isSelected) {
            cls += ' quiz-option-selected';
          }
          return (
            <button
              key={i}
              type="button"
              className={cls}
              onClick={() => onSelect(i)}
              disabled={showResults}
            >
              <span className="quiz-option-letter">{String.fromCharCode(65 + i)}</span>
              <span className="quiz-option-text">{opt}</span>
              {showResults && isCorrect && (
                <span className="quiz-option-mark" aria-hidden="true">✓</span>
              )}
              {showResults && isWrong && (
                <span className="quiz-option-mark" aria-hidden="true">×</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}