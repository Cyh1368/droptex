function simulateUnfocus() {
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
  
    document.dispatchEvent(clickEvent);
}
  
// Get references to the textarea, display div, and the append button
const textarea = document.getElementById("latexEditor");
const displayDiv = document.getElementById("latexDisplay");
const initButton = document.getElementById("initButton");
const clearButton = document.getElementById("clearButton");

function init(){
    textarea.value = "$$$$";
    textarea.dispatchEvent(new Event("input"));
}

function clear(){
    textarea.value = "";
    textarea.dispatchEvent(new Event("input"));
}

document.addEventListener("DOMContentLoaded", function() {
    // Function to render MathJax in a specific element
    function renderMath(element) {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, element]);
    }

    // Initial rendering of MathJax on page load for existing content
    renderMath(document.getElementById("latexDisplay"));

    // Function to update the result when the textarea changes
    function updateResult() {
        const latexCode = textarea.value;

        // Update the content of the display div with the rendered LaTeX
        displayDiv.innerHTML = "$$"+latexCode+"$$";

        // Trigger MathJax rendering for the updated content
        renderMath(displayDiv);
    }

    // Add an event listener to the textarea's input event
    textarea.addEventListener("input", updateResult);
});

const renderedLatex = document.getElementById('latexDisplay');
const latexCodeTextarea = document.getElementById('latexEditor');

// Add event listeners to LaTeX blocks for dragging
const latexBlocks = document.querySelectorAll('.latex-block');
latexBlocks.forEach(block => {
  block.addEventListener('dragstart', e => {
    isDragging = true; // Set flag when dragging starts
    blockData = block.getAttribute("data-value")
    e.dataTransfer.setData('text/plain', blockData);
  });
  let isDragging = false; // Flag to track if dragging is happening

  block.addEventListener('click', () => {
    if (!isDragging) {
      const latexValue = block.getAttribute('data-value');
      latexCodeTextarea.value += `${latexValue}`;
      const inputEvent = new Event('input', { bubbles: true });
      latexCodeTextarea.dispatchEvent(inputEvent); // Simulate input event
    }
  });

  block.addEventListener('dragend', () => {
    isDragging = false; // Reset flag when dragging ends
  });
});

latexCodeTextarea.addEventListener('drop', e => {
    console.log("drop")
    // e.preventDefault();
    const blockData = e.dataTransfer.getData('text/plain');
    const cursorPosition = latexCodeTextarea.selectionStart;
    console.log(cursorPosition, latexCodeTextarea.selectionEnd)
});

const copyButton = document.getElementById('copyButton');
copyButton.addEventListener('click', () => {
    const textToCopy = "$$"+latexEditor.value+"$$";
    if (navigator.clipboard) {
        // Use Clipboard API if supported
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                // Success
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = 'Copy to Clipboard';
                }, 2000); // Reset button text after 2 seconds
            })
            .catch(err => {
                // Handle error
                console.error('Failed to copy using Clipboard API: ', err);
            });
    } else {
        // Fallback using execCommand for browsers without Clipboard API
        const dummyElement = document.createElement('textarea');
        dummyElement.value = textToCopy;
        document.body.appendChild(dummyElement);
        dummyElement.select();
        document.execCommand('copy');
        document.body.removeChild(dummyElement);
        
        // Provide user feedback
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
            copyButton.textContent = 'Copy to Clipboard';
        }, 2000); // Reset button text after 2 seconds
    }
});
