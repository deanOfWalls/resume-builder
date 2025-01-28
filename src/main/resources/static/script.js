document.addEventListener("DOMContentLoaded", function () {
    const editor = document.getElementById("markdown-editor");
    const preview = document.getElementById("preview");
    const exportBtn = document.getElementById("export-pdf");

    // Ensure Marked.js is available
    if (typeof marked === "undefined") {
        console.error("Marked.js is not loaded. Check your script source.");
        return;
    }

    // Function to update the live preview in real-time
    function updatePreview() {
        const markdownText = editor.value.trim(); // Get Markdown input
        if (markdownText.length === 0) {
            preview.innerHTML = "<p style='color: gray;'>Live preview will appear here...</p>";
            return;
        }
        try {
            preview.innerHTML = marked.parse(markdownText);
        } catch (error) {
            console.error("Error parsing Markdown:", error);
            preview.innerHTML = "<p style='color: red;'>Error rendering Markdown.</p>";
        }
    }

    // Listen for input changes in the editor
    editor.addEventListener("input", updatePreview);

    // Initial rendering on page load
    updatePreview();

    // Export function to generate a clean PDF
    exportBtn.addEventListener("click", function () {
        const printWindow = window.open("", "_blank", "width=800,height=900");

        printWindow.document.write(`
            <html>
            <head>
                <title>Resume</title>
                <link rel="stylesheet" href="modernist.css">
                <link rel="stylesheet" href="custom-style.css"> <!-- Apply custom overrides -->
                <style>
                    @media print {
                        body { font-size: 12pt; color: black !important; background: white !important; }
                        #markdown-editor { display: none !important; }
                        #preview { width: 100% !important; padding: 20px; }
                        h1, h2, h3, h4, h5, h6, p, a { color: black !important; }
                        a { text-decoration: none !important; }
                        @page { margin: 1in; }
                    }
                </style>
            </head>
            <body>
                <div id="preview">${preview.innerHTML}</div>
            </body>
            </html>
        `);
        printWindow.document.close();

        // Print and close the window
        printWindow.onload = function () {
            printWindow.print();
            setTimeout(() => {
                printWindow.close();
            }, 500);
        };
    });
});
