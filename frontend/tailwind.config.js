/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
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
