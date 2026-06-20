(function() {
  const BACKEND_URL = 'http://localhost:5000/api/events';
  const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
  const BATCH_INTERVAL_MS = 3000; // 3 seconds
  
  let eventQueue = [];
  
  function getOrCreateSessionId() {
    const now = Date.now();
    let sessionId = localStorage.getItem('flowlytics_session_id');
    let lastActivity = localStorage.getItem('flowlytics_last_activity');
    
    if (!sessionId || !lastActivity || (now - parseInt(lastActivity, 10)) > SESSION_TIMEOUT_MS) {
      sessionId = 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + now;
      localStorage.setItem('flowlytics_session_id', sessionId);
    }
    
    localStorage.setItem('flowlytics_last_activity', now.toString());
    return sessionId;
  }

  function queueEvent(eventType, metadata = {}) {
    const sessionId = getOrCreateSessionId();
    const event = {
      sessionId,
      eventType,
      pageUrl: window.location.pathname + window.location.search,
      timestamp: new Date().toISOString(),
      metadata
    };
    eventQueue.push(event);
  }

  function flushEvents() {
    if (eventQueue.length === 0) return;
    
    const batch = [...eventQueue];
    eventQueue = [];
    
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(batch)], { type: 'application/json' });
      navigator.sendBeacon(BACKEND_URL, blob);
    } else {
      fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batch),
        keepalive: true
      }).catch(console.error);
    }
  }

  // Flush events every N seconds
  setInterval(flushEvents, BATCH_INTERVAL_MS);

  // Flush remaining events before user leaves
  window.addEventListener('beforeunload', flushEvents);
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushEvents();
  });

  // Track page view
  queueEvent('page_view');

  // Track clicks
  document.addEventListener('click', function(e) {
    queueEvent('click', {
      x: e.clientX + window.scrollX,
      y: e.clientY + window.scrollY,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight
    });
  }, { capture: true, passive: true });
})();
