import { useEffect, useState, StrictMode } from "react";
import ReactDOM from 'react-dom/client';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import Footer from '/CodeProjects/cep-gemini/src/components/Footer'
import {
  csi,
  evalES,
  openLinkInBrowser,
  subscribeBackgroundColor,
  evalTS,
} from "../lib/utils/bolt";
import "./main.scss";
import'./styles.css';

const fs = require('fs');
const path = require('path');
const os = require('os');

export function App() {
  const [prompt, setPrompt] = useState('Make this frame more cinematic and sad');
  const [geminiResponse, setGeminiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(''); 


  const handleAnalyze = async () => {
    
    setIsLoading(true);
    setGeminiResponse('');
    setError('');

    try{

      const tempFilePath = path.join(os.tmpdir(), 'AEAI_frame.png');

      const script = `
        var activeItem = app.project.activeItem;
        if (activeItem && activeItem instanceof CompItem) {
          var savePath = "${tempFilePath.replace(/\\/g, '/')}";
          activeItem.saveFrameToPng(activeItem.time, new File(savePath));
          savePath; // Return the path as the result
        } else {
          "No active composition"; // Return an error string
        }
      `;


      
      const result = await evalES(script);


      if (result === 'No active composition') {
        throw new Error('Please select a composition before analyzing.');
      }


      const imageBuffer = fs.readFileSync(tempFilePath);


      const formData = new FormData();

      formData.append(
        'image',
        new Blob([imageBuffer]),
        'AEAI_frame.png'
      );

      formData.append('prompt', prompt);


      const response = await fetch('http://127.0.0.1:5000/analyze-image',
        {method: 'POST', body: formData,}
      );



      if(!response.ok)
      {
        const errData = await response.json();
        throw new Error (errData.error || 'Error: ${response.statusText}');
      }


      const data = await response.json();
      setGeminiResponse(data.suggestions);
    }

    catch (err: any)
    {
      setError(err.message || 'an unknown error occurred.');
    }
    finally
    {
      setIsLoading(false);
    }

  };

return (
    <div className="bg-[#333333] text-gray-200 min-h-screen font-sans p-4">
      <div className="max-w-md mx-auto">
        <header className="mb-6 text-center">
          <h1 className="text-xl font-bold">AEAI Helper</h1>
          <p className="text-sm text-gray-400">suggestions for your shot!</p>
        </header>


        <div className="mb-4">
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-400 mb-2">
            Prompt:
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            rows={2}
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Frame'}
        </button>

        {error && (
          <div className="mt-4 bg-red-800 p-3 rounded-lg border border-red-700">
            <h2 className="text-lg font-semibold mb-1 text-red-100">error...</h2>
            <p className="font-mono text-red-200">{error}</p>
          </div>
        )}

        {geminiResponse && (
          <div className="mt-6 bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h2 className="text-lg font-semibold mb-2">Suggestions:</h2>
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                {geminiResponse}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

