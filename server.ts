import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK on server-side per gemini-api guidelines
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Emergency keywords check for rapid safety response
const EMERGENCY_KEYWORDS = [
  'chest pain',
  'heart attack',
  'cannot breathe',
  "can't breathe",
  'shortness of breath',
  'stroke',
  'facial drooping',
  'slurred speech',
  'unconscious',
  'unresponsive',
  'severe bleeding',
  'anaphylaxis',
  'overdose',
  'suicide',
  'coughing blood',
];

// AI Healthcare Assistant Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history, language = 'en', patientContext } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const lowerMsg = message.toLowerCase();
    const isEmergency = EMERGENCY_KEYWORDS.some(k => lowerMsg.includes(k));

    if (isEmergency) {
      const emergencyAdvice = language === 'hi'
        ? "⚠️ तत्काल चिकित्सा चेतावनी: आपके द्वारा बताए गए लक्षण किसी आपातकालीन स्थिति (जैसे दिल का दौरा या गंभीर सांस की तकलीफ) का संकेत दे सकते हैं। कृपया तुरंत 112 या 108 डायल करें या निकटतम आपातकालीन कक्ष में जाएं।"
        : "⚠️ CRITICAL MEDICAL ALERT: The symptoms you described may indicate a medical emergency requiring immediate evaluation. Please call 911, 112, or your local emergency response immediately, or proceed to the nearest Emergency Department. Do not wait for an online appointment.";

      return res.json({
        reply: emergencyAdvice,
        isEmergency: true,
        recommendedSpecialty: "Emergency Medicine",
        disclaimer: "Informational only. Not a medical diagnosis. Call emergency services immediately.",
      });
    }

    // If Gemini API is available, query gemini-3.8-flash
    if (ai && process.env.GEMINI_API_KEY) {
      try {
        const systemPrompt = `You are MediGuideAI, a compassionate, professional AI Healthcare Assistant for the MediguideAI medical platform.
CRITICAL SAFETY RULES:
1. Always state that your responses are strictly for informational and educational purposes, and NOT a medical diagnosis or treatment prescription.
2. If severe red-flag symptoms are noted, recommend urgent in-person medical care.
3. Suggest the most relevant medical specialty from: General Medicine, Cardiology, Dermatology, Neurology, Pediatrics, Orthopedics, Gynecology, Psychiatry, ENT, Ophthalmology.
4. Keep the tone empathetic, reassuring, clinical yet easy to understand for patients.
5. Multi-language instruction: If language is 'hi', reply in clear, polite Hindi with Devanagari script; otherwise reply in clear English.
${patientContext ? `Patient Context: ${JSON.stringify(patientContext)}` : ''}

Format your final reply naturally, and if relevant, include a concise section:
Recommended Specialty: [Specialty Name]
Suggested Next Step: [Book an appointment with a specialist / monitor symptoms / consult in-person]`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: message,
          config: {
            systemInstruction: systemPrompt,
          },
        });

        const replyText = response.text || "I am here to guide your healthcare questions. Please consult a qualified medical professional for diagnosis.";

        // Extract specialty if mentioned
        let recommendedSpecialty = 'General Medicine';
        const specialties = ['Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Gynecology', 'Psychiatry', 'ENT', 'Ophthalmology', 'General Medicine'];
        for (const spec of specialties) {
          if (replyText.toLowerCase().includes(spec.toLowerCase())) {
            recommendedSpecialty = spec;
            break;
          }
        }

        return res.json({
          reply: replyText,
          isEmergency: false,
          recommendedSpecialty,
          disclaimer: "MediGuideAI provides health information for educational purposes only. Always consult a licensed physician for diagnosis and treatment.",
        });
      } catch (geminiError) {
        console.warn('Gemini API call failed, using clinical fallback:', geminiError);
      }
    }

    // High quality clinical fallback response
    let detectedSpecialty = 'General Medicine';
    let guidance = '';

    if (lowerMsg.includes('skin') || lowerMsg.includes('rash') || lowerMsg.includes('acne') || lowerMsg.includes('itching')) {
      detectedSpecialty = 'Dermatology';
      guidance = language === 'hi'
        ? "त्वचा संबंधी समस्याओं, चकत्तों या खुजली के लिए त्वचा रोग विशेषज्ञ (Dermatologist) से परामर्श लेना सबसे अच्छा रहता है। प्रभावित क्षेत्र को साफ और सूखा रखें और बिना डॉक्टर की सलाह के कोई तेज क्रीम न लगाएं।"
        : "For skin flare-ups, rashes, itching, or lesions, a consultation with a Dermatologist is recommended. Keep the affected area clean and moisturized, avoid harsh chemicals, and consult a doctor if redness spreads.";
    } else if (lowerMsg.includes('headache') || lowerMsg.includes('migraine') || lowerMsg.includes('dizziness') || lowerMsg.includes('numbness')) {
      detectedSpecialty = 'Neurology';
      guidance = language === 'hi'
        ? "बार-बार होने वाले सिरदर्द, माइग्रेन या चक्कर आने पर न्यूरोलॉजिस्ट (Neurologist) से जांच कराना उचित है। पानी पर्याप्त मात्रा में पिएं और नींद पूरी रखें।"
        : "Frequent or intense headaches, migraines, or dizziness warrant evaluation by a Neurologist. Maintain adequate hydration, monitor screen time, and track headache triggers.";
    } else if (lowerMsg.includes('joint') || lowerMsg.includes('knee') || lowerMsg.includes('back pain') || lowerMsg.includes('bone') || lowerMsg.includes('fracture')) {
      detectedSpecialty = 'Orthopedics';
      guidance = language === 'hi'
        ? "जोड़ों के दर्द, पीठ दर्द या हड्डी संबंधी परेशानी के लिए आर्थोपेडिक सर्जन (Orthopedist) से परामर्श लें। अधिक भारी वजन उठाने से बचें।"
        : "Joint stiffness, knee pain, or persistent back discomfort is best addressed by an Orthopedic specialist. Practice gentle mobility exercises and avoid strenuous strain until examined.";
    } else if (lowerMsg.includes('child') || lowerMsg.includes('baby') || lowerMsg.includes('kid') || lowerMsg.includes('infant')) {
      detectedSpecialty = 'Pediatrics';
      guidance = language === 'hi'
        ? "बच्चों के स्वास्थ्य, बुखार या विकास संबंधी प्रश्नों के लिए बाल रोग विशेषज्ञ (Pediatrician) से परामर्श करें।"
        : "For pediatric health questions, fever, or childhood growth milestones, consulting a licensed Pediatrician is recommended.";
    } else if (lowerMsg.includes('heart') || lowerMsg.includes('palpitation') || lowerMsg.includes('blood pressure') || lowerMsg.includes('hypertension')) {
      detectedSpecialty = 'Cardiology';
      guidance = language === 'hi'
        ? "हृदय गति में बदलाव, घबराहट या रक्तचाप की निगरानी के लिए हृदय रोग विशेषज्ञ (Cardiologist) से जांच कराएं।"
        : "Blood pressure concerns, resting palpitations, or cardiovascular wellness inquiries are best addressed by a Cardiologist. Regularly monitor your BP readings.";
    } else {
      detectedSpecialty = 'General Medicine';
      guidance = language === 'hi'
        ? "सामान्य लक्षणों या स्वास्थ्य संबंधी प्रश्नों के लिए जनरल फिजिशियन (General Physician) से परामर्श पहली सही दिशा होती है।"
        : "For common symptoms, routine checkups, or general wellness advice, speaking with a General Physician is the best initial step.";
    }

    const fallbackReply = language === 'hi'
      ? `${guidance}\n\nअनुशंसित विशेषज्ञता: ${detectedSpecialty}\nसुझाव: आप मेडीगाइडएआई पर उपलब्ध डॉक्टरों में से तुरंत अपॉइंटमेंट बुक कर सकते हैं।`
      : `${guidance}\n\n• Recommended Specialty: ${detectedSpecialty}\n• Next Step: Explore verified specialists on MediguideAI and schedule an online or in-person consultation.\n• Preparation: Note down when symptoms started and any current medications before your visit.`;

    return res.json({
      reply: fallbackReply,
      isEmergency: false,
      recommendedSpecialty: detectedSpecialty,
      disclaimer: "MediGuideAI provides health information for educational purposes only. Always consult a licensed physician for diagnosis and treatment.",
    });
  } catch (error: any) {
    console.error('Error in /api/ai/chat:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    platform: 'MediguideAI',
    aiEnabled: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`MediguideAI Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
