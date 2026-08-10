import React, { useState } from 'react';
import { SparklesIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

interface StoryBuilderProps {
  onApply: (story: string) => void;
}

type StyleType = 'romantic' | 'short' | 'funny';

const StoryBuilder: React.FC<StoryBuilderProps> = ({ onApply }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [style, setStyle] = useState<StyleType>('romantic');
  
  const [inputs, setInputs] = useState({
    location: '',
    year: '',
    yearsTogether: '',
    proposer: '',
    proposalLocation: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const getStoryPreview = () => {
    const loc = inputs.location || '[Location]';
    const yr = inputs.year || '[Year]';
    const yrs = inputs.yearsTogether || '[Number]';
    const prop = inputs.proposer || '[Partner 1]';
    const propLoc = inputs.proposalLocation || '[Proposal Location]';

    switch (style) {
      case 'romantic':
        return `We first crossed paths at ${loc} in ${yr}, and it was truly love at first sight. Over the past ${yrs} years, we've built a beautiful life together filled with incredible memories. Recently, ${prop} got down on one knee at ${propLoc} and asked the easiest question I've ever answered. We are so excited to celebrate the start of our forever with all of you!`;
      case 'short':
        return `From ${loc} to forever! We've been inseparable since ${yr} and can't wait to finally tie the knot. ${prop} popped the question at ${propLoc}, and it was absolutely perfect. Thank you for being a part of our special day.`;
      case 'funny':
        return `We met at ${loc} back in ${yr} and somehow haven't gotten sick of each other yet! After ${yrs} years of stealing the covers, ${prop} finally asked the big question at ${propLoc}. Now it's time to party!`;
      default:
        return '';
    }
  };

  const handleApply = () => {
    onApply(getStoryPreview());
    setIsOpen(false);
  };

  return (
    <div className="mb-4 border border-[#E8DCC4] rounded-lg overflow-hidden bg-[#FFFBF7]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-[#FDF6E3] transition-colors"
      >
        <span className="flex items-center text-[#B8860B] font-medium">
          <SparklesIcon className="w-5 h-5 mr-2" />
          ✨ Help me write my story
        </span>
        {isOpen ? (
          <ChevronUpIcon className="w-5 h-5 text-[#B8860B]" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-[#B8860B]" />
        )}
      </button>

      {isOpen && (
        <div className="p-4 border-t border-[#E8DCC4] space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select a Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as StyleType)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B] sm:text-sm"
            >
              <option value="romantic">Romantic & Sweet</option>
              <option value="short">Short & Simple</option>
              <option value="funny">Funny & Lighthearted</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500">Where did you meet?</label>
              <input
                type="text"
                name="location"
                placeholder="e.g. a coffee shop, college"
                value={inputs.location}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B] sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">What year did you meet?</label>
              <input
                type="text"
                name="year"
                placeholder="e.g. 2018"
                value={inputs.year}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B] sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Years together?</label>
              <input
                type="text"
                name="yearsTogether"
                placeholder="e.g. 5"
                value={inputs.yearsTogether}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B] sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Who proposed?</label>
              <input
                type="text"
                name="proposer"
                placeholder="e.g. Chinedu"
                value={inputs.proposer}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B] sm:text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500">Where was the proposal?</label>
              <input
                type="text"
                name="proposalLocation"
                placeholder="e.g. our favorite restaurant, Paris"
                value={inputs.proposalLocation}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B8860B] focus:ring-[#B8860B] sm:text-sm"
              />
            </div>
          </div>

          <div className="mt-4 bg-white p-4 rounded-md border border-gray-200 shadow-inner">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Preview</h4>
            <p className="text-sm text-gray-800 italic leading-relaxed">
              "{getStoryPreview()}"
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleApply}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#B8860B] hover:bg-[#8B6508] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B8860B]"
            >
              Apply Story
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryBuilder;
