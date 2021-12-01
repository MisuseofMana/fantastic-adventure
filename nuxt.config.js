export default {
	target: 'static',
    server: {
		port: 8000 // default: 3000
	},
	components: true,
	head: {
		title: 'Fantastic Adventure',
		htmlAttrs: {
			lang: 'en',
		},
		meta: [
			{name: 'viewport', content: 'width=device-width, intial-scale=1'}
		],
		link: [
			{rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Frijole|Oswald&display=swap'}
		]
	},
	buildModules: [
		'@nuxtjs/vuetify',
	  ]
}