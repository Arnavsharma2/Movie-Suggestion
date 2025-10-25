'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface QuestionStepProps {
  step: {
    id: string;
    title: string;
    question: string;
    type: 'multiple' | 'single' | 'rating';
    options: string[];
    required: boolean;
  };
  value: string | string[];
  onChange: (value: string | string[]) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function QuestionStep({
  step,
  value,
  onChange,
  onNext,
  onPrevious,
  isFirst,
  isLast
}: QuestionStepProps) {
  const [localValue, setLocalValue] = useState<string | string[]>(value);

  const handleOptionClick = (option: string) => {
    if (step.type === 'multiple') {
      const currentValues = Array.isArray(localValue) ? localValue : [];
      const newValues = currentValues.includes(option)
        ? currentValues.filter(v => v !== option)
        : [...currentValues, option];
      setLocalValue(newValues);
      onChange(newValues);
    } else {
      setLocalValue(option);
      onChange(option);
    }
  };

  const handleNext = () => {
    if (step.required && (!localValue || (Array.isArray(localValue) && localValue.length === 0))) {
      return;
    }
    onNext();
  };

  const isSelected = (option: string) => {
    if (step.type === 'multiple') {
      return Array.isArray(localValue) && localValue.includes(option);
    }
    return localValue === option;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-dark-50 mb-4">{step.title}</h2>
          <p className="text-lg text-dark-300">{step.question}</p>
        </div>

        <div className="space-y-3 mb-8">
          {step.options.map((option) => (
            <button
              key={option}
              onClick={() => handleOptionClick(option)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                isSelected(option)
                  ? 'border-primary-500 bg-primary-500/20 text-primary-300'
                  : 'border-dark-600 hover:border-dark-500 hover:bg-dark-700/50 text-dark-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{option}</span>
                {step.type === 'multiple' && isSelected(option) && (
                  <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-dark-900 text-sm">✓</span>
                  </div>
                )}
                {step.type === 'single' && isSelected(option) && (
                  <div className="w-5 h-5 border-2 border-primary-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={onPrevious}
            disabled={isFirst}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              isFirst
                ? 'text-dark-500 cursor-not-allowed'
                : 'text-dark-300 hover:text-dark-100 hover:bg-dark-700/50'
            }`}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={step.required && (!localValue || (Array.isArray(localValue) && localValue.length === 0))}
            className={`flex items-center px-6 py-2 rounded-lg transition-colors ${
              step.required && (!localValue || (Array.isArray(localValue) && localValue.length === 0))
                ? 'bg-dark-600 text-dark-400 cursor-not-allowed'
                : 'bg-primary-500 text-dark-900 hover:bg-primary-400'
            }`}
          >
            {isLast ? 'Get Recommendations' : 'Next'}
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
