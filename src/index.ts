import { BearBlogPath } from './BearBlogPath';
import { createSubLogger } from './logger';
import { handleDashboardPage } from './pages/Dashboard';

(function () {
	'use strict';

	const logger = createSubLogger('main');
	const currentUrl = new URL(window.location.toString());
	const currentPath = currentUrl.pathname;

	logger('Loading Refined BearBlog');

	switch (true) {
		case currentPath === BearBlogPath.Dashboard:
			handleDashboardPage();
			break;

		default:
			logger('Unhandled path: %s', currentUrl.pathname);
			break;
	}
})();
