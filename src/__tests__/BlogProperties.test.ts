import { describe, it, expect } from 'bun:test';
import { parseBlogProperties } from '../BlogProperties';

describe('BlogProperties', () => {
	describe('parseBlogProperties', () => {
		it('should parse an empty text', () => {
			const input = '';
			const result = parseBlogProperties(input);

			expect(result).toEqual({
				title: '',
				bear_domain: '',
				custom_domain: '',
				favicon: '',
				meta_description: '',
				meta_image: '',
				lang: '',
				date_format: '',
			});
		});

		it(`should parse an input with b-tags`, () => {
			const input = `<b>title:</b> Yannick's Blog<br>\n<b>bear_domain:</b> yannickfricke.bearblog.dev<br>\n<b>favicon:</b> 💻`;
			const result = parseBlogProperties(input);

			expect(result).toEqual({
				title: `Yannick's Blog`,
				bear_domain: 'yannickfricke.bearblog.dev',
				custom_domain: '',
				favicon: '💻',
				meta_description: '',
				meta_image: '',
				lang: '',
				date_format: '',
			});
		});

		it('should parse an input with b- and div-tags', () => {
			const input = `<b>title:</b> Yannick's Blog<br>\n<b>bear_domain:</b> yannickfricke.bearblog.dev<br>\n<b>favicon:</b> 💻\n<div>lang: de</div>`;
			const result = parseBlogProperties(input);

			expect(result).toEqual({
				title: `Yannick's Blog`,
				bear_domain: 'yannickfricke.bearblog.dev',
				custom_domain: '',
				favicon: '💻',
				meta_description: '',
				meta_image: '',
				lang: 'de',
				date_format: '',
			});
		});
	});
});
