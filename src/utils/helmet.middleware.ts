import helmet from 'helmet';

export default helmet({
  frameguard: false,
  contentSecurityPolicy: {
    directives: { defaultSrc: ["'self'"] },
  },
  referrerPolicy: { policy: 'same-origin' },
  featurePolicy: {
    features: {
      documentWrite: ["'none'"],
      syncXhr: ["'none'"],
    },
  },
});
