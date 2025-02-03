import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(30);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateMusic = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://localhost:8000/generate-music", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, duration }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate music");
      }

      const data = await response.json();
      setResult(data);

      if (data.audio_url) {
        setResult((prev) => ({
          ...prev,
          status: "completed",
          audio_url: `http://localhost:8000${data.audio_url}`,
        }));
      }
    } catch (error) {
      console.error("Error:", error);
      setResult({
        status: "error",
        audio_url: "",
        message: "Failed to generate music. Please try again.",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1 className="title">AI Music Generator</h1>

        <div className="form-group">
          <label className="label">Music Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="input"
            rows={4}
            placeholder="Enter your music description (e.g. 'A joyful piano melody with an upbeat tempo')"
          />
        </div>

        <div className="form-group">
          <label className="label">Duration (seconds)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="input"
            min="10"
            max="120"
          />
        </div>

        <button
          onClick={generateMusic}
          disabled={isLoading}
          className={`submit-btn ${isLoading ? 'disabled' : ''}`}
        >
          {isLoading ? 'Generating...' : 'Generate Music'}
        </button>

        {isLoading && (
          <div className="spinner-container">
            <div className="spinner-wheel"></div>
          </div>
        )}

        {result && (
          <div className="result">
            {result.status === 'processing' && (
              <div className="processing">
                <p>{result.message}</p>
              </div>
            )}

            {result.status === 'completed' && (
              <div>
                <h2 className="result-title">Generated Music</h2>
                <audio controls className="audio-player">
                  <source src={result.audio_url} type="audio/wav" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            {result.status === 'error' && (
              <div className="error-message">
                {result.message}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
