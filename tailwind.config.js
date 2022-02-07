module.exports = {
    content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            backgroundImage: {
                "hero-pattern": "url('/img/hero-bg.jpg')",
            },
        },
    },
    plugins: [require("@tailwindcss/typography"), require("daisyui")],
}
