// ============================================
// DIGITAL BUSINESS HEALTH CHECK
// 10 questions across 4 categories
// Weighted scoring → specific recommendation
// ============================================

const HealthCheck = (() => {

  // ── Questions ───────────────────────────────────────────────────
  const questions = [

    // ── Category 1: Online Presence ──
    {
      id: 'website_exists',
      category: 'online',
      question: 'Does your business have a website?',
      options: [
        { label: 'No, we don\'t have one', sub: 'Customers find us through word of mouth or referrals only', value: 0 },
        { label: 'Sort of, it\'s outdated or hard to find', sub: 'There\'s something online but it doesn\'t reflect where we are now', value: 1 },
        { label: 'Yes, and customers use it', sub: 'It looks professional and people find and contact us through it', value: 3 }
      ]
    },
    {
      id: 'online_findability',
      category: 'online',
      question: 'When someone searches for your business online, what do they find?',
      options: [
        { label: 'Nothing, we don\'t show up', sub: 'No search results, no listings, nothing', value: 0 },
        { label: 'A social media page or a directory listing', sub: 'Something exists but it\'s not fully under our control', value: 1 },
        { label: 'A proper website with services and contact info', sub: 'Clear, accurate and up to date', value: 3 }
      ]
    },

    // ── Category 2: Lead Generation ──
    {
      id: 'how_customers_find',
      category: 'leads',
      question: 'How do new customers usually find you?',
      options: [
        { label: 'Word of mouth only', sub: 'If nobody refers us, nobody finds us', value: 0 },
        { label: 'Social media and WhatsApp groups', sub: 'We post and hope people see it', value: 1 },
        { label: 'Its a mix of online search, referrals and our website', sub: 'Multiple channels working together', value: 3 }
      ]
    },
    {
      id: 'contact_ease',
      category: 'leads',
      question: 'When someone wants to enquire, how easy is it to reach you?',
      options: [
        { label: 'They have to ask someone for our number', sub: 'There\'s no public way to contact us easily', value: 0 },
        { label: 'They find us on WhatsApp or Facebook', sub: 'It works but it\'s not seamless', value: 1 },
        { label: 'One click from our website with multiple ways to reach us', sub: 'WhatsApp button, email form, phone number all immediately visible', value: 3 }
      ]
    },

    // ── Category 3: Automation & Systems ──
    {
      id: 'tracking_system',
      category: 'automation',
      question: 'How do you track orders, bookings or client work?',
      options: [
        { label: 'In my head or on paper', sub: 'If I forget something, it\'s forgotten', value: 0 },
        { label: 'WhatsApp messages and Excel or a notebook', sub: 'I have to update it manually and it\'s always a bit behind', value: 1 },
        { label: 'A system that updates automatically', sub: 'When something happens, the record updates without anyone typing it in', value: 3 }
      ]
    },
    {
      id: 'repetitive_tasks',
      category: 'automation',
      question: 'How much time per week does your team spend on repetitive data tasks?',
      options: [
        { label: 'More than 5 hours', sub: 'Capturing orders, copying info, updating statuses manually', value: 0 },
        { label: '2 – 5 hours, it\'s manageable but annoying', sub: 'We\'ve accepted it as part of the job', value: 1 },
        { label: 'Less than 2 hours, most of it runs automatically', sub: 'Systems handle the routine work', value: 3 }
      ]
    },
    {
      id: 'customer_updates',
      category: 'automation',
      question: 'How do customers receive updates from you (confirmations, reminders, status updates)?',
      options: [
        { label: 'Someone types and sends them manually every time', sub: 'One of us has to stop what we\'re doing and send a message', value: 0 },
        { label: 'We have templates but still send them manually', sub: 'Faster than typing but still someone\'s job to do', value: 1 },
        { label: 'The system sends them automatically from events', sub: 'Order placed → confirmation sent. Delivery dispatched → customer notified. No human step.', value: 3 }
      ]
    },

    // ── Category 4: Business Visibility ──
    {
      id: 'monthly_performance',
      category: 'visibility',
      question: 'If someone asked "how\'s business this month vs last month?" How confident are you?',
      options: [
        { label: 'I\'d be guessing', sub: 'I have a feeling but no numbers to back it up', value: 0 },
        { label: 'I have a rough sense but not exact figures', sub: 'I know the direction but not the detail', value: 1 },
        { label: 'I can show you the numbers in under 2 minutes', sub: 'Revenue, margins, volume is all tracked and visible', value: 3 }
      ]
    },
    {
      id: 'product_margins',
      category: 'visibility',
      question: 'Do you know which products or services make you the most money?',
      options: [
        { label: 'Not really, I\'d have to calculate it', sub: 'Revenue yes, margin not really', value: 0 },
        { label: 'I have a sense of it from experience', sub: 'I know roughly but haven\'t run the numbers recently', value: 1 },
        { label: 'Yes, I track margin by product and review it regularly', sub: 'This informs what I promote and how I price', value: 3 }
      ]
    },
    {
      id: 'decision_making',
      category: 'visibility',
      question: 'How do you make important business decisions like pricing, hiring, promotions?',
      options: [
        { label: 'Gut feeling and experience', sub: 'I go with what feels right', value: 0 },
        { label: 'Based on what happened last time', sub: 'Historical judgement, not current data', value: 1 },
        { label: 'Based on data I look at regularly', sub: 'I track the right numbers and let them inform the decision', value: 3 }
      ]
    }
  ];

  // ── Category config ─────────────────────────────────────────────
  const categories = {
    online: {
      label: 'Online Presence',
      maxPoints: 6,
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
      lowLabel: 'Your business is hard to find online',
      highLabel: 'Strong online presence',
      recommendation: {
        service: 'Website Design & Development',
        href: 'services.html#website-design',
        why: 'Customers can\'t buy from a business they can\'t find. A professional website fixes your discoverability immediately and gives people a reason to choose you over whoever shows up first.',
        cta: 'View Website Packages'
      }
    },
    leads: {
      label: 'Lead Generation',
      maxPoints: 6,
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
      lowLabel: 'New customers are hard to reach you',
      highLabel: 'Strong lead generation',
      recommendation: {
        service: 'Website Design & Development',
        href: 'services.html#website-design',
        why: 'If getting found and getting enquiries is the problem, the fix is a properly structured website with clear CTAs, WhatsApp button, enquiry form and contact info visible above the fold.',
        cta: 'View Website Packages'
      }
    },
    automation: {
      label: 'Automation & Systems',
      maxPoints: 9,
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,
      lowLabel: 'Too much manual work is costing you time',
      highLabel: 'Well automated',
      recommendation: {
        service: 'Google Sheets Automation',
        href: 'services.html#google-sheets-automation',
        why: 'Manual data work compounds - every order captured by hand, every status updated manually, every update typed individually adds up to hours a week that could run automatically. A custom Sheets system fixes this without changing how you work.',
        cta: 'View Automation Services'
      }
    },
    visibility: {
      label: 'Business Visibility',
      maxPoints: 9,
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
      lowLabel: 'You\'re flying blind on business performance',
      highLabel: 'Strong business visibility',
      recommendation: {
        service: 'Business Clarity',
        href: 'portfolio.html#case-studies',
        why: 'Decisions made on gut feeling are slower and riskier than they need to be. Business Clarity gives you a live dashboard, automated monthly decision briefs and quarterly reviews which are all inside your Google account, no new tools to learn.',
        cta: 'See Business Clarity'
      }
    }
  };

  // ── State ───────────────────────────────────────────────────────
  let currentStep = 0; // -1 = intro, 0-9 = questions, 10 = results
  let answers = {};
  let state = 'intro'; // intro | quiz | results

  // ── Score calculation ───────────────────────────────────────────
  function calculateScores() {
    const catScores = {};
    let totalRaw = 0;
    let totalMax = 0;

    Object.entries(categories).forEach(([key, cat]) => {
      const catQuestions = questions.filter(q => q.category === key);
      const raw = catQuestions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
      const normalised = Math.round((raw / cat.maxPoints) * 25);
      catScores[key] = { raw, max: cat.maxPoints, score: normalised };
      totalRaw += raw;
      totalMax += cat.maxPoints;
    });

    const overallScore = Math.round((totalRaw / totalMax) * 100);
    return { catScores, overallScore };
  }

  function getWeakestCategory(catScores) {
    return Object.entries(catScores)
      .sort((a, b) => a[1].score - b[1].score)[0][0];
  }

  function getScoreLabel(score) {
    if (score >= 75) return { label: 'Strong', color: '#28CA42', desc: 'Your business is in good shape across all areas.' };
    if (score >= 50) return { label: 'Growing', color: '#90A4C2', desc: 'Some areas are working well but one or two need attention.' };
    if (score >= 25) return { label: 'Developing', color: '#E9E0C9', desc: 'There are clear gaps that are costing you time or customers.' };
    return { label: 'Early Stage', color: '#FF8C5A', desc: 'Significant opportunities across most areas.' };
  }

  // ── Render ──────────────────────────────────────────────────────
  function renderIntro() {
    return `
        <div class="hc-intro">

            <h1 class="hc-intro-headline">
            Digital Business<br />
            <span class="hc-intro-accent">Health Check</span>
            </h1>

            <p class="hc-intro-body">
            10 questions across 4 areas of your business which includes online presence,
            lead generation, automation and business visibility.
            You get a score, a clear picture of what's strongest and
            weakest, and a specific recommendation for what to fix first.
            </p>

            <div class="hc-intro-cats">
            </div>

            <button class="btn btn-primary hc-start-btn" id="hcStart">
            Start the Health Check
            </button>

            <p class="hc-intro-note">
            Your answers are not stored. This runs entirely in your browser.
            </p>

        </div>
        `;
  }

  function renderProgress() {
    const pct = (currentStep / questions.length) * 100;
    const cat = categories[questions[currentStep]?.category];
    return `
      <div class="hc-progress-bar">
        <div class="hc-progress-fill" style="width:${pct}%"></div>
      </div>
      <div class="hc-progress-meta">
        <span class="hc-progress-cat">
          ${cat?.icon || ''}
          ${cat?.label || ''}
        </span>
        <span class="hc-progress-count">
          ${currentStep + 1} / ${questions.length}
        </span>
      </div>
    `;
  }

  function renderQuestion() {
    const q = questions[currentStep];
    return `
      ${renderProgress()}
      <div class="hc-question-block">
        <h2 class="hc-question">${q.question}</h2>
        <div class="hc-options">
          ${q.options.map((opt, i) => `
            <button class="hc-option" data-value="${opt.value}" data-qid="${q.id}">
              <span class="hc-option-marker">${['A', 'B', 'C'][i]}</span>
              <span class="hc-option-text">
                <span class="hc-option-label">${opt.label}</span>
                <span class="hc-option-sub">${opt.sub}</span>
              </span>
            </button>
          `).join('')}
        </div>
        ${currentStep > 0 ? `
          <button class="hc-back" id="hcBack">← Previous question</button>
        ` : ''}
      </div>
    `;
  }

  function renderResults() {
    const { catScores, overallScore } = calculateScores();
    const weakest = getWeakestCategory(catScores);
    const scoreLabel = getScoreLabel(overallScore);
    const rec = categories[weakest].recommendation;

    return `
      <div class="hc-results">

        <div class="hc-results-score-row">
          <div class="hc-score-dial">
            <svg class="hc-score-svg" viewBox="0 0 120 120">
              <circle class="hc-score-track" cx="60" cy="60" r="50"
                fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="10"/>
              <circle class="hc-score-arc" cx="60" cy="60" r="50"
                fill="none" stroke="${scoreLabel.color}" stroke-width="10"
                stroke-dasharray="${2 * Math.PI * 50}"
                stroke-dashoffset="${2 * Math.PI * 50 * (1 - overallScore / 100)}"
                stroke-linecap="round"
                transform="rotate(-90 60 60)"/>
            </svg>
            <div class="hc-score-value">${overallScore}</div>
          </div>
          <div class="hc-score-meta">
            <div class="hc-score-label" style="color:${scoreLabel.color}">
              ${scoreLabel.label}
            </div>
            <p class="hc-score-desc">${scoreLabel.desc}</p>
          </div>
        </div>

        <div class="hc-cat-bars">
          ${Object.entries(catScores).map(([key, data]) => {
            const cat = categories[key];
            const pct = data.score;
            const isWeakest = key === weakest;
            return `
              <div class="hc-cat-bar-row ${isWeakest ? 'hc-cat-bar-row--weak' : ''}">
                <div class="hc-cat-bar-header">
                  <div class="hc-cat-bar-name">
                    ${cat.icon}
                    <span>${cat.label}</span>
                    ${isWeakest ? '<span class="hc-weak-badge">Needs attention</span>' : ''}
                  </div>
                  <span class="hc-cat-bar-score">${data.score}/25</span>
                </div>
                <div class="hc-cat-bar-track">
                  <div class="hc-cat-bar-fill" style="width:${pct * 4}%"
                       data-target="${pct * 4}"></div>
                </div>
                <p class="hc-cat-bar-label">
                  ${data.score <= 8 ? categories[key].lowLabel : categories[key].highLabel}
                </p>
              </div>
            `;
          }).join('')}
        </div>

        <div class="hc-recommendation">
          <div class="hc-rec-eyebrow">Recommended next step</div>
          <h3 class="hc-rec-headline">
            ${categories[weakest].label} is your biggest opportunity.
          </h3>
          <p class="hc-rec-body">${rec.why}</p>
          <div class="hc-rec-service">
            <span class="hc-rec-service-label">Relevant service</span>
            <span class="hc-rec-service-name">${rec.service}</span>
          </div>
          <div class="hc-rec-actions">
            <a href="${rec.href}" class="btn btn-primary">${rec.cta}</a>
            <a href="mailto:ulikhayamazibuko@gmail.com?subject=Health%20Check%20Result%20%E2%80%94%20${encodeURIComponent(categories[weakest].label)}&body=Hi%20Ulikhaya%2C%20I%20completed%20the%20Digital%20Business%20Health%20Check%20and%20scored%20${overallScore}%2F100.%20My%20weakest%20area%20was%20${encodeURIComponent(categories[weakest].label)}.%20I%27d%20like%20to%20discuss%20what%20to%20do%20about%20it."
               class="btn btn-secondary">
              Discuss My Results
            </a>
          </div>
        </div>

        <button class="hc-restart" id="hcRestart">
          ← Retake the health check
        </button>

      </div>
    `;
  }

  // ── Mount & update ──────────────────────────────────────────────
  function mount() {
    const container = document.getElementById('hcContainer');
    if (!container) return;
    render(container);
  }

  function render(container) {
    if (state === 'intro')   container.innerHTML = renderIntro();
    if (state === 'quiz')    container.innerHTML = renderQuestion();
    if (state === 'results') {
      container.innerHTML = renderResults();
      // Animate bars after paint
      requestAnimationFrame(() => {
        document.querySelectorAll('.hc-cat-bar-fill').forEach(bar => {
          bar.style.transition = 'width 0.8s cubic-bezier(0.4,0,0.2,1)';
        });
      });
    }
    bindEvents(container);
  }

  function bindEvents(container) {
    // Start button
    container.querySelector('#hcStart')?.addEventListener('click', () => {
      state = 'quiz';
      currentStep = 0;
      answers = {};
      trackEvent('health_check_started');
      render(container);
    });

    // Answer options
    container.querySelectorAll('.hc-option').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.hc-option').forEach(b =>
          b.classList.remove('selected')
        );
        btn.classList.add('selected');

        setTimeout(() => {
          const qid = btn.dataset.qid;
          const value = parseInt(btn.dataset.value);
          answers[qid] = value;
          currentStep++;

          trackEvent('health_check_step', {
            step: currentStep,
            question: qid,
            answer_value: value
          });

          if (currentStep >= questions.length) {
            const { overallScore } = calculateScores();
            const weakest = getWeakestCategory(calculateScores().catScores);
            state = 'results';
            trackEvent('health_check_completed', {
              score: overallScore,
              weakest_category: weakest,
              recommendation: categories[weakest].recommendation.service
            });
          }
          render(container);
        }, 180);
      });
    });

    // Back button
    container.querySelector('#hcBack')?.addEventListener('click', () => {
      currentStep--;
      const qid = questions[currentStep].id;
      delete answers[qid];
      render(container);
    });

    // Restart
    container.querySelector('#hcRestart')?.addEventListener('click', () => {
      state = 'intro';
      currentStep = 0;
      answers = {};
      render(container);
    });
  }

  return { mount };

})();

document.addEventListener('DOMContentLoaded', () => HealthCheck.mount());