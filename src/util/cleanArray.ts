/**
 * A function to cleanup an array of string values, in case there are dublicates or
 * null values inside the array
 * @param values The array of values that should be cleaned
 * @returns Returns a cleaned array of strings without empty `null` values.
 */
export default function cleanArray<T>(values: Array<T | null>): Array<T> {
	const a = values.filter(v => v !== null) as Array<T>
	return Array.from(new Set(a))
}
