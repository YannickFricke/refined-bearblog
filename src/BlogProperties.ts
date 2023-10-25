import { extractMetadata } from './metadata';

interface BlogMetaOptions {
	/**
	 * The SEO meta description of this blog
	 *
	 * @type {string}
	 * @memberof BlogMetaOptions
	 */
	description: string;

	/**
	 * The SEO meta image of this blog
	 *
	 * @type {string}
	 * @memberof BlogMetaOptions
	 */
	image: string;
}

interface BlogProperties {
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
	 * The SEO meta options of this blog
	 *
	 * @type {BlogMetaOptions}
	 * @memberof BlogProperties
	 */
	meta: BlogMetaOptions;

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
	meta: {
		description: '',
		image: '',
	},
	lang: '',
	date_format: '',
};

const knownProperties = [
	'title',
	'bear_domain',
	'custom_domain',
	'favicon',
	'lang',
	'date_format',
];
const knownMetaProperties = ['meta_description', 'meta_image'];

function setProperty(
	existingProperties: BlogProperties,
	key: string,
	value: string,
): BlogProperties {
	if (key.startsWith('meta_') && knownMetaProperties.includes(key)) {
		// Set the meta property
		const metaKey = key.substring('meta_'.length);

		return {
			...existingProperties,
			meta: {
				...existingProperties.meta,
				[metaKey]: value,
			},
		};
	} else if (knownProperties.includes(key)) {
		// Set the known property
		return {
			...existingProperties,
			[key]: value,
		};
	}

	return existingProperties;
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
