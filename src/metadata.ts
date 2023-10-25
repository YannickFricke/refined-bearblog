const BOLD_TAG_EXTRACTION_REGEX = /<b>(?<key>\w+):<\/b> (?<value>.*)(<br>)?/;

function extractInfoFromBoldInput(input: string): [string, string] | [] {
	if (BOLD_TAG_EXTRACTION_REGEX.test(input) === false) {
		return [];
	}

	const regexResult = BOLD_TAG_EXTRACTION_REGEX.exec(input);

	if (regexResult === null) {
		return [];
	}

	const key = regexResult.groups!.key;
	let value = regexResult.groups!.value;

	if (value.endsWith('<br>')) {
		value = value.substring(0, value.length - 4);
	}

	return [key, value];
}

const DIV_TAG_EXTRACTION_REGEX = /<div>(?<key>\w+): (?<value>.*?)<\/div>/g;

function extractInfoFromDivInput(input: string): Array<[string, string]> {
	const result: Array<[string, string]> = [];

	if (DIV_TAG_EXTRACTION_REGEX.test(input) === false) {
		return result;
	}

	const matches = input.match(DIV_TAG_EXTRACTION_REGEX);

	if (matches === null) {
		return result;
	}

	for (const match of matches) {
		const localMatch = DIV_TAG_EXTRACTION_REGEX.exec(match);

		const key = localMatch!.groups!.key;
		const value = localMatch!.groups!.value;

		result.push([key, value]);
	}

	return result;
}

export function extractMetadata(textToParse: string): Record<string, string> {
	let result = {};

	const textParts = textToParse.split('\n');

	for (let partIndex = 0; partIndex < textParts.length; partIndex++) {
		const currentTextPart = textParts[partIndex];

		let key: string;
		let value: string;

		if (currentTextPart.startsWith('<b>')) {
			const extractionResult = extractInfoFromBoldInput(currentTextPart);

			if (extractionResult.length === 0) {
				continue;
			}

			[key, value] = extractionResult;

			result = {
				...result,
				[key]: value,
			};

			continue;
		}

		if (currentTextPart.startsWith('<div>')) {
			const results = extractInfoFromDivInput(currentTextPart);

			for (const entry of results) {
				result = {
					...result,
					[entry[0]]: entry[1],
				};
			}

			continue;
		}
	}

	return result;
}
