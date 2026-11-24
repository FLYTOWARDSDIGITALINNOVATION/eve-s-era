export const trackEvent = (eventName, eventData = {}) => {
  if (window.fbq) {
    window.fbq('track', eventName, eventData);
  }
};
