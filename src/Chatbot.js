import React, { useState } from 'react';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to send the message when either the send button is clicked or Enter key is pressed
  const sendMessage = async () => {
    if (!userInput.trim()) return; // Prevent sending empty messages
    
    const newMessages = [...messages, { sender: 'user', text: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setLoading(true); // Start the loading state

    try {
      const response = await axios.post('http://localhost:5001/api/chat', { query: userInput });

      // Check if we received an answer
      if (response.data.answer) {
        setMessages([...newMessages, { sender: 'bot', text: response.data.answer }]);
      } else {
        setMessages([...newMessages, { sender: 'bot', text: 'Sorry, I couldn’t find any information about that.' }]);
      }
    } catch (error) {
      setMessages([...newMessages, { sender: 'bot', text: 'Sorry, there was an error processing your request.' }]);
    } finally {
      setLoading(false); // End the loading state
    }
  };

  // Function to handle the Enter key press in the input field
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevents the default behavior (which is submitting the form)
      sendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbox">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>{msg.text}</div>
        ))}
        {loading && <div className="message bot">Loading...</div>} {/* Show loading message */}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyPress} // Listen for key presses
          placeholder="Ask about our services..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
