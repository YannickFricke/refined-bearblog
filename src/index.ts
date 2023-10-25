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
		case currentPath.startsWith(BearBlogPath.Dashboard):
			handleDashboardPage();
			break;

		default:
			console.log('Unhandled path: ', currentUrl.pathname);
			break;
	}
})();
