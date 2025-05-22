export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  const lowerMessage = message.toLowerCase();

  // Smart responses based on what user says
  let response;

  if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried')) {
    response = "I can sense the anxiety in your words, and I want you to know that what you're feeling is completely valid. Let's take a moment together - try taking three deep breaths with me. What specific thoughts are contributing to this anxious feeling right now?";
  } 
  else if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down')) {
    response = "Thank you for sharing these difficult feelings with me. Sadness can feel overwhelming, but reaching out shows incredible strength. What has been weighing most heavily on your heart lately?";
  } 
  else if (lowerMessage.includes('angry') || lowerMessage.includes('frustrated') || lowerMessage.includes('mad')) {
    response = "I hear the intensity in what you're sharing. Anger often signals that something important to you has been hurt or threatened. Can you help me understand what happened that sparked these feelings?";
  } 
  else if (lowerMessage.includes('stressed') || lowerMessage.includes('overwhelmed')) {
    response = "It sounds like you're carrying a heavy load right now. Let's break this down together - what are the main things that feel most overwhelming to you right now?";
  } 
  else if (lowerMessage.includes('lonely') || lowerMessage.includes('alone')) {
    response = "Loneliness can be one of the most difficult emotions to bear. Please know that reaching out here shows you're not truly alone. What does loneliness feel like for you right now?";
  } 
  else if (lowerMessage.includes('happy') || lowerMessage.includes('good') || lowerMessage.includes('great')) {
    response = "I'm so glad to hear there are positive feelings in your experience right now! What's contributing to these good feelings? Understanding what brings us happiness can help us cultivate more of it.";
  } 
  else if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted')) {
    response = "Feeling tired can affect every aspect of our wellbeing. This exhaustion - is it more physical, emotional, or both? What feels most draining in your life right now?";
  } 
  else if (lowerMessage.includes('confused') || lowerMessage.includes('lost') || lowerMessage.includes('stuck')) {
    response = "Feeling confused or stuck can be incredibly frustrating. What specific area of your life is feeling most unclear right now? Together, we can explore different perspectives that might help bring some clarity.";
  }
  else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    response = "Hello! I'm so glad you're here. This is a safe space where you can share whatever is on your mind. How are you feeling today?";
  }
  else {
    response = "I'm listening carefully to what you're sharing. Your experiences and feelings matter deeply. Can you tell me more about what's been on your mind lately? I'm here to walk through this with you.";
  }

  // Try to use AI if keys are available
  if (process.env.OPENAI_API_KEY) {
    try {
      const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are a compassionate, professional AI therapist. Provide thoughtful, empathetic responses that validate emotions and offer gentle guidance. Keep responses supportive but not overly clinical."
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
        const data = await aiResponse.json();
        response = data.choices[0].message.content;
      }
    } catch (error) {
      console.log('AI API not available, using local response');
    }
  }

  res.status(200).json({ response });
}
