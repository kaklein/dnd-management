import * as Sentry from "@sentry/react";

// const PRODUCTION_HOSTS = [
//   'dnd-management-347a9.web.app',
//   'dnd-management-347a9.firebaseapp.com'
// ];

// const STAGING_HOST_PREFIX = 'dnd-management-347a9--pr';

// const getEnvName = () => {
//   const hostName = window.location.hostname;
//   if (PRODUCTION_HOSTS.includes(hostName)) return 'production';
//   if (hostName.startsWith(STAGING_HOST_PREFIX)) return 'staging';
//   return 'dev';
// }

// const environment = getEnvName();

Sentry.init({
  dsn: "https://c6aa681e23ec35502120c5f55e27d071@o4509268104773632.ingest.us.sentry.io/4509268105691136",
  environment: 'staging',
  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/react/configuration/options/#sendDefaultPii
  sendDefaultPii: true
});