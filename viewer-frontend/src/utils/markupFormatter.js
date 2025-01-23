const parseMarkup = (input) => {
  if (!input) return '';
  
  // Step 1: Sanitize input by escaping HTML special characters
  let formatted = input.replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));

  // Step 2: Convert line breaks (must do this first to handle multi-line content)
  formatted = formatted.replace(/\n/g, '<br>');

  // Step 3: Handle horizontal rules (must be done before headers since both start with #)
  formatted = formatted.replace(
    /(^|<br>)---(?=<br>|$)/g, 
    '$1<hr class="border-t border-gray-300 my-4">'
  );

  // Step 4: Convert markdown to HTML with safe class names
  // Headers (must be at start of line)
  formatted = formatted
    .replace(/(^|<br>)# (.*?)(?=<br>|$)/g, '$1<h1 class="text-2xl font-bold my-2">$2</h1>')
    .replace(/(^|<br>)## (.*?)(?=<br>|$)/g, '$1<h2 class="text-xl font-bold my-2">$2</h2>');

  // Bold text - matches text between ** ** pairs
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Italic text - matches text between single * pairs, but not within bold text
  formatted = formatted.replace(/\*((?!\*\*)(.*?))\*/g, '<em>$1</em>');

  // Links - Only allow http/https URLs
  formatted = formatted.replace(
    /\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g,
    (match, text, url) => {
      // Additional URL validation
      try {
        const validatedUrl = new URL(url);
        if (!['http:', 'https:'].includes(validatedUrl.protocol)) return match;
        return `<a href="${url}" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">${text}</a>`;
      } catch {
        return match; // Return original text if URL is invalid
      }
    }
  );

  // List items (must be at start of line)
  formatted = formatted.replace(
    /(^|<br>)- (.*?)(?=<br>|$)/g,
    '$1<li class="ml-4">$2</li>'
  );

  // Step 5: Replace consecutive list items with proper ul wrapping
  formatted = formatted.replace(
    /(<li.*?>.*?<\/li>)(?:\s*<li.*?>.*?<\/li>)+/g,
    '<ul class="list-disc mb-4">$&</ul>'
  );

  return formatted;
};

export default parseMarkup