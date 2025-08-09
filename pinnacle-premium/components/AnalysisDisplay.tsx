import React from 'react';

interface AnalysisDisplayProps {
  analysis: string;
  assetSymbol: string;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis, assetSymbol }) => {
  const sections = analysis.split('### ').filter(s => s.trim() !== '');

  return (
    <div className="mt-6 p-6 bg-gray-50/80 backdrop-blur-sm border border-gray-200/50 rounded-xl space-y-6">
      <h3 className="text-xl font-bold text-gray-800">Analysis for {assetSymbol}</h3>
      {sections.map((section, index) => {
        const [title, ...contentLines] = section.split('\n');
        const content = contentLines.join('\n').trim().replace(/^- /gm, '• ');
        return (
          <div key={index}>
            <h4 className="text-lg font-semibold mb-2 text-indigo-700">{title}</h4>
            <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
          </div>
        );
      })}
    </div>
  );
};

export default AnalysisDisplay;