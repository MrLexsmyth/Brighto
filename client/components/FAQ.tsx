'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
 {
    question: "What services does BrightO Realty offer?",
    answer: `BrightO is a real estate agency that offers its clients the best real estate deals, minimising risks and maximising return on investment.

BrightO specialises in uncovering high-value, fast-growing real estate opportunities across Lagos and beyond.

From residential, commercial, industrial, or prime land investments, we provide the insights, expertise, and hands-on support to help you make confident decisions—every step of the way.`
  },
  {
    question: "What is the most trusted real estate agency in Nigeria?",
    answer: "BrightO is widely recognized as one of the most trusted real estate agencies in Nigeria. With years of experience and a strong reputation for integrity and professionalism, we are known for delivering exceptional service and results to our clients."
  },
  {
    question: "What are the functions of a real estate agency?",
    answer: "A real estate agency guides you through buying, selling, or renting properties. They simplify your real estate journey, from finding your dream home to undergoing the necessary due diligence and ensuring smooth transactions and a seamless closing."
  },
  {
    question: "Which website is best for selling property in Nigeria?",
    answer: "BrightO is one of the most trusted and widely used real estate websites in Nigeria. It offers a comprehensive platform for property listings, with features like property search, virtual tours, and expert guidance."
  },
  {
    question: "What is the fastest-growing real estate company in Nigeria?",
    answer: "BrightO is recognized as one of the fastest-growing real estate companies in Nigeria. Our rapid expansion is driven by our commitment to quality service, innovative solutions, and a deep understanding of the Nigerian real estate market."
  }
];

interface FAQAccordionProps {
  item: FAQItem;
  isOpen: boolean;
  onClick: () => void;
}

function FAQAccordion({ item, isOpen, onClick }: FAQAccordionProps) {
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-8 px-8 text-left hover:bg-gray-50 transition-colors duration-200 group"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-gray-900 pr-8 group-hover:text-[#004274] transition-colors">
          {item.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-300 group-hover:text-[#004274] ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
       <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-5 text-gray-600 leading-relaxed mt-2">
          {item.answer.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className={idx > 0 ? 'mt-4' : ''}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FAQComponent() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-4xl font-semibold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
           Get answers to some common questions about real estate.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {faqData.map((item, index) => (
            <FAQAccordion
              key={index}
              item={item}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
        </div>

       
        
      </div>
    </section>
  );
}