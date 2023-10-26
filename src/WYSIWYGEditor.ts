import EditorStyles from 'inline:../node_modules/@toast-ui/editor/dist/toastui-editor.css';
import DarkEditorStyles from 'inline:../node_modules/@toast-ui/editor/dist/theme/toastui-editor-dark.css';

import Editor from '@toast-ui/editor';

export function injectStylesheet() {
	const defaultEditorStylesElement = document.createElement('style');
	defaultEditorStylesElement.textContent = EditorStyles;
	document.head.appendChild(defaultEditorStylesElement);

	const darkEditorStylesElement = document.createElement('style');
	darkEditorStylesElement.textContent = DarkEditorStyles;
	document.head.appendChild(darkEditorStylesElement);
}

export function initializeEditor(
	editorElement: HTMLElement,
	initialContent: string,
	onChangeHandler: (newMarkdown: string) => void,
): Editor {
	const editor = new Editor({
		el: editorElement,
		height: '500px',
		initialValue: initialContent,
		initialEditType: 'wysiwyg',
		theme: 'dark',
		usageStatistics: false,
		autofocus: false,
		toolbarItems: [
			['heading', 'bold', 'italic', 'strike'],
			['hr', 'quote'],
			['ul', 'ol', 'indent', 'outdent'],
			['table', 'image', 'link'],
			['code', 'codeblock'],
		],
		hooks: {
			addImageBlobHook: (
				blob: Blob,
				callback: (url: string, text?: string) => void,
			) => {
				console.log('In hook!');

				const file = new File([blob], 'image.png');

				if (file.size > 10000000) {
					alert(
						`File over the 10mb limit. Use https://tinypng.com to minimise it.`,
					);

					return;
				}

				const formData = new FormData();
				const target = '/dashboard/upload-image/';

				formData.append('file', file);

				var xhr = new XMLHttpRequest();

				xhr.open('POST', target, true);
				xhr.send(formData);

				xhr.onload = function () {
					if (this.status !== 200) {
						alert(
							'Either you have selected an invalid image, not an upgraded account (image upload is a pro feature) or there was an error uploading it.',
						);

						return;
					}

					const response = JSON.parse(this.responseText);
					const fileUrl = response[0];

					callback(fileUrl, file.name);
				};
			},
		},
		events: {
			change: () => {
				const markdownContents = editor.getMarkdown();

				onChangeHandler(markdownContents);
			},
		},
	});

	return editor;
}
