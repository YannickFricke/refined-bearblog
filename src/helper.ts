/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

export function getElementById(
	idToFind: string,
	parent: HTMLElement | Document = document,
): HTMLElement | null {
	return parent.querySelector(`#${idToFind}`);
}

export function getElementByClassName(
	classNameToFind: string,
	parent: HTMLElement | Document = document,
): HTMLElement | null {
	return parent.querySelector(`.${classNameToFind}`);
}

export function getElement(
	selector: string,
	parent: HTMLElement | Document = document,
): HTMLElement | null {
	return parent.querySelector(selector);
}
