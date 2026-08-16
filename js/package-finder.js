// ============================================
// PACKAGE FINDER — Modal quiz
// Maps 3 answers to Landing / Starter / Business
// ============================================

const PackageFinder = (() => {

  // ── Data ───────────────────────────────────────────────────────
  const questions = [
    {
      id: 'situation',
      question: 'How would you describe your current situation?',
      hint: 'Pick the one that fits best.',
      options: [
        {
          label: 'I need a quick, clean online presence',
          sub: 'One page, fast, professional so people can find and contact me',
          value: 1
        },
        {
          label: 'I want a complete website for my business',
          sub: 'Multiple pages, proper structure, showcases what I do',
          value: 2
        },
        {
          label: 'I need a full site with specific features',
          sub: 'Bookings, integrations, analytics, custom functionality',
          value: 3
        }
      ]
    },
    {
      id: 'pages',
      question: 'How many pages does your site need?',
      hint: 'Think about: Home, About, Services, Portfolio, Contact — each is a page.',
      options: [
        {
          label: '1 page',
          sub: 'Everything on one long scroll so that its fast and focused',
          value: 1
        },
        {
          label: '2 – 6 pages',
          sub: 'Home, About, Services, Portfolio, Contact etc.',
          value: 2
        },
        {
          label: '7+ pages',
          sub: 'Full site with blog, team, gallery, location pages',
          value: 3
        }
      ]
    },
    {
      id: 'features',
      question: 'What features matter most to you?',
      hint: 'Pick the one closest to what you need.',
      options: [
        {
          label: 'Contact form and WhatsApp button',
          sub: 'Customers can reach me and that\'s enough',
          value: 1
        },
        {
          label: 'Portfolio, testimonials and click-to-call',
          sub: 'I want to show my work and make it easy to get in touch',
          value: 2
        },
        {
          label: 'Booking system, analytics or custom integrations',
          sub: 'I need the site to actively do something, not just look good',
          value: 3
        }
      ]
    }
  ];

  const packages = {
    landing: {
      name: 'Landing Page',
      price: 'R3,500',
      note: 'Once-off · First month care included',
      description: 'A single, focused page that looks professional and converts visitors into enquiries. Fast to build, fast to launch.',
      features: [
        '5–7 sections on one page',
        'Mobile responsive',
        'Contact form + WhatsApp button',
        'Basic SEO setup',
        '2 revision rounds'
      ],
      href: 'services.html#packages-pricing',
      quoteHref: 'mailto:ulikhayamazibuko@gmail.com?subject=Landing%20Page%20Package%20Inquiry&body=Hi%20Ulikhaya%2C%20I%20completed%20the%20package%20finder%20and%20was%20recommended%20the%20Landing%20Page%20package.%20I%27d%20like%20to%20discuss%20my%20project.'
    },
    starter: {
      name: 'Starter',
      price: 'R6,500',
      note: 'Once-off · First month care included',
      description: 'A complete multi-page website built to represent your business properly which is structured, styled and ready to grow with you.',
      features: [
        '6–8 pages including Portfolio and Testimonials',
        'Custom styling to match your brand',
        'Enhanced SEO with schema markup',
        'Contact form, WhatsApp + click-to-call',
        '3 revision rounds'
      ],
      href: 'services.html#packages-pricing',
      quoteHref: 'mailto:ulikhayamazibuko@gmail.com?subject=Starter%20Package%20Inquiry&body=Hi%20Ulikhaya%2C%20I%20completed%20the%20package%20finder%20and%20was%20recommended%20the%20Starter%20package.%20I%27d%20like%20to%20discuss%20my%20project.'
    },
    business: {
      name: 'Business',
      price: 'R12,000',
      note: 'Once-off · First month care included',
      description: 'A full-featured website built for a business that needs the site to actively work — bookings, reporting, integrations and all.',
      features: [
        '9–12 pages including Blog, Team, Portfolio',
        'Advanced local SEO + Google Analytics',
        'Appointment or quote request system',
        'Monthly analytics report included',
        '4 revision rounds'
      ],
      href: 'services.html#packages-pricing',
      quoteHref: 'mailto:ulikhayamazibuko@gmail.com?subject=Business%20Package%20Inquiry&body=Hi%20Ulikhaya%2C%20I%20completed%20the%20package%20finder%20and%20was%20recommended%20the%20Business%20package.%20I%27d%20like%20to%20discuss%20my%20project.'
    }
  };

  // ── State ──────────────────────────────────────────────────────
  let currentStep = 0;
  let answers = [];
  let modal, overlay, panelContent;

  // ── Scoring ────────────────────────────────────────────────────
  function getRecommendation() {
    const total = answers.reduce((sum, val) => sum + val, 0);
    if (total <= 4) return packages.landing;
    if (total <= 7) return packages.starter;
    return packages.business;
  }

  // ── Render helpers ─────────────────────────────────────────────
  function renderProgress() {
    const pct = ((currentStep) / questions.length) * 100;
    return `
      <div class="pf-progress-track">
        <div class="pf-progress-fill" style="width: ${pct}%"></div>
      </div>
      <div class="pf-step-label">
        <span class="pf-step-count">
          ${currentStep < questions.length
            ? `Question ${currentStep + 1} of ${questions.length}`
            : 'Your recommendation'}
        </span>
        ${currentStep > 0 && currentStep < questions.length
          ? `<button class="pf-back-btn" id="pfBack">← Back</button>`
          : ''}
      </div>
    `;
  }

  function renderQuestion(q) {
    return `
      ${renderProgress()}
      <div class="pf-question-block">
        <h3 class="pf-question">${q.question}</h3>
        <p class="pf-hint">${q.hint}</p>
        <div class="pf-options">
          ${q.options.map((opt, i) => `
            <button class="pf-option" data-value="${opt.value}" data-index="${i}">
              <span class="pf-option-label">${opt.label}</span>
              <span class="pf-option-sub">${opt.sub}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderResult() {
    const pkg = getRecommendation();
    return `
      ${renderProgress()}
      <div class="pf-result-block">
        <div class="pf-result-eyebrow">Recommended for you</div>
        <div class="pf-result-name">${pkg.name} Package</div>
        <div class="pf-result-price">
          ${pkg.price}
          <span class="pf-result-note">${pkg.note}</span>
        </div>
        <p class="pf-result-desc">${pkg.description}</p>
        <ul class="pf-result-features">
          ${pkg.features.map(f => `
            <li class="pf-result-feature">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2"
                   stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              ${f}
            </li>
          `).join('')}
        </ul>
        <div class="pf-result-actions">
          <a href="${pkg.quoteHref}" class="btn btn-primary pf-cta-primary">
            Get a Quote for This Package
          </a>
          <a href="${pkg.href}" class="btn btn-ghost pf-cta-secondary">
            View Full Package Details
          </a>
        </div>
        <button class="pf-restart" id="pfRestart">
          ← Start over
        </button>
      </div>
    `;
  }

  // ── Render panel ───────────────────────────────────────────────
  function render() {
    const isResult = currentStep >= questions.length;
    panelContent.innerHTML = isResult
      ? renderResult()
      : renderQuestion(questions[currentStep]);
    bindPanelEvents();
  }

  // ── Events ─────────────────────────────────────────────────────
  function bindPanelEvents() {
    // Option buttons
    panelContent.querySelectorAll('.pf-option').forEach(btn => {
      btn.addEventListener('click', () => {
        // Highlight selection briefly
        panelContent.querySelectorAll('.pf-option').forEach(b =>
          b.classList.remove('selected')
        );
        btn.classList.add('selected');

        // Advance after short delay so user sees selection
        setTimeout(() => {
          answers[currentStep] = parseInt(btn.dataset.value);
          currentStep++;

          // Track each question answered
          trackEvent('package_finder_step', {
            step: currentStep,
            answer: btn.querySelector('.pf-option-label')?.textContent?.trim()
          });

          if (currentStep >= questions.length) {
            const pkg = getRecommendation();
            trackEvent('package_finder_completed', {
              package: pkg.name,
              price: pkg.price
            });
          }

          render();
        }, 180);
      });
    });

    // Back button
    document.getElementById('pfBack')?.addEventListener('click', () => {
      currentStep--;
      answers.pop();
      render();
    });

    // Restart
    document.getElementById('pfRestart')?.addEventListener('click', () => {
      currentStep = 0;
      answers = [];
      trackEvent('package_finder_started');
      render();
    });
  }

  // ── Modal open / close ─────────────────────────────────────────
  function open() {
    modal.classList.add('open');
    document.body.classList.add('pf-open');
    currentStep = 0;
    answers = [];
    trackEvent('package_finder_started');
    render();

    // Focus trap
    setTimeout(() => {
      panelContent.querySelector('.pf-option, .pf-cta-primary')?.focus();
    }, 300);
  }

  function close() {
    modal.classList.remove('open');
    document.body.classList.remove('pf-open');
  }

  // ── Init ───────────────────────────────────────────────────────
  function init() {
    // Build modal HTML
    modal = document.createElement('div');
    modal.className = 'pf-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Package finder');
    modal.innerHTML = `
      <div class="pf-overlay" id="pfOverlay"></div>
      <div class="pf-panel">
        <div class="pf-panel-header">
          <div class="pf-panel-title">
            <span class="service-deliverable-text">Package Finder</span>
            <p class="pf-panel-sub">3 questions in 30 seconds</p>
          </div>
          <button class="pf-close" id="pfClose" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="pf-panel-content" id="pfContent"></div>
      </div>
    `;
    document.body.appendChild(modal);

    panelContent = document.getElementById('pfContent');
    overlay = document.getElementById('pfOverlay');

    // Close triggers
    document.getElementById('pfClose').addEventListener('click', close);
    overlay.addEventListener('click', close);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('open')) close();
    });

    // Trigger buttons
    document.querySelectorAll('[data-package-finder]').forEach(btn => {
      btn.addEventListener('click', open);
    });
  }

  return { init, open, close };

})();

// Initialise when DOM is ready
document.addEventListener('DOMContentLoaded', () => PackageFinder.init());