require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Schema
const flowSchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  response: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const Flow = mongoose.model('Flow', flowSchema);

// POST /api/ask-ai
app.post('/api/ask-ai', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.APP_URL || 'http://localhost:5173',
        'X-Title': 'AI Flow App',
      },
      body: JSON.stringify({
        model: 'google/gemma-3n-e4b-it:free',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenRouter error:', errText);
      return res.status(502).json({ error: 'AI service error', details: errText });
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || 'No response from AI.';
    res.json({ answer });
  } catch (err) {
    console.error('ask-ai error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/save
app.post('/api/save', async (req, res) => {
  const { prompt, response } = req.body;
  if (!prompt || !response) {
    return res.status(400).json({ error: 'Prompt and response are required' });
  }

  try {
    const flow = await Flow.create({ prompt, response });
    res.json({ message: 'Saved successfully', id: flow._id });
  } catch (err) {
    console.error('save error:', err);
    res.status(500).json({ error: 'Failed to save' });
  }
});

// GET /api/history (bonus: view saved records)
app.get('/api/history', async (req, res) => {
  try {
    const flows = await Flow.find().sort({ createdAt: -1 }).limit(20);
    res.json(flows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
