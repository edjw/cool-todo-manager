/** @type {import("prettier").Config} */
export default {
    plugins: ["prettier-plugin-astro"],
    overrides: [
        {
            files: "*.astro",
            options: {
                parser: "astro",
            },
        },
        {
            files: "*.tsx",
            options: {
                parser: "typescript",
            },
        },
    ],
    semi: true,
    singleQuote: false,
    arrowParens: "always",
};