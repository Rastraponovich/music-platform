/** @type {import('next').NextConfig} */
const path = require("path")

const nextConfig = {
    webpack: (config, options) => {
        config.resolve.alias["@"] = path.resolve(__dirname)
        return config
    },

    reactStrictMode: true,
}

module.exports = nextConfig
