// This function will attempt to fix basic errors and return the corrected JSON
function fixJson() {
    let jsonInput = document.getElementById('jsonInput').value;
    let output = document.getElementById('jsonOutput');

    // Remove unnecessary white spaces
    jsonInput = jsonInput.trim();

    // Try parsing the JSON to check for syntax errors
    try {
        let parsedJson = JSON.parse(jsonInput);
        // If it's a valid JSON object or array, confirm it's good to go
        output.value = "The code is correct and good to go!";
        return; // Exit if valid
    } catch (error) {
        // If there's an error, attempt to fix it
        let fixedJson = attemptFix(jsonInput);

        // Try parsing the fixed JSON again
        try {
            let parsedJson = JSON.parse(fixedJson);
            // Format and display the corrected JSON
            output.value = formatJson(JSON.stringify(parsedJson));
        } catch (finalError) {
            // If still invalid, show a general message about fixing
            output.value = "The JSON could not be corrected. Please check the input format.";
        }
    }
}

// Attempt to fix common JSON errors
function attemptFix(jsonString) {
    // 1. Add missing commas between objects
    jsonString = jsonString.replace(/}\s*{/g, '}, {'); // Insert commas between objects

    // 2. Ensure it starts and ends with square brackets if it looks like an array
    if (!jsonString.startsWith('[')) {
        jsonString = '[' + jsonString + ']';
    }
    if (!jsonString.endsWith(']')) {
        jsonString += ']';
    }

    // 3. Handle trailing commas (remove them)
    jsonString = jsonString.replace(/,\s*([}\]])/g, '$1'); // Remove trailing commas before closing brackets/braces

    // 4. Fix missing commas after objects
    const objectRegex = /}\s*{/g; // Detect and fix missing commas
    while (objectRegex.test(jsonString)) {
        jsonString = jsonString.replace(objectRegex, '}, {');
    }

    // Return the fixed JSON string
    return jsonString;
}

// Function to format the JSON for output
function formatJson(jsonString) {
    try {
        const jsonObject = JSON.parse(jsonString);
        return JSON.stringify(jsonObject, null, 4) // Indent with 4 spaces
            .replace(/:\s*\[/g, ': [')
            .replace(/:\s*{/g, ': {')
            .replace(/\[\s+/g, '[')
            .replace(/\s+\]/g, ']')
            .replace(/,\s*\]/g, ']') // Remove trailing commas before closing brackets
            .replace(/,\s*}/g, '}'); // Remove trailing commas before closing braces
    } catch (error) {
        return jsonString; // Return as-is if parsing fails
    }
}

// Function to copy the corrected JSON to the clipboard
function copyToClipboard() {
    let jsonOutput = document.getElementById('jsonOutput');
    jsonOutput.select();
    document.execCommand('copy');
    alert("Corrected JSON copied to clipboard!");
}
