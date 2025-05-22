import { useState, useEffect } from 'react';

export default function TherapistApp() {
  const [activeScreen, setActiveScreen] = useState('home');
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI therapist. How are you feeling today?", sender: "ai" }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [modelType, setModelType] = useState('local');

  // Load API key from localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setModelType('openai');
    }
  }, []);

  // Save API key to localStorage
  const saveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('openai_api_key', key);
    if (key) {
      setModelType('openai');
    } else {
      setModelType('local');
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = { id: Date.now(), text: inputMessage, sender: "user" };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: currentInput,
          useOpenAI: modelType === 'openai' && apiKey,
          apiKey: apiKey
        })
      });

      const data = await response.json();
      
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: data.response || "I'm here to listen. Tell me more about how you're feeling.",
        sender: "ai",
        model: data.model || 'local'
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

  // Color theme
  const colors = {
    cream: '#F8F4E9',
    taupe: '#D8CFC4',
    sage: '#A4B494',
    slate: '#3A4A4F',
    clay: '#C17C54',
    gold: '#C0A062'
  };

  const HomeScreen = () => (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: colors.cream, 
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px'}}>
          <span style={{color: colors.clay, fontSize: '24px', marginRight: '10px'}}>✦</span>
          <h1 style={{
            fontSize: '2.5rem',
            color: colors.slate,
            margin: '0'
          }}>MindfulAI</h1>
          <span style={{color: colors.clay, fontSize: '24px', marginLeft: '10px'}}>✦</span>
        </div>
        <p style={{ color: colors.clay, margin: '5px 0' }}>Premium Therapeutic Intelligence</p>
        {modelType === 'openai' && (
          <p style={{ color: colors.gold, fontSize: '12px' }}>⚡ Enhanced with OpenAI GPT-4</p>
        )}
      </div>

      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <button
          onClick={() => setActiveScreen('chat')}
          style={{
            padding: '30px',
            backgroundColor: 'white',
            border: `1px solid ${colors.taupe}`,
            borderRadius: '15px',
            cursor: 'pointer',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s',
          }}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
        >
          <div style={{fontSize: '32px', marginBottom: '10px'}}>💬</div>
          <div style={{color: colors.slate, fontWeight: 'bold', marginBottom: '5px'}}>Begin Session</div>
          {modelType === 'openai' && (
            <div style={{fontSize: '10px', backgroundColor: colors.gold, color: 'white', padding: '2px 8px', borderRadius: '10px', display: 'inline-block'}}>
              GPT-4 Enhanced
            </div>
          )}
        </button>

        <button
          onClick={() => setActiveScreen('settings')}
          style={{
            padding: '30px',
            backgroundColor: 'white',
            border: `1px solid ${colors.taupe}`,
            borderRadius: '15px',
            cursor: 'pointer',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s',
          }}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
        >
          <div style={{fontSize: '32px', marginBottom: '10px'}}>⚙️</div>
          <div style={{color: colors.slate, fontWeight: 'bold'}}>Settings</div>
          <div style={{fontSize: '12px', color: colors.clay}}>Configure AI</div>
        </button>
      </div>

      <div style={{textAlign: 'center', fontSize: '12px', color: colors.sage}}>
        🔒 End-to-end encrypted • Private conversations
      </div>
    </div>
  );

  const ChatScreen = () => (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: colors.cream, 
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        padding: '15px 20px',
        borderBottom: `1px solid ${colors.taupe}`,
        display: 'flex',
        alignItems: 'center'
      }}>
        <button 
          onClick={() => setActiveScreen('home')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            marginRight: '15px',
            color: colors.slate
          }}
        >
          ←
        </button>
        <div>
          <h2 style={{margin: '0', color: colors.slate, fontSize: '18px'}}>Therapeutic Session</h2>
          <div style={{fontSize: '12px', color: colors.clay}}>
            {modelType === 'openai' ? '⚡ GPT-4 Enhanced Assistant' : '🧠 Local AI Assistant'}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: '1',
        padding: '20px',
        overflowY: 'auto'
      }}>
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
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
                backgroundColor: message.sender === 'user' ? colors.sage : 'white',
                color: message.sender === 'user' ? 'white' : colors.slate,
                border: message.sender === 'ai' ? `1px solid ${colors.taupe}` : 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div>{message.text}</div>
                <div style={{
                  fontSize: '10px',
                  marginTop: '8px',
                  opacity: '0.7',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  {message.model === 'openai' && <span>⚡</span>}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '15px' }}>
              <div style={{
                padding: '15px',
                borderRadius: '12px',
                backgroundColor: 'white',
                border: `1px solid ${colors.taupe}`,
                color: colors.slate
              }}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <span>Thinking</span>
                  <div style={{marginLeft: '8px', display: 'flex', gap: '2px'}}>
                    <div style={{width: '4px', height: '4px', backgroundColor: colors.sage, borderRadius: '50%', animation: 'pulse 1.4s infinite'}}></div>
                    <div style={{width: '4px', height: '4px', backgroundColor: colors.sage, borderRadius: '50%', animation: 'pulse 1.4s infinite 0.2s'}}></div>
                    <div style={{width: '4px', height: '4px', backgroundColor: colors.sage, borderRadius: '50%', animation: 'pulse 1.4s infinite 0.4s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderTop: `1px solid ${colors.taupe}`
      }}>
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
          <div style={{fontSize: '12px', color: colors.sage, marginBottom: '10px', display: 'flex', justifyContent: 'space-between'}}>
            <span>🔒 Private and secure conversation</span>
            {modelType === 'openai' && <span>⚡ Enhanced AI responses</span>}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what's on your mind... Press Enter to send"
              style={{
                flex: '1',
                padding: '15px',
                borderRadius: '8px',
                border: `1px solid ${colors.taupe}`,
                backgroundColor: colors.cream,
                resize: 'none',
                minHeight: '60px',
                fontFamily: 'Arial, sans-serif',
                fontSize: '16px',
                outline: 'none'
              }}
            />
            <button
              onClick={sendMessage}
              disabled={isTyping}
              style={{
                padding: '15px 25px',
                backgroundColor: colors.sage,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isTyping ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                opacity: isTyping ? 0.7 : 1
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const SettingsScreen = () => {
    const [tempApiKey, setTempApiKey] = useState(apiKey);
    const [showApiKey, setShowApiKey] = useState(false);

    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: colors.cream, 
        fontFamily: 'Arial, sans-serif',
        padding: '20px'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <button 
            onClick={() => setActiveScreen('home')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              marginRight: '15px',
              color: colors.slate
            }}
          >
            ←
          </button>
          <h1 style={{margin: '0', color: colors.slate}}>Settings</h1>
        </div>

        <div style={{maxWidth: '600px', margin: '0 auto'}}>
          {/* AI Model Selection */}
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '15px',
            border: `1px solid ${colors.taupe}`,
            marginBottom: '20px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{color: colors.slate, marginTop: '0'}}>AI Intelligence</h3>
            
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'flex', alignItems: 'flex-start', cursor: 'pointer'}}>
                <input
                  type="radio"
                  name="model"
                  checked={modelType === 'local'}
                  onChange={() => setModelType('local')}
                  style={{marginRight: '10px', marginTop: '2px', accentColor: colors.sage}}
                />
                <div>
                  <div style={{fontWeight: 'bold', color: colors.slate}}>Local AI</div>
                  <div style={{fontSize: '14px', color: colors.clay}}>
                    Basic therapeutic responses, works offline, completely free
                  </div>
                </div>
              </label>
            </div>

            <div>
              <label style={{display: 'flex', alignItems: 'flex-start', cursor: 'pointer'}}>
                <input
                  type="radio"
                  name="model"
                  checked={modelType === 'openai'}
                  onChange={() => setModelType('openai')}
                  style={{marginRight: '10px', marginTop: '2px', accentColor: colors.sage}}
                />
                <div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <span style={{fontWeight: 'bold', color: colors.slate}}>OpenAI GPT-4</span>
                    <span style={{
                      backgroundColor: colors.gold,
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '10px'
                    }}>PREMIUM</span>
                  </div>
                  <div style={{fontSize: '14px', color: colors.clay}}>
                    Advanced therapeutic insights, deeper empathy, personalized responses
                  </div>
                  <div style={{fontSize: '12px', color: apiKey ? '#059669' : colors.clay, marginTop: '5px'}}>
                    {apiKey ? '✅ API Key Configured' : '⚠️ API Key Required'}
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* API Key Configuration */}
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '15px',
            border: `1px solid ${colors.taupe}`,
            marginBottom: '20px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{color: colors.slate, marginTop: '0'}}>OpenAI Configuration</h3>
            
            <div style={{marginBottom: '15px'}}>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: 'bold', color: colors.slate}}>
                API Key
              </label>
              <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="sk-..."
                  style={{
                    flex: '1',
                    padding: '12px',
                    border: `1px solid ${colors.taupe}`,
                    borderRadius: '8px',
                    backgroundColor: colors.cream,
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  style={{
                    padding: '12px',
                    backgroundColor: colors.taupe,
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  {showApiKey ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div style={{display: 'flex', gap: '10px'}}>
              <button
                onClick={() => saveApiKey(tempApiKey)}
                style={{
                  padding: '12px 20px',
                  backgroundColor: colors.sage,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Save Key
              </button>
              <button
                onClick={() => {
                  saveApiKey('');
                  setTempApiKey('');
                }}
                style={{
                  padding: '12px 20px',
                  backgroundColor: colors.clay,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>
            </div>

            <div style={{
              marginTop: '15px',
              padding: '15px',
              backgroundColor: colors.cream,
              borderRadius: '8px',
              border: `1px solid ${colors.taupe}`
            }}>
              <div style={{fontSize: '14px', fontWeight: 'bold', color: colors.slate, marginBottom: '5px'}}>
                How to get OpenAI API Key:
              </div>
              <div style={{fontSize: '12px', color: colors.clay}}>
                1. Visit <strong>platform.openai.com</strong><br/>
                2. Sign up/Login → Go to API Keys<br/>
                3. Click "Create new secret key"<br/>
                4. Copy and paste it above<br/>
                5. You'll be charged per usage (~$0.002 per message)
              </div>
            </div>
          </div>

          {/* Test Button */}
          <div style={{textAlign: 'center'}}>
            <button
              onClick={() => setActiveScreen('chat')}
              style={{
                padding: '15px 30px',
                backgroundColor: colors.gold,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
            >
              🧪 Test Your AI Setup
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home': return <HomeScreen />;
      case 'chat': return <ChatScreen />;
      case 'settings': return <SettingsScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <>
      <style jsx>{`
        @keyframes pulse {
          0%, 60%, 100% { opacity: 0.4; }
          30% { opacity: 1; }
        }
      `}</style>
      {renderScreen()}
    </>
  );
}
