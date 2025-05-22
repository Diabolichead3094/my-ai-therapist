export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  const lowerMessage = message.toLowerCase();

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
  else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    response = "Hello! I'm so glad you're here. This is a safe space where you can share whatever is on your mind. How are you feeling today?";
  }
  else {
    response = "I'm listening carefully to what you're sharing. Your experiences and feelings matter deeply. Can you tell me more about what's been on your mind lately? I'm here to walk through this with you.";
  }

  res.status(200).json({ response });
}
