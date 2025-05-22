export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, useOpenAI, apiKey } = req.body;
  const lowerMessage = message.toLowerCase();

  // If user wants OpenAI and has API key
  if (useOpenAI && apiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are a compassionate, professional AI therapist. Provide thoughtful, empathetic responses that validate emotions and offer gentle guidance. Keep responses supportive but not overly clinical. Ask follow-up questions to encourage deeper reflection. Always maintain appropriate boundaries and suggest professional help when needed."
            },
            {
              role: "user",
              content: message
            }
          ],
          max_tokens: 200,
          temperature: 0.7
        })
      });

      if (response.ok) {
        const data = await response.json();
        return res.status(200).json({ 
          response: data.choices[0].message.content,
          model: 'openai'
        });
      } else {
        console.log('OpenAI API failed, falling back to local');
      }
    } catch (error) {
      console.log('OpenAI API error, falling back to local:', error.message);
    }
  }

  // Enhanced local responses
  let response;

  if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried')) {
    response = "I can sense the anxiety in your words, and I want you to know that what you're feeling is completely valid. Anxiety often signals that something important to us feels uncertain or threatened. Let's take a moment together - try taking three deep breaths with me. What specific thoughts are contributing to this anxious feeling right now?";
  } 
  else if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down')) {
    response = "Thank you for sharing these difficult feelings with me. Sadness and depression can feel overwhelming, but reaching out shows incredible strength. These emotions are temporary, even when they don't feel that way. What has been weighing most heavily on your heart lately? Sometimes talking through these feelings can help lighten the load.";
  } 
  else if (lowerMessage.includes('angry') || lowerMessage.includes('frustrated') || lowerMessage.includes('mad')) {
    response = "I hear the intensity in what you're sharing, and anger is often a signal that something important to you has been hurt or threatened. It's completely okay to feel this way. Can you help me understand what happened that sparked these feelings? Sometimes when we explore what's underneath anger, we find other emotions that need attention too.";
  } 
  else if (lowerMessage.includes('stressed') || lowerMessage.includes('overwhelmed')) {
    response = "It sounds like you're carrying a heavy load right now. Stress and feeling overwhelmed are your mind's way of telling you that you're dealing with a lot. Let's break this down together - what are the main things that are feeling most overwhelming to you right now? Sometimes organizing our thoughts can help us see a clearer path forward.";
  } 
  else if (lowerMessage.includes('lonely') || lowerMessage.includes('alone')) {
    response = "Loneliness can be one of the most difficult emotions to bear, and I'm grateful you're sharing this with me. Please know that reaching out here shows you're not truly alone - you're taking a brave step toward connection. What does loneliness feel like for you right now? And are there small ways we might explore building meaningful connections in your life?";
  } 
  else if (lowerMessage.includes('happy') || lowerMessage.includes('good') || lowerMessage.includes('great')) {
    response = "I'm so glad to hear there are positive feelings in your experience right now! It's important to acknowledge and celebrate these moments of joy or contentment. What's contributing to these good feelings? Understanding what brings us happiness can help us cultivate more of these experiences in our daily lives.";
  } 
  else if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted')) {
    response = "Feeling tired or drained can affect every aspect of our wellbeing. Thank you for sharing this with me. This exhaustion - is it more physical, emotional, or both? Sometimes our bodies and minds are telling us we need rest, boundaries, or a different approach to how we're spending our energy. What feels most draining in your life right now?";
  }
  else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    response = "Hello! I'm so glad you're here. This is a safe space where you can share whatever is on your mind. How are you feeling today? What would you like to explore together?";
  }
  else {
    response = "I'm listening carefully to what you're sharing. Your experiences and feelings matter deeply, and I appreciate your trust in opening up here. Can you tell me more about what's been on your mind lately? I'm here to walk through this with you, at whatever pace feels right for you.";
  }

  res.status(200).json({ 
    response,
    model: 'local'
  });
}
