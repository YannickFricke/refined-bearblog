import { extractMetadata } from './metadata';

export interface BlogProperties {
	/**
	 * The actual title of the blog
	 *
	 * @type {string}
	 * @memberof BlogProperties
	 */
	title: string;

	/**
	 * The domain which points to *.bearblog.dev
	 *
	 * @type {string}
	 * @memberof BlogProperties
	 */
	bear_domain: string;

	/**
	 * The user-defined domain which points to this blog
	 *
	 * @type {string}
	 * @memberof BlogProperties
	 */
	custom_domain: string;

	/**
	 * The favicon of this blog (usually an emoji)
	 *
	 * @type {string}
	 * @memberof BlogProperties
	 */
	favicon: string;

	/**
	 * The SEO friendly description of this blog
	 *
	 * @type {string}
	 * @memberof BlogProperties
	 */
	meta_description: string;

	/**
	 * The social media image of this blog
	 *
	 * @type {string}
	 * @memberof BlogProperties
	 */
	meta_image: string;

	/**
	 * The default language of this blog
	 *
	 * @type {string}
	 * @memberof BlogProperties
	 */
	lang: string;

	/**
	 * The default timezone which should be used for displaying the "published" date
	 *
	 * @type {string}
	 * @memberof BlogProperties
	 */
	date_format: string;
}

const DEFAULT_BLOG_PROPERTIES: BlogProperties = {
	title: '',
	bear_domain: '',
	custom_domain: '',
	favicon: '',
	meta_description: '',
	meta_image: '',
	lang: '',
	date_format: '',
};

function setProperty(
	existingProperties: BlogProperties,
	key: string,
	value: string,
): BlogProperties {
	return {
		...existingProperties,
		[key]: value,
	};
}

export function parseBlogProperties(textToParse: string): BlogProperties {
	let parsedProperties: BlogProperties = {
		...DEFAULT_BLOG_PROPERTIES,
	};

	const extractedMetadata = extractMetadata(textToParse);

	for (const [key, value] of Object.entries(extractedMetadata)) {
		parsedProperties = setProperty(parsedProperties, key, value);
	}

	return parsedProperties;
}

export function stringifyBlogProperties(
	blogProperties: BlogProperties,
): string {
	return Object.entries(blogProperties)
		.filter(([_key, value]) => value !== '')
		.map(([key, value]) => {
			return `<b>${key}:</b> ${value}`;
		})
		.join('\n');
}
