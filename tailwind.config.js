/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            objectPosition: {
                'hero': "50% 60%",
            },
            flex: {
                'fixed': '0 0 auto',
                'remain': '1 0 0'
            }
        },
    },
    plugins: [],
};
