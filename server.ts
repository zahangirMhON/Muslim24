import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { IslamicRagEngine, RAG_SOURCES_DB, RagSource } from './src/services/ragEngine';
import { MediaEngineService } from './src/services/mediaEngine';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Services
  const apiKey = process.env.GEMINI_API_KEY || '';
  const ragEngine = new IslamicRagEngine(apiKey);
  const mediaEngine = new MediaEngineService();

  // Health API
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', app: 'Islamic Life 24/7' });
  });

  // Versioned RAG Chat Endpoint - /api/v1/ai/chat and legacy /api/chat
  const handleChatRequest = async (req: express.Request, res: express.Response) => {
    try {
      const { message } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      const ragResult = await ragEngine.processQuery(message);

      res.json({
        reply: ragResult.answer,
        sources: ragResult.sources.map(s => `${s.title} (${s.reference})`),
        confidenceScore: ragResult.confidenceScore,
        isHighRisk: ragResult.isHighRisk,
        disclaimer: ragResult.disclaimer,
        refused: ragResult.refused
      });
    } catch (err: any) {
      console.error('Error handling chat request:', err);
      res.status(500).json({
        error: 'AI service unavailable',
        reply: 'আসসালামু আলাইকুম, ইসলামিক লাইফ AI সার্ভিসটি সংযোগ করতে পারছে না। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।'
      });
    }
  };

  app.post('/api/chat', handleChatRequest);
  app.post('/api/v1/ai/chat', handleChatRequest);

  // ADMIN RAG SOURCE MANAGEMENT ENDPOINTS
  app.get('/api/v1/admin/rag/sources', (_req, res) => {
    res.json({ success: true, sources: RAG_SOURCES_DB });
  });

  app.post('/api/v1/admin/rag/sources', (req, res) => {
    const { title, author, category, license } = req.body;
    if (!title || !author) {
      res.status(400).json({ success: false, message: 'Title and author required' });
      return;
    }

    const newSource: RagSource = {
      id: `src-${Date.now()}`,
      title,
      author,
      category: category || 'Quran',
      verificationStatus: 'PENDING',
      chunkCount: 0,
      license: license || 'Verified Text',
      createdAt: new Date().toISOString().split('T')[0]
    };

    RAG_SOURCES_DB.push(newSource);
    res.status(201).json({ success: true, source: newSource });
  });

  app.patch('/api/v1/admin/rag/sources/:id', (req, res) => {
    const { id } = req.params;
    const { action, verifiedBy } = req.body; // action: 'VERIFY' | 'REJECT' | 'DISABLE' | 'REINDEX'

    const source = RAG_SOURCES_DB.find(s => s.id === id);
    if (!source) {
      res.status(404).json({ success: false, message: 'Source not found' });
      return;
    }

    if (action === 'VERIFY') {
      source.verificationStatus = 'VERIFIED';
      source.verifiedBy = verifiedBy || 'Scholar Moderation Panel';
    } else if (action === 'REJECT') {
      source.verificationStatus = 'REJECTED';
    } else if (action === 'DISABLE') {
      source.verificationStatus = 'DISABLED';
    } else if (action === 'REINDEX') {
      source.chunkCount += 50; // Simulate chunk re-indexing
    }

    res.json({ success: true, source });
  });

  app.get('/api/v1/admin/rag/citations/audit', (_req, res) => {
    res.json({
      success: true,
      auditLog: [
        { id: 'aud-1', query: 'তাহাজ্জুদ নামাজের সময়', matchedSource: 'সহীহ বুখারী: ১১৪৫', confidence: 0.98, status: 'VERIFIED_CITATION' },
        { id: 'aud-2', query: 'সকালের জিকির', matchedSource: 'হিসনুল মুসলিম', confidence: 0.96, status: 'VERIFIED_CITATION' },
        { id: 'aud-3', query: 'সালাত ও যাকাত বিধান', matchedSource: 'সূরা আল-বাকারা: ৪৩', confidence: 0.99, status: 'VERIFIED_CITATION' }
      ]
    });
  });

  // 24/7 MEDIA ENGINE BROADCAST ENDPOINTS
  app.get('/api/v1/media/schedule', (_req, res) => {
    res.json({
      success: true,
      schedule: mediaEngine.getSchedule()
    });
  });

  app.get('/api/v1/media/current', (_req, res) => {
    const status = mediaEngine.getCurrentBroadcast();
    res.json({
      success: true,
      status
    });
  });

  app.post('/api/v1/admin/media/schedule', (req, res) => {
    const { title, category, reciterOrScholar, startTime, endTime, recurrenceType, audioStreamUrl, backupStreamUrl } = req.body;

    if (!title || !startTime || !endTime) {
      res.status(400).json({ success: false, message: 'Missing required schedule fields' });
      return;
    }

    const newItem = mediaEngine.addScheduleItem({
      title,
      category: category || 'Quran Recitation',
      reciterOrScholar: reciterOrScholar || 'Islamic Foundation Bangladesh',
      startTime,
      endTime,
      recurrenceType: recurrenceType || 'DAILY',
      audioStreamUrl: audioStreamUrl || 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/1.mp3',
      backupStreamUrl: backupStreamUrl || 'https://server8.mp3quran.net/afs/001.mp3'
    });

    res.status(201).json({ success: true, item: newItem });
  });

  app.delete('/api/v1/admin/media/schedule/:id', (req, res) => {
    const { id } = req.params;
    const deleted = mediaEngine.deleteScheduleItem(id);
    res.json({ success: deleted });
  });

  // Vite middleware in dev mode or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌙 Islamic Life 24/7 server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
