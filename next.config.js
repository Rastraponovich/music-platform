/** @type {import('next').NextConfig} */
const path = require("path")

const ContentSecurityPolicy = `
  media-src * data: localhost*;
  
`

const headersArray = [
    {
        key: "Content-Security-Policy",
        value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
    },
]

const nextConfig = {
    webpack: (config, options) => {
        config.resolve.alias["@"] = path.resolve(__dirname)
        return config
    },
    images: {
        domains: ["localhost"],
    },

    // async headers() {
    //     return [
    //         {
    //             // Apply these headers to all routes in your application.
    //             source: "/:path*",
    //             headers: headersArray,
    //         },
    //     ]
    // },

    reactStrictMode: true,
}

module.exports = nextConfig
