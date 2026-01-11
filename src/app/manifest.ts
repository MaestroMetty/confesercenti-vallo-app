import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Energy Team',
    short_name: 'Energy Team',
    description: 'Energy Team - Fidelity Card App',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#15803d',
    icons: [
      // Highest resolution first - using iOS icons for better quality on Android
      {
        src: '/ios/1024.png',
        sizes: '1024x1024',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/ios/1024.png',
        sizes: '1024x1024',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/ios/512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/ios/512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/ios/256.png',
        sizes: '256x256',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/ios/256.png',
        sizes: '256x256',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/ios/192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/ios/192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/ios/180.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/ios/167.png',
        sizes: '167x167',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/ios/152.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/ios/144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/ios/128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/ios/120.png',
        sizes: '120x120',
        type: 'image/png',
        purpose: 'any',
      },
      // Windows icons - highest resolution first
      {
        src: '/windows11/Square150x150Logo.scale-400.png',
        sizes: '600x600',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/windows11/Square150x150Logo.scale-200.png',
        sizes: '300x300',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/windows11/Square150x150Logo.scale-150.png',
        sizes: '225x225',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/windows11/Square150x150Logo.scale-125.png',
        sizes: '188x188',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/windows11/Square150x150Logo.scale-100.png',
        sizes: '150x150',
        type: 'image/png',
        purpose: 'any',
      },
      // Android-specific icons for compatibility (fallback)
      {
        src: '/android/android-launchericon-512-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/android/android-launchericon-192-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/android/android-launchericon-144-144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/android/android-launchericon-96-96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/android/android-launchericon-72-72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/android/android-launchericon-48-48.png',
        sizes: '48x48',
        type: 'image/png',
        purpose: 'any',
      }
    ],
  }
}
