/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { parseBlogProperties } from '../BlogProperties';
import { getElement, getElementById } from '../helper';
import { createSubLogger } from '../logger';

export function handleDashboardPage() {
	const logger = createSubLogger('Dashboard');

	const headerContentElement = getElementById('header_content');

	if (headerContentElement === null) {
		logger(
			'Could not find the header_content element - please update the script',
		);
		return;
	}

	const bodyContentElement = getElement('[name=body_content]');

	if (bodyContentElement === null) {
		logger(
			'Could not find the body_content element - please update the script',
		);

		return;
	}

	const headerContent = headerContentElement.innerHTML.trim();

	const blogProperties = parseBlogProperties(headerContent);

	logger({ blogProperties });
}
