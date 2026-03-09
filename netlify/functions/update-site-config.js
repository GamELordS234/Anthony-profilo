const { createClient } = require('@supabase/supabase-js');

const CONFIG_KEY = 'site_config';

const DEFAULT_CONFIG = {
  home: {
    intro:
      'Hi im anthony a chill guy whos passionate about empowering others through tech education,i have a unique knowledge of web fundamentals,digital litracy and best praticies in online security,building with purpose and solving problems making programs&tools user friendly,lightweight...',
    hireButtonText: 'Hire me',
  },
  pages: {
    projectsSubtitle: 'Showcase of My Best Work',
    servicesSubtitle: 'What I Can Offer For You',
    skillsSubtitle: 'Professional Skills & Expertise',
    educationSubtitle: 'Academic Background & Learning Journey',
    experienceSubtitle: 'Professional Work & Projects',
    aboutIntro:
      'I am a Lagos-based full-stack web developer with a B.Sc. in Computer Science. My background in self-taught technology combined with formal education gives me a practical approach to solving complex problems and building scalable systems.',
    contactSubtitle: "I'd Love to Hear From You",
  },
  contact: {
    email: 'anthony@example.com',
    phone: '+234 (123) 456-7890',
    location: 'Lagos, Nigeria',
    availability: 'Monday - Friday, 9 AM - 5 PM (WAT)',
  },
  hireMe: {
    whatsappNumber: '2348072608976',
    message:
      'Hi Anthony, I came from your portfolio and I would like to discuss a project with you.',
    cvUrl: '',
  },
  social: {
    linkedin: {
      enabled: true,
      url: 'https://www.linkedin.com/in/taiwo-lemboye-82548a3a0',
    },
    github: { enabled: true, url: 'https://github.com/GamELordS234' },
    instagram: {
      enabled: true,
      url: 'https://www.instagram.com/anthony_xir/',
    },
    twitter: { enabled: false, url: '' },
    facebook: { enabled: false, url: '' },
    youtube: { enabled: false, url: '' },
    tiktok: { enabled: false, url: '' },
    whatsapp: { enabled: false, url: 'https://wa.me/2348072608976' },
    telegram: { enabled: false, url: '' },
    discord: { enabled: false, url: '' },
    snapchat: { enabled: false, url: '' },
    pinterest: { enabled: false, url: '' },
    threads: { enabled: false, url: '' },
    reddit: { enabled: false, url: '' },
    medium: { enabled: false, url: '' },
    behance: { enabled: false, url: '' },
    dribbble: { enabled: false, url: '' },
  },
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
    body: JSON.stringify(body),
  };
}

function mergeConfig(base, incoming) {
  if (!incoming || typeof incoming !== 'object') {
    return base;
  }

  const output = Array.isArray(base) ? [...base] : { ...base };

  Object.keys(incoming).forEach((key) => {
    const baseValue = output[key];
    const incomingValue = incoming[key];

    if (
      baseValue &&
      typeof baseValue === 'object' &&
      !Array.isArray(baseValue) &&
      incomingValue &&
      typeof incomingValue === 'object' &&
      !Array.isArray(incomingValue)
    ) {
      output[key] = mergeConfig(baseValue, incomingValue);
    } else {
      output[key] = incomingValue;
    }
  });

  return output;
}

function normalizeString(value, maxLength = 4000) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

function sanitizeConfig(config) {
  const merged = mergeConfig(DEFAULT_CONFIG, config || {});

  return {
    home: {
      intro: normalizeString(merged.home.intro, 6000),
      hireButtonText: normalizeString(merged.home.hireButtonText, 50) || 'Hire me',
    },
    pages: {
      projectsSubtitle: normalizeString(merged.pages.projectsSubtitle, 300),
      servicesSubtitle: normalizeString(merged.pages.servicesSubtitle, 300),
      skillsSubtitle: normalizeString(merged.pages.skillsSubtitle, 300),
      educationSubtitle: normalizeString(merged.pages.educationSubtitle, 300),
      experienceSubtitle: normalizeString(merged.pages.experienceSubtitle, 300),
      aboutIntro: normalizeString(merged.pages.aboutIntro, 6000),
      contactSubtitle: normalizeString(merged.pages.contactSubtitle, 300),
    },
    contact: {
      email: normalizeString(merged.contact.email, 200),
      phone: normalizeString(merged.contact.phone, 100),
      location: normalizeString(merged.contact.location, 200),
      availability: normalizeString(merged.contact.availability, 300),
    },
    hireMe: {
      whatsappNumber: normalizeString(merged.hireMe.whatsappNumber, 30),
      message: normalizeString(merged.hireMe.message, 1000),
      cvUrl: normalizeString(merged.hireMe.cvUrl, 1000),
    },
    social: Object.keys(DEFAULT_CONFIG.social).reduce((acc, key) => {
      const item = merged.social[key] || {};
      acc[key] = {
        enabled: Boolean(item.enabled),
        url: normalizeString(item.url, 1000),
      };
      return acc;
    }, {}),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return response(200, { success: true });
  }

  if (event.httpMethod !== 'POST') {
    return response(405, { error: 'Method Not Allowed' });
  }

  try {
    const { password, config } = JSON.parse(event.body || '{}');

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return response(401, { error: 'Unauthorized' });
    }

    const safeConfig = sanitizeConfig(config);

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    const { error } = await supabase
      .from('personal_data')
      .upsert(
        {
          key: CONFIG_KEY,
          value: JSON.stringify(safeConfig),
        },
        { onConflict: 'key' }
      );

    if (error) {
      throw new Error(`Supabase upsert error: ${error.message}`);
    }

    return response(200, {
      success: true,
      config: safeConfig,
    });
  } catch (error) {
    console.error(error);
    return response(500, { error: error.message });
  }
};
