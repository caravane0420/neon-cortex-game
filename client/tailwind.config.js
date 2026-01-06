/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                neon: {
                    blue: '#00FFFF',
                    pink: '#FF00FF',
                    green: '#00FF00',
                    yellow: '#FFFF00',
                }
            }
        },
    },
    plugins: [],
}
