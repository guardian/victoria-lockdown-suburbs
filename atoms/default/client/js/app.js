import { App } from 'shared/js/app'

fetch(`<%= path %>/victoria.topojson?t=${new Date().getTime()}`)
	.then(response => response.json())
	.then((data) => {

		new App(data)
		
	})