import db from '../config/database.js';

// ========================================
// CONFIGURAÇÕES GERAIS
// ========================================

export const getConfig = async (req, res) => {
  try {
    const [config] = await db.query('SELECT * FROM site_config WHERE id = 1');
    res.json(config[0] || {});
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    res.status(500).json({ msg: 'Erro ao buscar configurações' });
  }
};

export const updateConfig = async (req, res) => {
  try {
    const {
      logo_url,
      favicon_url,
      primary_color,
      secondary_color,
      whatsapp_number,
      whatsapp_message,
      seo_title,
      seo_description,
      seo_keywords
    } = req.body;

    await db.query(
      `UPDATE site_config SET 
        logo_url = ?,
        favicon_url = ?,
        primary_color = ?,
        secondary_color = ?,
        whatsapp_number = ?,
        whatsapp_message = ?,
        seo_title = ?,
        seo_description = ?,
        seo_keywords = ?,
        updated_at = NOW()
      WHERE id = 1`,
      [logo_url, favicon_url, primary_color, secondary_color, whatsapp_number, whatsapp_message, seo_title, seo_description, seo_keywords]
    );

    res.json({ msg: 'Configurações atualizadas com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    res.status(500).json({ msg: 'Erro ao atualizar configurações' });
  }
};

// ========================================
// HERO SECTION
// ========================================

export const getHero = async (req, res) => {
  try {
    const [hero] = await db.query('SELECT * FROM site_hero WHERE id = 1');
    res.json(hero[0] || {});
  } catch (error) {
    console.error('Erro ao buscar hero:', error);
    res.status(500).json({ msg: 'Erro ao buscar hero' });
  }
};

export const updateHero = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      cta_primary_text,
      cta_primary_link,
      cta_whatsapp_text,
      background_gradient_from,
      background_gradient_to
    } = req.body;

    await db.query(
      `UPDATE site_hero SET 
        title = ?,
        subtitle = ?,
        description = ?,
        cta_primary_text = ?,
        cta_primary_link = ?,
        cta_whatsapp_text = ?,
        background_gradient_from = ?,
        background_gradient_to = ?,
        updated_at = NOW()
      WHERE id = 1`,
      [title, subtitle, description, cta_primary_text, cta_primary_link, cta_whatsapp_text, background_gradient_from, background_gradient_to]
    );

    res.json({ msg: 'Hero atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar hero:', error);
    res.status(500).json({ msg: 'Erro ao atualizar hero' });
  }
};

// ========================================
// BENEFÍCIOS
// ========================================

export const getBenefits = async (req, res) => {
  try {
    const [benefits] = await db.query(
      'SELECT * FROM site_benefits WHERE is_active = TRUE ORDER BY display_order'
    );
    res.json(benefits);
  } catch (error) {
    console.error('Erro ao buscar benefícios:', error);
    res.status(500).json({ msg: 'Erro ao buscar benefícios' });
  }
};

export const createBenefit = async (req, res) => {
  try {
    const { icon, title, description, display_order } = req.body;

    const [result] = await db.query(
      'INSERT INTO site_benefits (icon, title, description, display_order) VALUES (?, ?, ?, ?)',
      [icon, title, description, display_order || 0]
    );

    res.json({ msg: 'Benefício criado com sucesso', id: result.insertId });
  } catch (error) {
    console.error('Erro ao criar benefício:', error);
    res.status(500).json({ msg: 'Erro ao criar benefício' });
  }
};

export const updateBenefit = async (req, res) => {
  try {
    const { id } = req.params;
    const { icon, title, description, display_order } = req.body;

    await db.query(
      'UPDATE site_benefits SET icon = ?, title = ?, description = ?, display_order = ? WHERE id = ?',
      [icon, title, description, display_order, id]
    );

    res.json({ msg: 'Benefício atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar benefício:', error);
    res.status(500).json({ msg: 'Erro ao atualizar benefício' });
  }
};

export const deleteBenefit = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM site_benefits WHERE id = ?', [id]);
    res.json({ msg: 'Benefício deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar benefício:', error);
    res.status(500).json({ msg: 'Erro ao deletar benefício' });
  }
};

// ========================================
// ESTATÍSTICAS
// ========================================

export const getStatistics = async (req, res) => {
  try {
    const [statistics] = await db.query(
      'SELECT * FROM site_statistics WHERE is_active = TRUE ORDER BY display_order'
    );
    res.json(statistics);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ msg: 'Erro ao buscar estatísticas' });
  }
};

export const updateStatistic = async (req, res) => {
  try {
    const { id } = req.params;
    const { number, label, display_order } = req.body;

    await db.query(
      'UPDATE site_statistics SET number = ?, label = ?, display_order = ? WHERE id = ?',
      [number, label, display_order, id]
    );

    res.json({ msg: 'Estatística atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar estatística:', error);
    res.status(500).json({ msg: 'Erro ao atualizar estatística' });
  }
};

// ========================================
// SERVIÇOS
// ========================================

export const getServices = async (req, res) => {
  try {
    const [services] = await db.query(
      'SELECT * FROM site_services WHERE is_active = TRUE ORDER BY display_order'
    );
    res.json(services);
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    res.status(500).json({ msg: 'Erro ao buscar serviços' });
  }
};

export const createService = async (req, res) => {
  try {
    const { name, description, price, features, is_highlighted, display_order } = req.body;

    const [result] = await db.query(
      'INSERT INTO site_services (name, description, price, features, is_highlighted, display_order) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, JSON.stringify(features), is_highlighted || false, display_order || 0]
    );

    res.json({ msg: 'Serviço criado com sucesso', id: result.insertId });
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    res.status(500).json({ msg: 'Erro ao criar serviço' });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, features, is_highlighted, display_order } = req.body;

    await db.query(
      'UPDATE site_services SET name = ?, description = ?, price = ?, features = ?, is_highlighted = ?, display_order = ? WHERE id = ?',
      [name, description, price, JSON.stringify(features), is_highlighted, display_order, id]
    );

    res.json({ msg: 'Serviço atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    res.status(500).json({ msg: 'Erro ao atualizar serviço' });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM site_services WHERE id = ?', [id]);
    res.json({ msg: 'Serviço deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar serviço:', error);
    res.status(500).json({ msg: 'Erro ao deletar serviço' });
  }
};

// ========================================
// PASSOS (COMO FUNCIONA)
// ========================================

export const getSteps = async (req, res) => {
  try {
    const [steps] = await db.query(
      'SELECT * FROM site_steps WHERE is_active = TRUE ORDER BY display_order'
    );
    res.json(steps);
  } catch (error) {
    console.error('Erro ao buscar passos:', error);
    res.status(500).json({ msg: 'Erro ao buscar passos' });
  }
};

export const updateStep = async (req, res) => {
  try {
    const { id } = req.params;
    const { icon, title, description, display_order } = req.body;

    await db.query(
      'UPDATE site_steps SET icon = ?, title = ?, description = ?, display_order = ? WHERE id = ?',
      [icon, title, description, display_order, id]
    );

    res.json({ msg: 'Passo atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar passo:', error);
    res.status(500).json({ msg: 'Erro ao atualizar passo' });
  }
};

// ========================================
// LINKS DO RODAPÉ
// ========================================

export const getFooterLinks = async (req, res) => {
  try {
    const [links] = await db.query(
      'SELECT * FROM site_footer_links WHERE is_active = TRUE ORDER BY category, display_order'
    );
    res.json(links);
  } catch (error) {
    console.error('Erro ao buscar links do rodapé:', error);
    res.status(500).json({ msg: 'Erro ao buscar links do rodapé' });
  }
};

// ========================================
// FORMULÁRIO DE CONTATO
// ========================================

export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const ip_address = req.ip;
    const user_agent = req.get('user-agent');

    await db.query(
      'INSERT INTO contact_submissions (name, email, phone, message, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, phone, message, ip_address, user_agent]
    );

    res.json({ msg: 'Mensagem enviada com sucesso! Entraremos em contato em breve.' });
  } catch (error) {
    console.error('Erro ao enviar contato:', error);
    res.status(500).json({ msg: 'Erro ao enviar mensagem' });
  }
};

export const getContactSubmissions = async (req, res) => {
  try {
    const [submissions] = await db.query(
      'SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 100'
    );
    res.json(submissions);
  } catch (error) {
    console.error('Erro ao buscar submissões:', error);
    res.status(500).json({ msg: 'Erro ao buscar submissões' });
  }
};

// ========================================
// DADOS COMPLETOS DA LANDING PAGE
// ========================================

export const getLandingPageData = async (req, res) => {
  try {
    const [config] = await db.query('SELECT * FROM site_config WHERE id = 1');
    const [hero] = await db.query('SELECT * FROM site_hero WHERE id = 1');
    const [benefits] = await db.query('SELECT * FROM site_benefits WHERE is_active = TRUE ORDER BY display_order');
    const [statistics] = await db.query('SELECT * FROM site_statistics WHERE is_active = TRUE ORDER BY display_order');
    const [services] = await db.query('SELECT * FROM site_services WHERE is_active = TRUE ORDER BY display_order');
    const [steps] = await db.query('SELECT * FROM site_steps WHERE is_active = TRUE ORDER BY display_order');
    const [footerLinks] = await db.query('SELECT * FROM site_footer_links WHERE is_active = TRUE ORDER BY category, display_order');

    res.json({
      config: config[0] || {},
      hero: hero[0] || {},
      benefits,
      statistics,
      services,
      steps,
      footerLinks
    });
  } catch (error) {
    console.error('Erro ao buscar dados da landing page:', error);
    res.status(500).json({ msg: 'Erro ao buscar dados da landing page' });
  }
};
