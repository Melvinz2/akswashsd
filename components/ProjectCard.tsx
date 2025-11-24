import React from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  const getDifficultyColor = (diff: string) => {
    switch(diff) {
      case 'Beginner': return 'text-green-400 border-green-400/30';
      case 'Intermediate': return 'text-yellow-400 border-yellow-400/30';
      case 'Advanced': return 'text-red-400 border-red-400/30';
      default: return 'text-gray-400 border-gray-400/30';
    }
  };

  return (
    <div 
      className="group relative bg-terminal-header border border-terminal-border p-6 rounded-lg hover:border-terminal-blue transition-all duration-300 cursor-pointer flex flex-col h-full"
      onClick={() => onSelect(project)}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-terminal-border to-transparent group-hover:via-terminal-blue transition-all duration-300"></div>
      
      <div className="flex justify-between items-start mb-4">
        <span className={`text-xs font-mono px-2 py-1 rounded border ${getDifficultyColor(project.difficulty)}`}>
          {project.difficulty.toUpperCase()}
        </span>
        <span className="text-xs text-gray-500 font-mono">{project.language}</span>
      </div>

      <h3 className="text-xl font-bold text-terminal-text mb-2 group-hover:text-terminal-blue">
        {project.title}
      </h3>
      
      <p className="text-gray-400 text-sm mb-6 flex-grow">
        {project.description}
      </p>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map(tag => (
                <span key={tag} className="text-xs text-terminal-blue bg-terminal-blue/10 px-2 py-1 rounded">#{tag}</span>
            ))}
        </div>
        
        <div className="w-full py-2 bg-terminal-bg border border-terminal-border text-center rounded text-sm font-mono text-gray-400 group-hover:bg-terminal-blue group-hover:text-terminal-bg transition-colors">
           View Details_
        </div>
      </div>
    </div>
  );
};
