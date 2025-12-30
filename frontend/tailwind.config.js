/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'wine-red': '#722F37',
                'rich-black': '#0A0A0A',
                'antique-gold': '#B8860B',
                // Keeping fallbacks for compatibility if needed, but primary are above
                champagne: '#fad6a5',
                charcoal: '#36454f',
                gold: '#d4af37',
            },
            fontFamily: {
                serif: ['"Cormorant Garamond"', 'serif'],
                sans: ['"Lato"', 'sans-serif'],
                script: ['"Great Vibes"', 'cursive'],
            },
        },
    },
    plugins: [],
}
