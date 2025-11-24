
import React, { useState } from 'react';
import { TerminalInput } from './TerminalInput';
import { addProject } from '../services/projectService';

interface AdminDashboardProps {
  onBack: () => void;
  onProjectAdded: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack, onProjectAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [tags, setTags] = useState('');
  const [fileStructure, setFileStructure] = useState('src/\n  index.js');
  const [zipFile, setZipFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setZipFile(e.target.files[0]);
    }
  };

  const handleDeploy = async () => {
    if (!title || !description || !language || !zipFile) {
      setStatus('Error: Missing required fields (Title, Desc, Lang, File).');
      return;
    }

    setLoading(true);
    setStatus('Deploying package to local registry...');

    try {
      // Create project object
      await addProject({
        title,
        description,
        language,
        difficulty,
        tags: tags.split(',').map(t => t.trim()).filter(t => t.length > 0),
        fileStructure,
        // Important: We use the real filename. The admin must manually place this file in public/downloads
        zipFileName: zipFile.name 
      });

      setStatus(`Success: Project deployed! Please ensure '${zipFile.name}' is placed in the public/downloads folder.`);
      setTimeout(() => {
        onProjectAdded();
        onBack();
      }, 2000);

    } catch (e) {
      setStatus('Error: Deployment failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-3xl font-bold text-red-500 font-mono">>> ADMIN DEPLOYMENT CONSOLE</h2>
        <button onClick={onBack} className="text-gray-400 hover:text-white underline font-mono text-sm">
          [ Exit Admin Mode ]
        </button>
      </div>

      <div className="bg-terminal-header border border-red-900/50 p-6 rounded-lg shadow-lg">
        <div className="mb-4 p-3 bg-red-900/10 border-l-4 border-red-500 text-gray-300 text-sm">
          <strong>SYSTEM NOTICE:</strong> Since this is a simulated environment, uploading a file here registers it in the database. 
          <br/>You must manually move the actual <code>.zip</code> file to the <code>public/downloads</code> folder of the project.
        </div>

        <div className="space-y-4">
          <TerminalInput label="Project Title:" value={title} onChange={setTitle} placeholder="e.g. Next.js Dashboard" />
          
          <div className="flex flex-col md:flex-row gap-4">
             <div className="flex-1">
                <TerminalInput label="Language:" value={language} onChange={setLanguage} placeholder="e.g. TypeScript" />
             </div>
             <div className="flex-1 flex items-center my-2 font-mono text-sm">
                <span className="text-terminal-green mr-2">Difficulty:</span>
                <select 
                    value={difficulty} 
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="flex-1 bg-terminal-bg text-terminal-text border border-terminal-border rounded p-1 outline-none focus:border-red-500"
                >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                </select>
             </div>
          </div>

          <div>
            <label className="block text-terminal-green font-mono text-sm mb-1">Description:</label>
            <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-terminal-bg border border-terminal-border text-terminal-text p-2 rounded font-mono text-sm focus:border-red-500 outline-none h-24"
                placeholder="Describe the project..."
            />
          </div>

          <TerminalInput label="Tags (comma sep):" value={tags} onChange={setTags} placeholder="react, tailwind, api" />

          <div>
            <label className="block text-terminal-green font-mono text-sm mb-1">File Structure (for AI):</label>
            <textarea 
                value={fileStructure} 
                onChange={(e) => setFileStructure(e.target.value)}
                className="w-full bg-terminal-bg border border-terminal-border text-gray-400 p-2 rounded font-mono text-xs focus:border-red-500 outline-none h-32"
                spellCheck={false}
            />
          </div>

          <div className="border-t border-terminal-border pt-4 mt-4">
             <label className="block text-red-400 font-mono text-sm mb-2">Upload Source Code (.zip)</label>
             <input 
                type="file" 
                accept=".zip"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-red-900/20 file:text-red-400
                  hover:file:bg-red-900/40
                  cursor-pointer
                "
             />
          </div>
        
          <div className="pt-6">
            {status && <div className={`mb-4 font-mono text-sm ${status.includes('Error') ? 'text-red-500' : 'text-green-400'}`}>{status}</div>}
            
            <button
                onClick={handleDeploy}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded transition-colors font-mono flex justify-center items-center"
            >
                {loading ? (
                    <span className="animate-pulse">DEPLOYING ARTIFACTS...</span>
                ) : (
                    <span>$ DEPLOY PROJECT</span>
                )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
