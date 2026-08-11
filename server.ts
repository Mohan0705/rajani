import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { dbStore } from './server/db';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API Routes
  const router = express.Router();

  // --- SETTINGS ---
  router.get('/settings', (req, res) => {
    try {
      const settings = dbStore.getSettings();
      res.json({ success: true, settings });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  router.put('/settings', (req, res) => {
    try {
      const updated = dbStore.updateSettings(req.body);
      res.json({ success: true, settings: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // --- CATEGORIES ---
  router.get('/categories', (req, res) => {
    try {
      const all = req.query.admin === 'true' ? dbStore.getAllCategories() : dbStore.getCategories();
      res.json({ success: true, categories: all });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  router.post('/categories', (req, res) => {
    try {
      const created = dbStore.createCategory(req.body);
      res.json({ success: true, category: created });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  router.put('/categories/:id', (req, res) => {
    try {
      const updated = dbStore.updateCategory(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Category not found' });
      }
      res.json({ success: true, category: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  router.delete('/categories/:id', (req, res) => {
    try {
      const ok = dbStore.deleteCategory(req.params.id);
      res.json({ success: ok });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // --- PRODUCTS ---
  router.get('/products', (req, res) => {
    try {
      const {
        category_slug,
        fabric,
        color,
        occasion,
        search,
        is_featured,
        is_new_arrival,
        min_price,
        max_price,
        sort,
        limit,
        offset
      } = req.query;

      const result = dbStore.getProducts({
        category_slug: category_slug as string,
        fabric: fabric as string,
        color: color as string,
        occasion: occasion as string,
        search: search as string,
        is_featured: is_featured === 'true',
        is_new_arrival: is_new_arrival === 'true',
        min_price: min_price ? Number(min_price) : undefined,
        max_price: max_price ? Number(max_price) : undefined,
        sort: sort as string,
        limit: limit ? Number(limit) : 24,
        offset: offset ? Number(offset) : 0
      });

      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  router.get('/products/admin/all', (req, res) => {
    try {
      const products = dbStore.getAllProductsAdmin();
      res.json({ success: true, products });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  router.get('/products/:slugOrId', (req, res) => {
    try {
      const product = dbStore.getProductBySlugOrId(req.params.slugOrId);
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      res.json({ success: true, product });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  router.post('/products', (req, res) => {
    try {
      const created = dbStore.createProduct(req.body);
      res.json({ success: true, product: created });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  router.put('/products/:id', (req, res) => {
    try {
      const updated = dbStore.updateProduct(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      res.json({ success: true, product: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  router.delete('/products/:id', (req, res) => {
    try {
      const ok = dbStore.deleteProduct(req.params.id);
      res.json({ success: ok });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // --- LEADS ---
  router.post('/leads', (req, res) => {
    try {
      const { name, phone, email, city, product_id, product_name, product_sku, product_image, message, preferred_contact, preferred_color, budget_range, source, utm_source, utm_medium, utm_campaign, referrer, landing_page, website_honeypot } = req.body;

      // Anti-spam honeypot check
      if (website_honeypot) {
        return res.json({ success: true, message: 'Enquiry received' });
      }

      if (!name || !phone) {
        return res.status(400).json({ success: false, error: 'Name and Phone number are required' });
      }

      const created = dbStore.createLead({
        name,
        phone,
        email,
        city,
        product_id,
        product_name,
        product_sku,
        product_image,
        message,
        preferred_contact: preferred_contact || 'WhatsApp',
        preferred_color,
        budget_range,
        source: source || 'Website',
        utm_source,
        utm_medium,
        utm_campaign,
        referrer,
        landing_page
      });

      res.json({ success: true, lead: created });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  router.get('/leads', (req, res) => {
    try {
      const { status, source, search } = req.query;
      const leads = dbStore.getLeads({
        status: status as string,
        source: source as string,
        search: search as string
      });
      res.json({ success: true, leads });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  router.get('/leads/:id', (req, res) => {
    try {
      const lead = dbStore.getLeadById(req.params.id);
      if (!lead) {
        return res.status(404).json({ success: false, error: 'Lead not found' });
      }
      res.json({ success: true, lead });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  router.put('/leads/:id/status', (req, res) => {
    try {
      const { status } = req.body;
      const updated = dbStore.updateLeadStatus(req.params.id, status);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Lead not found' });
      }
      res.json({ success: true, lead: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  router.post('/leads/:id/notes', (req, res) => {
    try {
      const { note, created_by } = req.body;
      const updated = dbStore.addLeadNote(req.params.id, note, created_by || 'Admin');
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Lead not found' });
      }
      res.json({ success: true, lead: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  router.put('/leads/:id/followup', (req, res) => {
    try {
      const { follow_up_date } = req.body;
      const updated = dbStore.setLeadFollowUp(req.params.id, follow_up_date);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Lead not found' });
      }
      res.json({ success: true, lead: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // --- ANALYTICS ---
  router.get('/analytics', (req, res) => {
    try {
      const analytics = dbStore.getAnalytics();
      res.json({ success: true, analytics });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // --- TESTIMONIALS ---
  router.get('/testimonials', (req, res) => {
    try {
      const testimonials = dbStore.getTestimonials();
      res.json({ success: true, testimonials });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  router.post('/testimonials', (req, res) => {
    try {
      const created = dbStore.addTestimonial(req.body);
      res.json({ success: true, testimonial: created });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // --- ADMIN AUTH ---
  router.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    // Standard demo credentials or any email with 'admin123' or 'admin@saree.com'
    if (email === 'admin@saree.com' && (password === 'admin123' || password === 'admin')) {
      return res.json({
        success: true,
        token: 'token-demo-admin-session-saree-crm',
        user: {
          id: 'admin-1',
          email: 'admin@saree.com',
          name: 'Boutique Admin',
          role: 'owner'
        }
      });
    }

    if (email && password && password.length >= 6) {
      return res.json({
        success: true,
        token: `token-session-${Date.now()}`,
        user: {
          id: `admin-${Date.now()}`,
          email,
          name: email.split('@')[0],
          role: 'admin'
        }
      });
    }

    return res.status(401).json({ success: false, error: 'Invalid admin credentials. Default demo login: admin@saree.com / admin123' });
  });

  router.get('/auth/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.includes('token-')) {
      return res.json({
        success: true,
        user: {
          id: 'admin-1',
          email: 'admin@saree.com',
          name: 'Boutique Admin',
          role: 'owner'
        }
      });
    }
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  });

  app.use('/api', router);

  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
