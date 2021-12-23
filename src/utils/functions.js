export const getStringFromArray = array => {
	return array.map((value, index) => {
		if (index === array.length - 1) {
			return value
		} else {
			return value + ', '
		}
	})
}

export const getStringFromArrayUsingKey = (array, key) => {
	return array.map((value, index) => {
		if (index === array.length - 1) {
			if (value && typeof value === 'object') {
				return value[key]
			} else {
				return value
			}
		} else {
			if (value && typeof value === 'object') {
				return value[key] + ', '
			} else {
				return value + ', '
			}
		}
	})
}

export const getStringArrayFromArrayUsingKey = (array, key) => {
	return array.map(value => {
		return value[key]
	})
}

export const Capitalize = str => {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

export const CapitalizeAll = str => {
	return str.toUpperCase()
}
