export const isEmptyObject = object => {
	return object === undefined || object === null || Object.keys(object).length === 0
}

export const isEmptyArray = value => {
	return value === undefined || value === null || value.length === 0
}

export const isEmptyString = value => {
	return value === undefined || value === null || value.trim() === ''
}

export const isString = value => {
	return value !== undefined && value !== null && typeof value === 'string'
}

export const isObject = value => {
	return value !== undefined && value !== null && typeof value === 'object'
}
export const isSpecialCharacter = value => {
	return value !== undefined && value !== null && value.match(/[^A-Za-z0-9]+/g)
}

export const isEmailSpecialChar = value => {
	return value !== undefined && value !== null && value.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/gim)
}

export const isValidNumberDot = value => {
	return value !== undefined && value !== null && value.match(/^\d+(\.\d+){0,2}$/)
}

export const isValdAlpNumSpcUdscrHyph = value => {
	return value !== undefined && value !== null && value.match(/^\w+([\s-_]\w+)*$/)
}

export const isValdNumber = value => {
	return value !== undefined && value !== null && /^[0-9\b]+$/.test(value)
}
