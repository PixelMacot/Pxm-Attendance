import { VitePWA } from "vite-plugin-pwa";
// import { createFAVICON } from 'vite-plugin-favicon'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    workbox: {
        importScripts: ["./firebase-messaging-sw.js"],
    },
    base: "./",
    plugins: [
        react(),
        
        VitePWA({
            registerType: 'prompt',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'maskable-icon.png'],
            manifest: {
                name: 'PixelMascot',
                short_name: 'PxM',
                description: 'Pixel Mascot Attendance Website',
                theme_color: '#FFFFFF',
                start_url: '/',
                icons: [
                    {
                        src: "/icon-48x48.png",
                        sizes: "48x48",
                        type: "image/png",
                        purpose: "maskable"
                    },
                    {
                        src: "/icon-72x72-.png",
                        sizes: "72x72",
                        type: "image/png",
                        purpose: "maskable"
                    },
                    {
                        src: "/icon-96x96.png",
                        sizes: "96x96",
                        type: "image/png",
                        purpose: "maskable"

                    },
                    {
                        src: "/icon-128x128.png",
                        sizes: "128x128",
                        type: "image/png",
                        purpose: "maskable"
                    },
                    {
                        src: "/icon-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "maskable"
                    },
                    {
                        src: "/icon-384x384.png",
                        sizes: "384x384",
                        type: "image/png",
                        purpose: "maskable"
                    },
                    {
                        src: "/icon-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable"
                    },
                    {
                        src: "/icon-48x48.png",
                        sizes: "48x48",
                        type: "image/png"

                    },
                    {
                        src: "/icon-72x72.png",
                        sizes: "72x72",
                        type: "image/png"

                    },
                    {
                        src: "/icon-96x96.png",
                        sizes: "96x96",
                        type: "image/png"


                    },
                    {
                        src: "/icon-128x128.png",
                        sizes: "128x128",
                        type: "image/png"

                    },
                    {
                        src: "/icon-192x192.png",
                        sizes: "192x192",
                        type: "image/png"

                    },
                    {
                        src: "/icon-384x384.png",
                        sizes: "384x384",
                        type: "image/png"

                    },
                    {
                        src: "/icon-512x512.png",
                        sizes: "512x512",
                        type: "image/png"

                    }
                ]
            },
        })
    ],
})
