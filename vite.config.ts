import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(({command}) => {
  return {
    plugins: [
      {
        name: 'vite-client-error-shield',
        transform(code, id) {
          if (id.includes('@vite/client') || id.includes('vite/dist/client/client.mjs')) {
            return code.replace(
              'ws.send(JSON.stringify(data));',
              'ws?.send?.(JSON.stringify(data));'
            );
          }
        },
        transformIndexHtml: {
          order: 'pre',
          handler() {
            return [
              {
                tag: 'script',
                injectTo: 'head-prepend',
                children: `
                  (function() {
                    try {
                      if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
                        navigator.serviceWorker.getRegistrations().then(function(regs) {
                          if (regs) for (var i = 0; i < regs.length; i++) regs[i].unregister();
                        });
                      }
                      if (typeof caches !== 'undefined' && caches.keys) {
                        caches.keys().then(function(names) {
                          if (names) for (var i = 0; i < names.length; i++) caches.delete(names[i]);
                        });
                      }
                    } catch (_) {}

                    var isViteSendErr = function(err) {
                      if (!err) return false;
                      var str = '';
                      try {
                        str = (err.message || '') + ' ' + (err.stack || '') + ' ' + (typeof err === 'string' ? err : '');
                      } catch (_) {}
                      return str.indexOf("reading 'send'") !== -1 ||
                             str.indexOf("reading \"send\"") !== -1 ||
                             str.indexOf("@vite/client") !== -1 ||
                             (str.indexOf("[vite]") !== -1 && (str.indexOf("websocket") !== -1 || str.indexOf("send") !== -1 || str.indexOf("connect") !== -1));
                    };

                    var origConsoleError = console.error;
                    console.error = function() {
                      var fullText = '';
                      for (var i = 0; i < arguments.length; i++) {
                        var a = arguments[i];
                        if (a) {
                          try {
                            fullText += ' ' + (a.message || '') + ' ' + (a.stack || '') + ' ' + (typeof a === 'string' ? a : '' + a);
                          } catch (_) {}
                        }
                      }
                      if (
                        fullText.indexOf("reading 'send'") !== -1 ||
                        fullText.indexOf("reading \"send\"") !== -1 ||
                        fullText.indexOf("@vite/client") !== -1 ||
                        (fullText.indexOf("[vite]") !== -1 && (fullText.indexOf("websocket") !== -1 || fullText.indexOf("send") !== -1 || fullText.indexOf("connect") !== -1))
                      ) {
                        return;
                      }
                      return origConsoleError.apply(console, arguments);
                    };

                    window.addEventListener('error', function(e) {
                      if (isViteSendErr(e.error) || isViteSendErr(e)) {
                        if (e.preventDefault) e.preventDefault();
                        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                        return true;
                      }
                    }, true);

                    window.addEventListener('unhandledrejection', function(e) {
                      if (isViteSendErr(e.reason)) {
                        if (e.preventDefault) e.preventDefault();
                        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                        return true;
                      }
                    }, true);
                  })();
                `,
              },
            ];
          },
        },
      },
      react(),
      tailwindcss(),
      ...(command === 'build'
        ? [
            VitePWA({
              registerType: 'autoUpdate',
              includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png', 'hero-tactical-bg.jpg'],
              manifest: {
                id: '/',
                name: 'Be Coach - Football Tactical Board & Studio',
                short_name: 'Be Coach',
                description: 'Elite football tactical board and studio with interactive 11v11 formations, tactical drawing, animated keyframes, and matchday analysis.',
                theme_color: '#00df82',
                background_color: '#0a0a0a',
                display: 'standalone',
                orientation: 'any',
                start_url: '/',
                scope: '/',
                categories: ['sports', 'utilities', 'productivity'],
                icons: [
                  {
                    src: '/pwa-192x192.png',
                    sizes: '192x192',
                    type: 'image/png',
                    purpose: 'any',
                  },
                  {
                    src: '/pwa-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'any',
                  },
                  {
                    src: '/pwa-maskable-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'maskable',
                  },
                ],
              },
              workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,jpg}'],
              },
            }),
          ]
        : []),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
