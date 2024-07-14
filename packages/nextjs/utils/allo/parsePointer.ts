const parsePointer = (pointer: string) => {
  try {
    // Log the raw pointer string
    console.log("Raw pointer:", pointer);

    // Remove leading and trailing whitespace, including newlines
    let sanitizedPointer = pointer.trim();

    // Remove extra newlines within the JSON object
    sanitizedPointer = sanitizedPointer.replace(/\n\s*\n/g, "\n");

    // Additional sanitization: Replace single quotes with double quotes, remove trailing commas
    let cleanPointer = sanitizedPointer
      .replace(/'/g, '"') // Replace single quotes with double quotes
      .replace(/,\s*}/g, "}") // Remove trailing commas before a closing curly brace
      .replace(/,\s*]/g, "]") // Remove trailing commas before a closing square bracket
      .replace(/,(\s*\})/g, "$1") // Remove trailing commas before closing curly brace (in some edge cases)
      .replace(/,\s*$/g, ""); // Remove trailing comma at the end of the JSON string

    console.log("Sanitized pointer:", cleanPointer);

    return JSON.parse(cleanPointer);
  } catch (e) {
    console.error("Failed to parse pointer:", e);
    console.log("Invalid JSON:", pointer); // Log the invalid JSON
    return {};
  }
};

export default parsePointer;
