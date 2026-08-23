/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './App.{js,jsx,ts,tsx}',
        './_layout.tsx',
        './app/**/*.{js,jsx,ts,tsx}',
    ],
    presets: [require('nativewind/preset')],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: 'rgb(var(--color-primary) / <alpha-value>)',
                secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
                background: 'rgb(var(--color-background) / <alpha-value>)',
                text: 'rgb(var(--color-text) / <alpha-value>)',
            },
        },
    },
    plugins: [],
};
