import { getElementByClassName } from './helper';

export function getStickyControlsContainer(): HTMLElement | null {
	return getElementByClassName('sticky-controls');
}

export function addControl(
	containerElement: HTMLElement,
	controlElement: HTMLElement,
) {
	containerElement.appendChild(controlElement);
}
