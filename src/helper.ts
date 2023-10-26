/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

export function getElementById<T extends HTMLElement>(
	idToFind: string,
	parent: HTMLElement | Document = document,
): T | null {
	return parent.querySelector<T>(`#${idToFind}`);
}

export function getElementByClassName<T extends HTMLElement>(
	classNameToFind: string,
	parent: HTMLElement | Document = document,
): T | null {
	return parent.querySelector<T>(`.${classNameToFind}`);
}

export function getElement<T extends HTMLElement>(
	selector: string,
	parent: HTMLElement | Document = document,
): T | null {
	return parent.querySelector<T>(selector);
}
