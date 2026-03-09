(function () {
    const ICON_MAP = {
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

    const DEFAULT_CONFIG = {
        home: {
            intro: 'Hi im anthony a chill guy whos passionate about empowering others through tech education,i have a unique knowledge of web fundamentals,digital litracy and best praticies in online security,building with purpose and solving problems making programs&tools user friendly,lightweight...',
            hireButtonText: 'Hire me',
        },
        pages: {
            projectsSubtitle: 'Showcase of My Best Work',
            servicesSubtitle: 'What I Can Offer For You',
            skillsSubtitle: 'Professional Skills & Expertise',
            educationSubtitle: 'Academic Background & Learning Journey',
            experienceSubtitle: 'Professional Work & Projects',
            aboutIntro: 'I am a Lagos-based full-stack web developer with a B.Sc. in Computer Science. My background in self-taught technology combined with formal education gives me a practical approach to solving complex problems and building scalable systems.',
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
            message: 'Hi Anthony, I came from your portfolio and I would like to discuss a project with you.',
            cvUrl: '',
        },
        social: {
            linkedin: { enabled: true, url: 'https://www.linkedin.com/in/taiwo-lemboye-82548a3a0' },
            github: { enabled: true, url: 'https://github.com/GamELordS234' },
            instagram: { enabled: true, url: 'https://www.instagram.com/anthony_xir/' },
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
            throw new Error(`Non-JSON response from settings API: ${preview}`);
        }
    }

    async function fetchSiteConfig() {
        try {
            const response = await fetch('/.netlify/functions/get-site-config');
            const data = await parseJsonResponse(response);
            if (!response.ok || !data || !data.config) {
                return DEFAULT_CONFIG;
            }
            return mergeConfig(DEFAULT_CONFIG, data.config);
        } catch (error) {
            console.error('Failed to fetch site config:', error);
            return DEFAULT_CONFIG;
        }
    }

    function setText(id, value) {
        const element = document.getElementById(id);
        if (!element || typeof value !== 'string') return;
        element.textContent = value;
    }

    function setLink(id, href, text) {
        const element = document.getElementById(id);
        if (!element) return;
        if (typeof href === 'string' && href.trim()) {
            element.setAttribute('href', href);
            element.setAttribute('target', '_blank');
            element.setAttribute('rel', 'noopener noreferrer');
        }
        if (typeof text === 'string' && text.trim()) {
            element.textContent = text;
        }
    }

    function getWhatsappLink(config) {
        const rawNumber = (config.hireMe && config.hireMe.whatsappNumber) || '';
        const number = rawNumber.replace(/[^\d]/g, '') || '2348072608976';
        const message = (config.hireMe && config.hireMe.message) || '';
        const cvUrl = (config.hireMe && config.hireMe.cvUrl) || '';
        const fullMessage = cvUrl ? `${message}\n\nCV: ${cvUrl}` : message;
        return `https://wa.me/${number}?text=${encodeURIComponent(fullMessage)}`;
    }

    function renderSocialIcons(containerId, config) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const entries = Object.entries(config.social || {}).filter(([key, item]) => {
            if (!item || !item.enabled) return false;
            if (!item.url || !item.url.trim()) return false;
            return Boolean(ICON_MAP[key]);
        });

        if (!entries.length) {
            container.innerHTML = '';
            return;
        }

        container.innerHTML = '';
        entries.forEach(([key, item]) => {
            const anchor = document.createElement('a');
            anchor.href = item.url;
            anchor.target = '_blank';
            anchor.rel = 'noopener noreferrer';
            anchor.className = 'dynamic-social-link';
            anchor.setAttribute('aria-label', key);

            const icon = document.createElement('i');
            icon.className = ICON_MAP[key];
            anchor.appendChild(icon);
            container.appendChild(anchor);
        });
    }

    function applyHome(config) {
        setText('home-intro-text', config.home.intro);

        const hireBtn = document.getElementById('hire-me-btn');
        if (hireBtn) {
            hireBtn.textContent = config.home.hireButtonText || 'Hire me';
            hireBtn.href = getWhatsappLink(config);
            hireBtn.target = '_blank';
            hireBtn.rel = 'noopener noreferrer';
        }

        renderSocialIcons('home-social-icons', config);
    }

    function applyPageContent(config) {
        setText('projects-subtitle', config.pages.projectsSubtitle);
        setText('services-subtitle', config.pages.servicesSubtitle);
        setText('skills-subtitle', config.pages.skillsSubtitle);
        setText('education-subtitle', config.pages.educationSubtitle);
        setText('experience-subtitle', config.pages.experienceSubtitle);
        setText('about-intro-text', config.pages.aboutIntro);
        setText('contact-subtitle', config.pages.contactSubtitle);
    }

    function applyContact(config) {
        const email = config.contact.email || '';
        const phone = config.contact.phone || '';
        const location = config.contact.location || '';
        const availability = config.contact.availability || '';

        setText('contact-location-text', location);
        setText('contact-availability-text', availability);

        setLink('contact-email-link', email ? `mailto:${email}` : '', email);
        setLink('contact-phone-link', phone ? `tel:${phone.replace(/\s+/g, '')}` : '', phone);

        renderSocialIcons('contact-social-icons', config);
    }

    function applyConfig(config) {
        applyHome(config);
        applyPageContent(config);
        applyContact(config);
    }

    async function initializeSiteConfig() {
        const config = await fetchSiteConfig();
        window.__SITE_CONFIG__ = config;
        applyConfig(config);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSiteConfig);
    } else {
        initializeSiteConfig();
    }
})();
