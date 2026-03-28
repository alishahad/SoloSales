import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { GoogleGenAI } from '@google/genai';
import db, { initDb } from './db.ts';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-prod';

// Initialize DB
initDb();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- Auth Routes ---

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)').run(email, hashedPassword);
    
    const token = jwt.sign({ id: result.lastInsertRowid, email }, JWT_SECRET, { expiresIn: '24h' });
    
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });
    res.json({ user: { id: result.lastInsertRowid, email, onboarding_completed: 0 } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });
    res.json({ user: { id: user.id, email: user.email, onboarding_completed: user.onboarding_completed } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'none' });
  res.json({ message: 'Logged out' });
});

app.get('/api/auth/me', authenticateToken, (req: any, res) => {
  const user = db.prepare('SELECT id, email, onboarding_completed FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.sendStatus(404);
  res.json({ user });
});

app.put('/api/auth/password', authenticateToken, async (req: any, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id) as any;
    
    if (!user || !(await bcrypt.compare(currentPassword, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid current password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hashedPassword, req.user.id);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/auth/account', authenticateToken, (req: any, res) => {
  try {
    db.prepare('DELETE FROM users WHERE id = ?').run(req.user.id);
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'none' });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/onboarding', authenticateToken, (req: any, res) => {
  const { industry, target_customer, deal_size, geography } = req.body;
  
  const transaction = db.transaction(() => {
    // Create default project
    const result = db.prepare(`
      INSERT INTO projects (user_id, name, industry, target_customer, deal_size, geography)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(req.user.id, 'My First Project', industry, target_customer, deal_size, geography);
    
    // Mark onboarding complete
    db.prepare('UPDATE users SET onboarding_completed = 1 WHERE id = ?').run(req.user.id);
    
    return result.lastInsertRowid;
  });
  
  try {
    const projectId = transaction();
    res.json({ success: true, projectId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save onboarding data' });
  }
});

// --- Project Routes ---

app.get('/api/projects', authenticateToken, (req: any, res) => {
  const projects = db.prepare(`
    SELECT p.*, COUNT(l.id) as lead_count 
    FROM projects p
    LEFT JOIN leads l ON p.id = l.project_id
    WHERE p.user_id = ? 
    GROUP BY p.id
    ORDER BY p.updated_at DESC
  `).all(req.user.id);
  res.json(projects);
});

app.post('/api/projects', authenticateToken, (req: any, res) => {
  const { name, industry, target_customer, deal_size, geography, target_roles, sales_motion, current_stage, blocking_problem } = req.body;
  
  const result = db.prepare(`
    INSERT INTO projects (user_id, name, industry, target_customer, deal_size, geography, target_roles, sales_motion, current_stage, blocking_problem)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(req.user.id, name, industry, target_customer, deal_size, geography, target_roles, sales_motion, current_stage, blocking_problem);
  
  res.json({ id: result.lastInsertRowid, ...req.body });
});

app.put('/api/projects/:id', authenticateToken, (req: any, res) => {
  const { name, industry, target_customer, deal_size, geography, target_roles, sales_motion, current_stage, blocking_problem } = req.body;
  
  // Verify ownership
  const project = db.prepare('SELECT user_id FROM projects WHERE id = ?').get(req.params.id) as any;
  if (!project || project.user_id !== req.user.id) return res.sendStatus(403);

  db.prepare(`
    UPDATE projects 
    SET name = COALESCE(?, name),
        industry = COALESCE(?, industry),
        target_customer = COALESCE(?, target_customer),
        deal_size = COALESCE(?, deal_size),
        geography = COALESCE(?, geography),
        target_roles = COALESCE(?, target_roles),
        sales_motion = COALESCE(?, sales_motion),
        current_stage = COALESCE(?, current_stage),
        blocking_problem = COALESCE(?, blocking_problem),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(name, industry, target_customer, deal_size, geography, target_roles, sales_motion, current_stage, blocking_problem, req.params.id);
  
  const updatedProject = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  res.json(updatedProject);
});

app.get('/api/projects/:id', authenticateToken, (req: any, res) => {
  const project = db.prepare('SELECT * FROM projects WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id) as any;
  if (!project) return res.status(404).json({ error: 'Project not found' });
  
  const assets = db.prepare('SELECT * FROM assets WHERE project_id = ?').all(req.params.id);
  const leads = db.prepare('SELECT * FROM leads WHERE project_id = ?').all(req.params.id);
  
  res.json({ ...project, assets, leads });
});

// --- Asset Routes ---
app.put('/api/projects/:id/assets/:assetId', authenticateToken, (req: any, res) => {
  const { content } = req.body;
  // Verify ownership
  const project = db.prepare('SELECT user_id FROM projects WHERE id = ?').get(req.params.id) as any;
  if (!project || project.user_id !== req.user.id) return res.sendStatus(403);

  db.prepare('UPDATE assets SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND project_id = ?').run(content, req.params.assetId, req.params.id);
  res.json({ success: true });
});

// --- Generation Route ---

app.post('/api/projects/:id/generate', authenticateToken, async (req: any, res) => {
  const projectId = req.params.id;
  const project = db.prepare('SELECT * FROM projects WHERE id = ? AND user_id = ?').get(projectId, req.user.id) as any;
  
  if (!project) return res.status(404).json({ error: 'Project not found' });

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `
      Act as a world-class outbound sales strategist. Generate a complete outbound sales system for the following company:
      
      Industry: ${project.industry}
      Target Customer: ${project.target_customer}
      Deal Size: ${project.deal_size}
      Geography: ${project.geography}
      Target Roles: ${project.target_roles}
      Sales Motion: ${project.sales_motion}
      Current Stage: ${project.current_stage}
      Biggest Blocking Problem: ${project.blocking_problem}

      Please generate the following 5 assets in a structured JSON format:
      1. "icp": A detailed Ideal Customer Profile summary (1-2 personas).
      2. "email_sequence": 3 outbound email sequences (4 emails each).
      3. "linkedin_dm": 5 LinkedIn DM scripts for connection and follow-up.
      4. "discovery_script": A discovery call script with structure and key questions.
      5. "objection_handling": A cheatsheet for 5 common objections with responses.

      Return ONLY valid JSON with keys: "icp", "email_sequence", "linkedin_dm", "discovery_script", "objection_handling".
      The values should be formatted as Markdown strings.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    const generatedAssets = JSON.parse(text);

    // Save to DB
    const insertAsset = db.prepare('INSERT INTO assets (project_id, type, content) VALUES (?, ?, ?)');
    
    const transaction = db.transaction(() => {
      // Clear existing assets for this project to avoid duplicates on re-generation
      db.prepare('DELETE FROM assets WHERE project_id = ?').run(projectId);
      
      insertAsset.run(projectId, 'icp', generatedAssets.icp);
      insertAsset.run(projectId, 'email_sequence', generatedAssets.email_sequence);
      insertAsset.run(projectId, 'linkedin_dm', generatedAssets.linkedin_dm);
      insertAsset.run(projectId, 'discovery_script', generatedAssets.discovery_script);
      insertAsset.run(projectId, 'objection_handling', generatedAssets.objection_handling);
      
      // Update project updated_at
      db.prepare('UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(projectId);
    });
    
    transaction();

    const assets = db.prepare('SELECT * FROM assets WHERE project_id = ?').all(projectId);
    res.json(assets);

  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to generate assets' });
  }
});

// --- Lead Routes ---

app.post('/api/projects/:id/leads', authenticateToken, (req: any, res) => {
  const { company_name, contact_name, role, email, value, notes, status } = req.body;
  const result = db.prepare(`
    INSERT INTO leads (project_id, company_name, contact_name, role, email, value, notes, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(req.params.id, company_name, contact_name, role, email, value, notes, status || 'To Contact');
  
  res.json({ id: result.lastInsertRowid, ...req.body });
});

app.put('/api/projects/:id/leads/:leadId', authenticateToken, (req: any, res) => {
  const { company_name, contact_name, role, email, value, status, notes } = req.body;
  // Verify ownership
  const project = db.prepare('SELECT user_id FROM projects WHERE id = ?').get(req.params.id) as any;
  if (!project || project.user_id !== req.user.id) return res.sendStatus(403);

  db.prepare(`
    UPDATE leads 
    SET company_name = COALESCE(?, company_name),
        contact_name = COALESCE(?, contact_name),
        role = COALESCE(?, role),
        email = COALESCE(?, email),
        value = COALESCE(?, value),
        status = COALESCE(?, status),
        notes = COALESCE(?, notes),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(company_name, contact_name, role, email, value, status, notes, req.params.leadId);
  
  res.json({ success: true });
});

app.delete('/api/projects/:id/leads/:leadId', authenticateToken, (req: any, res) => {
  // Verify ownership
  const project = db.prepare('SELECT user_id FROM projects WHERE id = ?').get(req.params.id) as any;
  if (!project || project.user_id !== req.user.id) return res.sendStatus(403);

  db.prepare('DELETE FROM leads WHERE id = ?').run(req.params.leadId);
  res.json({ success: true });
});


app.post('/api/generate-logo', async (req, res) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: 'A clean, modern, professional logo for a B2B SaaS application called SoloSales.OS. The logo should feature a stylized "S" or a target/growth chart motif, using a color palette of deep indigo and vibrant purple. Minimalist, flat vector style, white background.',
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        const buffer = Buffer.from(base64EncodeString, 'base64');
        const publicDir = path.join(process.cwd(), 'public');
        if (!fs.existsSync(publicDir)) {
          fs.mkdirSync(publicDir);
        }
        fs.writeFileSync(path.join(publicDir, 'logo.png'), buffer);
        return res.json({ success: true, message: 'Logo generated and saved to public/logo.png' });
      }
    }
    res.status(500).json({ error: 'No image data returned' });
  } catch (error: any) {
    console.error('Failed to generate logo:', error);
    res.status(500).json({ error: 'Failed to generate logo', details: error.message });
  }
});

// Vite Middleware
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  // Serve static files in production
  const distPath = path.join(process.cwd(), 'dist');
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
