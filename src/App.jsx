import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import ReactMarkdown from "react-markdown";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [error, setError] = useState(null);

  async function generateAnswer(e) {
    e.preventDefault();
    setAnswer("");
    setError(null);
    setGeneratingAnswer(true);

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT}`,
        {
          contents: [{ parts: [{ text: question }] }],
        }
      );

      setAnswer(response.data.candidates[0].content.parts[0].text);
    } catch (error) {
      setError(`Error: ${error.message}`);
    } finally {
      setGeneratingAnswer(false);
    }
  }

  return (
    <div className="container">
      <header>
        <h1>AI Chatbot</h1>
      </header>
      <div className="input-container">
        <form onSubmit={generateAnswer}>
          <textarea
            required
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question..."
          />
          <button
            type="submit"
            disabled={generatingAnswer}
          >
            {generatingAnswer ? (
              <FontAwesomeIcon icon={faSpinner} className="spinner" />
            ) : (
              "Generate answer"
            )}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
      <div className="answer-container">
        {answer && (
          <ReactMarkdown>{answer}</ReactMarkdown>
        )}
      </div>
    </div>
  );
}

export default App;
