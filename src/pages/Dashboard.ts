import 'emoji-picker-element';

import {
	BlogProperties,
	parseBlogProperties,
	stringifyBlogProperties,
} from '../BlogProperties';
import { addControl, getStickyControlsContainer } from '../StickyControls';
import { getElementByClassName } from '../helper';
import { createSubLogger } from '../logger';
import { initializeEditor, injectStylesheet } from '../WYSIWYGEditor';
import { Picker } from 'emoji-picker-element';
import { Debugger } from 'debug';

export function handleDashboardPage() {
	const logger = createSubLogger('Dashboard');

	logger('Handling dashboard page');

	const formElement = getElementByClassName<HTMLFormElement>('post-form');

	if (formElement === null) {
		logger('Could not find the form element - please update the script');
		return;
	}

	const headerContentElement =
		formElement.querySelector<HTMLDivElement>('#header_content');

	if (headerContentElement === null) {
		logger(
			'Could not find the header_content element - please update the script',
		);
		return;
	}

	const bodyContentElement = formElement.querySelector<HTMLTextAreaElement>(
		'[name=body_content]',
	);

	if (bodyContentElement === null) {
		logger(
			'Could not find the body_content element - please update the script',
		);

		return;
	}

	const stickyControlsContainer = getStickyControlsContainer();

	if (stickyControlsContainer === null) {
		logger(
			'Could not find the sticky-controls container - please update the script',
		);

		return;
	}

	const useWysiwygEditorControl = document.createElement('button');

	useWysiwygEditorControl.textContent = 'Use WYSIWYG Editor';
	useWysiwygEditorControl.onclick = (event: Event) => {
		event.preventDefault();
		logger('Initializing WYSIWYG editor');

		const headerContent = headerContentElement.innerHTML.trim();

		logger(
			'Determining blog properties based on the following header content: %s',
			headerContent,
		);

		const blogProperties = parseBlogProperties(headerContent);

		logger('Determined blog properties: %o', blogProperties);

		// Place the attributes editor

		setupAttributesEditor(
			logger,
			formElement,
			headerContentElement,
			blogProperties,
		);

		// Place the page content editor

		const pageContent = bodyContentElement.value;
		const bodyEditorElement = document.createElement('div');

		logger('Appending body editor element to the page');
		formElement.appendChild(bodyEditorElement);
		logger('Appended body editor element to the page');

		logger('Setting up WYSIWYG editor styles');
		injectStylesheet();
		logger('Sett up WYSIWYG editor styles');

		logger('Initializing WYSIWYG editor');
		initializeEditor(bodyEditorElement, pageContent, (newMarkdown) => {
			bodyContentElement.innerHTML = newMarkdown;
		});
		logger('Initialized WYSIWYG editor');

		// Hide the existing elements

		logger('Hiding existing elements');
		headerContentElement.style.display = 'none';
		bodyContentElement.style.display = 'none';
		logger('Hidden existing elements');

		// Remove the control button since we already initialized the editor
		logger('Removing existing control button');
		useWysiwygEditorControl.remove();
		logger('Removed existing control button');
	};

	addControl(stickyControlsContainer, useWysiwygEditorControl);

	logger(
		'Added the useWysiwygEditorControl button to the sticky-controls container',
	);
}

function setupAttributesEditor(
	parentLogger: Debugger,
	formElement: HTMLFormElement,
	headerContentElement: HTMLElement,
	blogProperties: BlogProperties,
) {
	const functionLogger = createSubLogger(
		'setupAttributesEditor',
		parentLogger,
	);
	const localBlogProperties = { ...blogProperties };
	const containerElement = document.createElement('div');

	function createChangeHandler(key: keyof BlogProperties) {
		return (newValue: string) => {
			const logger = createSubLogger(key, functionLogger);
			logger('Changing to: %s', newValue);

			if (newValue === undefined) {
				return;
			}

			localBlogProperties[key] = newValue;

			headerContentElement.innerHTML =
				stringifyBlogProperties(localBlogProperties);
		};
	}

	[
		createEditableAttributeElement(
			'Title',
			blogProperties.title,
			createChangeHandler('title'),
		),
		createEditableAttributeElement(
			'Bearblog Domain',
			blogProperties.bear_domain,
			createChangeHandler('bear_domain'),
		),
		createEditableAttributeElement(
			'Custom Domain (pro feature)',
			blogProperties.custom_domain,
			createChangeHandler('custom_domain'),
		),
		createEmojiPickerElement(
			blogProperties.favicon,
			createChangeHandler('favicon'),
		),
		createEditableAttributeElement(
			'Meta Description',
			blogProperties.meta_description,
			createChangeHandler('meta_description'),
		),
		createEditableAttributeElement(
			'Meta Image',
			blogProperties.meta_image,
			createChangeHandler('meta_image'),
		),
		createEditableAttributeElement(
			'Language',
			blogProperties.lang,
			createChangeHandler('lang'),
		),
		createEditableAttributeElement(
			'Date Format',
			blogProperties.date_format,
			createChangeHandler('date_format'),
		),
	].forEach((entry) => containerElement.appendChild(entry));

	formElement.appendChild(containerElement);
}

function createEditableAttributeElement(
	attributeName: string,
	defaultValue: string,
	changeHandler: (newValue: string) => void,
): HTMLDivElement {
	const containerElement = document.createElement('div');
	containerElement.style.margin = '1rem 0';

	const labelElement = document.createElement('label');
	labelElement.textContent = attributeName + ':';

	const inputElement = document.createElement('input');
	inputElement.type = 'text';
	inputElement.value = defaultValue;
	inputElement.addEventListener('input', (event) => {
		changeHandler((event.target as HTMLInputElement).value);
	});

	containerElement.appendChild(labelElement);
	containerElement.appendChild(inputElement);

	return containerElement;
}

function createEmojiPickerElement(
	currentFavicon: string,
	changeHandler: (newValue: string) => void,
): HTMLDivElement {
	const containerElement = document.createElement('div');
	containerElement.style.margin = '1rem 0';

	const labelElement = document.createElement('label');
	labelElement.textContent = 'Favicon:';

	const valueRow = document.createElement('div');
	valueRow.style.display = 'flex';
	valueRow.style.flexDirection = 'row';
	valueRow.style.gap = '1rem';

	const inputElement = document.createElement('input');
	inputElement.type = 'text';
	inputElement.value = currentFavicon;
	inputElement.disabled = true;

	valueRow.appendChild(inputElement);

	const emojiPickerElement = document.createElement('emoji-picker');
	emojiPickerElement.classList.add('dark');

	emojiPickerElement.addEventListener('emoji-click', (event) => {
		inputElement.value = event.detail.unicode ?? '';
		changeHandler(event.detail.unicode ?? '');
	});

	valueRow.appendChild(emojiPickerElement);

	containerElement.appendChild(labelElement);
	containerElement.appendChild(valueRow);

	return containerElement;
}
