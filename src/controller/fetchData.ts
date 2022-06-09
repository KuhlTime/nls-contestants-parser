import axios from 'axios'
import parse from '../util/NLSTableParser'

/**
 * Fetches the data from the website
 */
async function fetchData(url: string) {
	const response = await axios.get(url)

	const body = response.data

	return parse(body)
}

export default fetchData
