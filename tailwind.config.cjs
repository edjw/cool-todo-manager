/** @type {import("tailwindcss").Config} */
module.exports = {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {},
	},
	plugins: [
		require("@tailwindcss/forms"),
		require('@tailwindcss/typography'),
		function ({ addComponents }) {
			addComponents({
				"button": {
					userSelect: "none",
				},
				"dialog::backdrop": {
					backdropFilter: "blur(8px)",
				}
			});
		},
	],
}
