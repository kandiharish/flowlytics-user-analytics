(function() {
  const BACKEND_URL = 'http://localhost:5000/api/events';
  
  function getOrCreateSessionId() {
    let sessionId = localStorage.getItem('flowlytics_session_id');
    if (!sessionId) {
      sessionId = 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      localStorage.setItem('flowlytics_session_id', sessionId);
    }
    return sessionId;
  }

  const sessionId = getOrCreateSessionId();

  function trackEvent(eventType, metadata = {}) {
    const event = {
      sessionId,
      eventType,
      pageUrl: window.location.pathname + window.location.search,
      timestamp: new Date().toISOString(),
      metadata
    };

    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(event)], { type: 'application/json' });
      navigator.sendBeacon(BACKEND_URL, blob);
    } else {
      fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
        keepalive: true
      }).catch(console.error);
    }
  }

  // Track page view
  trackEvent('page_view');

  // Track clicks
  document.addEventListener('click', function(e) {
    trackEvent('click', {
      x: e.clientX + window.scrollX,
      y: e.clientY + window.scrollY
    });
  }, { capture: true, passive: true });
})();
