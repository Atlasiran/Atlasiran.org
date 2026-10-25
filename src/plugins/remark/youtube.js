import { visit } from 'unist-util-visit';
import getAttr from '../getAttr.js';

export default function youtube() {
	return (tree) => {
		visit(tree, (node) => {
			if (!node.value?.startsWith('<youtube ')) return node;

			const id = getAttr(node.value, 'youtube', 'id');
			const title = getAttr(node.value, 'youtube', 'title') || 'YouTube video';
			if (!/^[A-Za-z0-9_-]{11}$/.test(id || '')) {
				node.value = '';
				return node;
			}
			const safeTitle = title.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

			node.value = `<iframe title="${safeTitle}" src="https://www.youtube.com/embed/${id}" loading="lazy" referrerpolicy="no-referrer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen width="747" height="420" />`;
			return node;
		});
	};
}
