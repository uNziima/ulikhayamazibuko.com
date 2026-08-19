// ============================================
// ARCHITECTURE MAP
// Click a node → detail panel updates
// ============================================

const ArchitectureMap = (() => {

  const nodes = {
    website: {
      num: '01',
      title: 'Website',
      tagline: 'Where customers find you',
      body: 'Your public face is the one thing people find on Google and share with their friends. Built to load fast, work on any phone and make it obvious how to get in touch. It also collects enquiries and feeds them into everything downstream.',
      built: ['HTML', 'CSS', 'Vanilla JavaScript', 'Vercel / Cloudflare'],
      service: 'Website Design & Development',
      href: 'services.html#website-design'
    },
    backend: {
      num: '02',
      title: 'Backend',
      tagline: 'The logic that runs it',
      body: 'The part nobody sees but everything depends on. It validates what comes in, applies your business rules, decides what happens next and triggers the right actions. When an order arrives, the backend is what turns it into a task, a notification and a record without anyone lifting a finger.',
      built: ['Java', 'REST APIs', 'Webhooks', 'Railway'],
      service: 'Backend Development',
      href: 'services.html#backend-development'
    },
    data: {
      num: '03',
      title: 'Data Layer',
      tagline: 'Where everything lives',
      body: 'Every order, every status, every customer detail stored in one place which is structured, consistent and readable by both the system and by you. For most small businesses this is Google Sheets, because you already know how to use it and it costs nothing.',
      built: ['Google Sheets API', 'Apps Script', 'SQL databases where needed'],
      service: 'Google Sheets Automation',
      href: 'services.html#google-sheets-automation'
    },
    automation: {
      num: '04',
      title: 'Automation',
      tagline: 'The work that runs itself',
      body: 'The rules that fire without anyone remembering to fire them. Order confirmed → customer notified. Status changed → record updated. End of month → report generated. This is where the hours-per-week savings actually come from.',
      built: ['Apps Script triggers', 'Scheduled jobs', 'Event-driven workflows'],
      service: 'Google Sheets Automation',
      href: 'services.html#google-sheets-automation'
    },
    whatsapp: {
      num: '05',
      title: 'WhatsApp',
      tagline: 'How customers hear from you',
      body: 'Mostouth African businesses run on WhatsApp so the system meets customers where they already are. Orders come in through WhatsApp, confirmations go out through WhatsApp, delivery updates arrive on WhatsApp. No app to download, no account to create.',
      built: ['WhatsApp Business API', 'Meta for Developers', 'Webhooks'],
      service: 'Backend Development',
      href: 'services.html#backend-development'
    },
    dashboard: {
      num: '06',
      title: 'Dashboard',
      tagline: 'What you see',
      body: 'One link, bookmarked on your phone. Revenue, orders, margin, trends that are current and comparable to your own history. Plus an automated monthly brief that tells you what to do about what it shows, not just what happened.',
      built: ['Google Looker Studio', 'Automated reporting', 'Client-owned data'],
      service: 'Business Clarity',
      href: 'portfolio.html#case-studies'
    }
  };

  let detailPanel, nodeButtons;
  let activeNode = null;

  function renderDetail(key) {
    const n = nodes[key];
    detailPanel.innerHTML = `
      <div class="arch-detail-inner">
        <div class="arch-detail-header">
          <span class="arch-detail-num">${n.num}</span>
          <div class="arch-detail-titles">
            <h3 class="arch-detail-title">${n.title}</h3>
            <span class="arch-detail-tagline">${n.tagline}</span>
          </div>
        </div>
        <p class="arch-detail-body">${n.body}</p>
        <div class="arch-detail-built">
          <span class="arch-detail-built-label">Built with</span>
          <div class="arch-detail-tags">
            ${n.built.map(b => `<span class="tag">${b}</span>`).join('')}
          </div>
        </div>
        <a href="${n.href}" class="arch-detail-link">
          ${n.service}
          <span class="arch-detail-arrow">→</span>
        </a>
      </div>
    `;
    detailPanel.classList.add('active');
  }

  function init() {
    detailPanel = document.getElementById('archDetail');
    nodeButtons = document.querySelectorAll('.arch-node');

    if (!detailPanel || !nodeButtons.length) return;

    nodeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.node;

        // Toggle off if clicking the active node
        if (activeNode === key) {
          btn.classList.remove('active');
          detailPanel.classList.remove('active');
          activeNode = null;
          setTimeout(() => {
            detailPanel.innerHTML = `
              <div class="arch-detail-placeholder">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="1.5"
                     stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span>Click any step above to see what it does</span>
              </div>
            `;
          }, 200);
          return;
        }

        nodeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeNode = key;
        renderDetail(key);

        trackEvent('architecture_node_clicked', { node: key });
      });
    });
  }

  return { init };

})();

document.addEventListener('DOMContentLoaded', () => ArchitectureMap.init());
