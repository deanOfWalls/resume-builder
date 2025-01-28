// Get references to DOM elements
const editor = document.getElementById("markdown-editor");
const preview = document.getElementById("preview");
const exportButton = document.getElementById("export-pdf");

// Markdown-to-HTML Conversion with Marked.js
editor.addEventListener("input", () => {
    const markdown = editor.value;
    const html = marked.parse(markdown); // Convert Markdown to HTML
    preview.innerHTML = html; // Update the live preview
});

// Export PDF using window.print()
exportButton.addEventListener("click", () => {
    window.print(); // Opens the browser's print dialog
});