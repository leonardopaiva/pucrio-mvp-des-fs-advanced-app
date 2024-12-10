/*
    will decrease / increase app font size on html, resulting in
    all elements increase size because of rem size css elements    
*/

const html = document.documentElement;

export function decreaseFontSize(): void {
    let currentSize = window.getComputedStyle(html).fontSize;
    let newSize = parseFloat(currentSize) - 1;
    html.style.fontSize = newSize + 'px';
}

export function increaseFontSize(): void {
    let currentSize = window.getComputedStyle(html).fontSize;
    let newSize = parseFloat(currentSize) + 1;
    html.style.fontSize = newSize + 'px';
}