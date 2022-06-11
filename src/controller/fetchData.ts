import axios from 'axios'
import parse from '../util/NLSTableParser'

let refreshTimeHours = 8
let lastUpdate: Date | undefined = undefined
let dataSnapshot: any | undefined = undefined

/**
 * Fetches the data from the website
 */
async function fetchData(url: string) {
	if (
		lastUpdate == undefined ||
		lastUpdate.getTime() >= new Date().getTime() + refreshTimeHours * 60 /*m*/ * 60 /*s*/ * 1000 /*ms*/
	) {
		console.log('chache not available || data older then ' + refreshTimeHours + ' hours, updating cache...')
		const response = await axios.get(url)
		const body = response.data

		dataSnapshot = parse(body)
		lastUpdate = new Date()
	} else {
		console.log('chache available, using cache...')
	}

	return dataSnapshot
}

export default fetchData
