const SOCIAL_ICON_DEFS = [
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'github', label: 'GitHub' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'twitter', label: 'X (Twitter)' },
    { key: 'facebook', label: 'Facebook' },
    { key: 'youtube', label: 'YouTube' },
    { key: 'tiktok', label: 'TikTok' },
    { key: 'whatsapp', label: 'WhatsApp' },
    { key: 'telegram', label: 'Telegram' },
    { key: 'discord', label: 'Discord' },
    { key: 'snapchat', label: 'Snapchat' },
    { key: 'pinterest', label: 'Pinterest' },
    { key: 'threads', label: 'Threads' },
    { key: 'reddit', label: 'Reddit' },
    { key: 'medium', label: 'Medium' },
    { key: 'behance', label: 'Behance' },
    { key: 'dribbble', label: 'Dribbble' },
];

const SOCIAL_ICON_CLASS_MAP = {
    linkedin: 'fab fa-linkedin',
    github: 'fab fa-github',
    instagram: 'fab fa-instagram',
    twitter: 'fab fa-x-twitter',
    facebook: 'fab fa-facebook-f',
    youtube: 'fab fa-youtube',
    tiktok: 'fab fa-tiktok',
    whatsapp: 'fab fa-whatsapp',
    telegram: 'fab fa-telegram-plane',
    discord: 'fab fa-discord',
    snapchat: 'fab fa-snapchat-ghost',
    pinterest: 'fab fa-pinterest-p',
    threads: 'fab fa-threads',
    reddit: 'fab fa-reddit-alien',
    medium: 'fab fa-medium-m',
    behance: 'fab fa-behance',
    dribbble: 'fab fa-dribbble',
};

const DEFAULT_SETTINGS = {
    home: {
        intro: 'Hi im anthony a chill guy whos passionate about empowering others through tech education,i have a unique knowledge of web fundamentals,digital litracy and best praticies in online security,building with purpose and solving problems making programs&tools user friendly,lightweight...',
        hireButtonText: 'Hire me',
    },
    hireMe: {
        whatsappNumber: '2348072608976',
        message: 'Hi Anthony, I came from your portfolio and I would like to discuss a project with you.',
        cvUrl: '',
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
    social: SOCIAL_ICON_DEFS.reduce((acc, item) => {
        acc[item.key] = { enabled: false, url: '' };
        return acc;
    }, {
        linkedin: { enabled: true, url: 'https://www.linkedin.com/in/taiwo-lemboye-82548a3a0' },
        github: { enabled: true, url: 'https://github.com/GamELordS234' },
        instagram: { enabled: true, url: 'https://www.instagram.com/anthony_xir/' },
    }),
};

function byId(id) {
    return document.getElementById(id);
}

function setStatus(elementId, text, type) {
    const el = byId(elementId);
    if (!el) return;
    el.textContent = text;
    el.className = `admin-message ${type}`;
}

function createSocialRows(config) {
    const container = byId('social-settings-grid');
    if (!container) return;
    container.innerHTML = '';

    SOCIAL_ICON_DEFS.forEach((item) => {
        const row = document.createElement('div');
        row.className = 'social-setting-row';

        const left = document.createElement('div');
        left.className = 'social-setting-left';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `social-enabled-${item.key}`;
        checkbox.checked = Boolean(config.social?.[item.key]?.enabled);

        const label = document.createElement('label');
        label.setAttribute('for', checkbox.id);
        const icon = document.createElement('i');
        icon.className = `${SOCIAL_ICON_CLASS_MAP[item.key] || 'fas fa-link'} admin-social-icon`;
        label.appendChild(icon);
        label.append(` ${item.label}`);

        left.appendChild(checkbox);
        left.appendChild(label);

        const urlInput = document.createElement('input');
        urlInput.type = 'url';
        urlInput.id = `social-url-${item.key}`;
        urlInput.placeholder = `${item.label} URL`;
        urlInput.value = config.social?.[item.key]?.url || '';

        row.appendChild(left);
        row.appendChild(urlInput);
        container.appendChild(row);
    });
}

function mergeConfig(base, incoming) {
    if (!incoming || typeof incoming !== 'object') {
        return base;
    }
    const output = Array.isArray(base) ? base.slice() : { ...base };
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

async function parseJsonResponse(response) {
    const raw = await response.text();
    try {
        return JSON.parse(raw);
    } catch (error) {
        const preview = raw.slice(0, 120).replace(/\s+/g, ' ').trim();
        throw new Error(
            `Settings API returned non-JSON response. Make sure Netlify Functions are deployed. Response preview: ${preview}`
        );
    }
}

function fillWebsiteForm(config) {
    byId('home-intro').value = config.home?.intro || '';
    byId('home-hire-text').value = config.home?.hireButtonText || '';

    byId('whatsapp-number').value = config.hireMe?.whatsappNumber || '';
    byId('whatsapp-message').value = config.hireMe?.message || '';
    byId('cv-url').value = config.hireMe?.cvUrl || '';

    byId('projects-subtitle').value = config.pages?.projectsSubtitle || '';
    byId('services-subtitle').value = config.pages?.servicesSubtitle || '';
    byId('skills-subtitle').value = config.pages?.skillsSubtitle || '';
    byId('education-subtitle').value = config.pages?.educationSubtitle || '';
    byId('experience-subtitle').value = config.pages?.experienceSubtitle || '';
    byId('about-intro').value = config.pages?.aboutIntro || '';
    byId('contact-subtitle').value = config.pages?.contactSubtitle || '';

    byId('contact-email').value = config.contact?.email || '';
    byId('contact-phone').value = config.contact?.phone || '';
    byId('contact-location').value = config.contact?.location || '';
    byId('contact-availability').value = config.contact?.availability || '';

    createSocialRows(config);
}

function collectWebsiteForm() {
    const social = {};
    SOCIAL_ICON_DEFS.forEach((item) => {
        social[item.key] = {
            enabled: byId(`social-enabled-${item.key}`).checked,
            url: byId(`social-url-${item.key}`).value.trim(),
        };
    });

    return {
        home: {
            intro: byId('home-intro').value.trim(),
            hireButtonText: byId('home-hire-text').value.trim() || 'Hire me',
        },
        hireMe: {
            whatsappNumber: byId('whatsapp-number').value.trim(),
            message: byId('whatsapp-message').value.trim(),
            cvUrl: byId('cv-url').value.trim(),
        },
        pages: {
            projectsSubtitle: byId('projects-subtitle').value.trim(),
            servicesSubtitle: byId('services-subtitle').value.trim(),
            skillsSubtitle: byId('skills-subtitle').value.trim(),
            educationSubtitle: byId('education-subtitle').value.trim(),
            experienceSubtitle: byId('experience-subtitle').value.trim(),
            aboutIntro: byId('about-intro').value.trim(),
            contactSubtitle: byId('contact-subtitle').value.trim(),
        },
        contact: {
            email: byId('contact-email').value.trim(),
            phone: byId('contact-phone').value.trim(),
            location: byId('contact-location').value.trim(),
            availability: byId('contact-availability').value.trim(),
        },
        social,
    };
}

async function loadWebsiteSettings() {
    try {
        const response = await fetch('/.netlify/functions/get-site-config');
        const data = await parseJsonResponse(response);
        if (!response.ok) {
            throw new Error(data.error || 'Failed to load settings');
        }
        fillWebsiteForm(mergeConfig(DEFAULT_SETTINGS, data.config || {}));
        setStatus('settings-message', 'Website settings loaded.', 'success');
    } catch (error) {
        fillWebsiteForm(DEFAULT_SETTINGS);
        setStatus('settings-message', `Error loading settings: ${error.message}`, 'error');
    }
}

async function saveWebsiteSettings(event) {
    event.preventDefault();
    const password = byId('settings-password').value.trim();
    if (!password) {
        setStatus('settings-message', 'Admin password is required to save.', 'error');
        return;
    }

    try {
        const config = collectWebsiteForm();
        const response = await fetch('/.netlify/functions/update-site-config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password, config }),
        });
        const data = await parseJsonResponse(response);
        if (!response.ok) {
            throw new Error(data.error || 'Failed to save settings');
        }
        fillWebsiteForm(data.config || config);
        setStatus('settings-message', 'Website settings saved successfully.', 'success');
    } catch (error) {
        setStatus('settings-message', `Save failed: ${error.message}`, 'error');
    }
}

async function submitAIData(event) {
    event.preventDefault();

    const key = byId('key').value.trim();
    const value = byId('value').value.trim();
    const password = byId('password').value.trim();

    if (!key || !value || !password) {
        setStatus('ai-message', 'Please fill all AI update fields.', 'error');
        return;
    }

    try {
        const response = await fetch('/.netlify/functions/update-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ key, value, password }),
        });
        const data = await parseJsonResponse(response);

        if (response.ok) {
            setStatus('ai-message', 'AI data updated successfully.', 'success');
            byId('data-form').reset();
        } else {
            setStatus('ai-message', data.error || 'Error updating AI data.', 'error');
        }
    } catch (error) {
        setStatus('ai-message', `Network error: ${error.message}`, 'error');
    }
}

function initializeAdmin() {
    const aiForm = byId('data-form');
    if (aiForm) aiForm.addEventListener('submit', submitAIData);

    const siteForm = byId('site-settings-form');
    if (siteForm) siteForm.addEventListener('submit', saveWebsiteSettings);

    const reloadBtn = byId('reload-settings');
    if (reloadBtn) {
        reloadBtn.addEventListener('click', () => {
            loadWebsiteSettings();
        });
    }

    fillWebsiteForm(DEFAULT_SETTINGS);
    loadWebsiteSettings();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAdmin);
} else {
    initializeAdmin();
}
