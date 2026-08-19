// ============================================
// VIDEO LIGHTBOX
// Click a trigger → YouTube video opens in modal
// Add data-video="VIDEO_ID" to any trigger
// ============================================

const VideoLightbox = (() => {

  let modal, frame, overlay;

  function build() {
    modal = document.createElement('div');
    modal.className = 'vl-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Video player');
    modal.innerHTML = `
      <div class="vl-overlay" id="vlOverlay"></div>
      <div class="vl-panel">
        <button class="vl-close" id="vlClose" aria-label="Close video">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <div class="vl-frame-wrap">
          <iframe
            id="vlFrame"
            class="vl-frame"
            src=""
            title="Video explainer"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
        <div class="vl-caption" id="vlCaption"></div>
      </div>
    `;
    document.body.appendChild(modal);

    frame   = document.getElementById('vlFrame');
    overlay = document.getElementById('vlOverlay');

    document.getElementById('vlClose').addEventListener('click', close);
    overlay.addEventListener('click', close);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('open')) close();
    });
  }

  function open(videoId, caption = '') {
    if (!videoId || videoId === 'PLACEHOLDER') {
      console.warn('Video ID not set yet');
      return;
    }
    frame.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    document.getElementById('vlCaption').textContent = caption;
    modal.classList.add('open');
    document.body.classList.add('vl-open');
    trackEvent('video_opened', { video_id: videoId, caption });
  }

  function close() {
    modal.classList.remove('open');
    document.body.classList.remove('vl-open');
    // Stop playback by clearing src
    setTimeout(() => { frame.src = ''; }, 250);
  }

  function init() {
    build();

    document.querySelectorAll('[data-video]').forEach(trigger => {
      const videoId = trigger.dataset.video;

      // Hide triggers with no video ID set yet
      if (!videoId || videoId === 'PLACEHOLDER') {
        trigger.style.display = 'none';
        return;
      }

      trigger.addEventListener('click', e => {
        e.preventDefault();
        open(videoId, trigger.dataset.videoCaption || '');
      });
    });
  }

  return { init, open, close };

})();

document.addEventListener('DOMContentLoaded', () => VideoLightbox.init());