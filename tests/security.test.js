import assert from 'node:assert/strict';
import test from 'node:test';
import { safeDocumentUrl, safeSitePath, safeWebUrl } from '../src/lib/safeUrl.js';
import youtube from '../src/plugins/remark/youtube.js';

test('organization links accept only HTTP and HTTPS URLs', () => {
    assert.equal(safeWebUrl(' https://example.org/about '), 'https://example.org/about');
    for (const value of ['javascript:alert(1)', 'data:text/html,<script>', '//evil.test',
        'https://user:pass@example.org/', 'https://example.org\njavascript:alert(1)']) {
        assert.equal(safeWebUrl(value), null, value);
    }
});

test('site navigation and document links cannot change origin or scheme', () => {
    assert.equal(safeSitePath('/op/example'), '/op/example');
    assert.equal(safeSitePath('//evil.test'), null);
    assert.equal(safeSitePath('/\\evil.test'), null);
    assert.equal(safeDocumentUrl('docs/constitution.pdf'), '/docs/constitution.pdf');
    assert.equal(safeDocumentUrl('javascript:alert(1)'), null);
    assert.equal(safeDocumentUrl('//evil.test/doc.pdf'), null);
});

test('YouTube embed rejects invalid IDs and escapes attribute text', () => {
    const transform = youtube();
    const tree = { type: 'root', children: [
        { type: 'html', value: '<youtube id="abc123abc12" title="A &amp; B" />' },
        { type: 'html', value: '<youtube id="bad" title="unsafe" />' }
    ] };
    transform(tree);
    assert.match(tree.children[0].value, /youtube\.com\/embed\/abc123abc12/);
    assert.match(tree.children[0].value, /title="A &amp;amp; B"/);
    assert.equal(tree.children[1].value, '');
});
