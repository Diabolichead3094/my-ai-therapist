import { useState } from 'react';

export default function TherapistApp() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI therapist. How are you feeling today?", sender: "ai" }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMsg = { id: Date.now(), text: inputMessage, sender: "user" };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Call our API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputMessage })
      });

      const data = await response.json();
      
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: data.response || "I'm here to listen. Tell me more about how you're feeling.",
        sender: "ai"
      }]);
    } catch (error) {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "I'm having trouble connecting, but I'm still here for you. What's on your mind?",
        sender: "ai"
      }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#F8F4E9', 
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          color: '#3A4A4F',
          marginBottom: '10px'
        }}>
          ✦ MindfulAI Therapist ✦
        </h1>
        <p style={{ color: '#C17C54' }}>Your Personal Therapeutic Companion</p>
      </div>

      {/* Chat Container */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        border: '1px solid #D8CFC4'
      }}>
        
        {/* Messages */}
        <div style={{
          height: '500px',
          overflowY: 'auto',
          marginBottom: '20px',
          padding: '10px'
        }}>
          {messages.map(message => (
            <div key={message.id} style={{
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '15px'
            }}>
              <div style={{
                maxWidth: '70%',
                padding: '15px',
                borderRadius: '12px',
                backgroundColor: message.sender === 'user' ? '#A4B494' : '#F8F4E9',
                color: message.sender === 'user' ? 'white' : '#3A4A4F',
                border: message.sender === 'ai' ? '1px solid #D8CFC4' : 'none'
              }}>
                {message.text}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '15px' }}>
              <div style={{
                padding: '15px',
                borderRadius: '12px',
                backgroundColor: '#F8F4E9',
                border: '1px solid #D8CFC4',
                color: '#3A4A4F'
              }}>
                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share what's on your mind..."
            style={{
              flex: '1',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #D8CFC4',
              backgroundColor: '#F8F4E9',
              resize: 'none',
              minHeight: '60px',
              fontFamily: 'Arial, sans-serif',
              fontSize: '16px'
            }}
          />
          <button
            onClick={sendMessage}
            disabled={isTyping}
            style={{
              padding: '15px 25px',
              backgroundColor: '#A4B494',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Send
          </button>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '20px',
          fontSize: '12px',
          color: '#A4B494'
        }}>
          🔒 Private and secure conversation
        </div>
      </div>
    </div>
  );
}
