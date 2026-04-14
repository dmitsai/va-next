/** HH search snippets and similar previews often end with ASCII or Unicode ellipsis. */
export function isTruncatedDescription(text: string): boolean {
    const t = text.trim();
    if (!t) return false;
    return t.includes('...') || t.includes('…');
}
