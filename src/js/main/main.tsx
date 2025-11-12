import { useEffect, useState, StrictMode } from "react";
import ReactDOM from 'react-dom/client';
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


function delay(ms: number)
{
  return new Promise(resolve=> setTimeout(resolve, ms));
}

const fs = require('fs');
const path = require('path');
const os = require('os');

console.log("1. starting analysis...")

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
      const safePath = tempFilePath.replace(/\\/g, '/');

      
      const script = `(function(){ var activeItem = app.project.activeItem; if (activeItem && activeItem instanceof CompItem) { var saveFile = new File("${safePath}"); activeItem.saveFrameToPng(activeItem.time, saveFile); return saveFile.fsName; } else { return "No active composition"; } })();`;

      console.log("2. calling evalES to save frame...")

      
      const result = await evalES(script, true);

      console.log("3. frame saved! result: ", result);


      if (result == 'No active composition') {
        throw new Error('Please select a composition before analyzing.');
      }

      await delay(1000);



      console.log("4. reading file from disk")
      const imageBuffer = fs.readFileSync(tempFilePath);


      const formData = new FormData();

      formData.append('image', new Blob([imageBuffer]), 'AEAI_frame.png');

      formData.append('prompt', prompt);


      console.log("5. sending data to python sever...");

      const response = await fetch('https://aeaihelperbackend.onrender.com/analyze-image',
        {method: 'POST', body: formData,}
      );

      console.log("6. python response recieved: ", response.status, response.statusText);



      if(!response.ok)
      {
        const errData = await response.json();
        throw new Error (errData.error || 'Error: ${response.statusText}');
      }


      console.log("7. parsing JSON from response...");

      const data = await response.json();

      console.log("8. JSON parsed: ", data);

      const rawText = data.suggestions || "gemini returned an empty response.";
      setGeminiResponse(rawText.replace(/\n/g, '<br />'));

      console.log("9. STATE SET.")
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

            {

            }
            <div 
              className="text-gray-300"
              dangerouslySetInnerHTML={{ __html: geminiResponse }} 
            />

          </div>
        )}
      </div>
    </div>
  );
}

