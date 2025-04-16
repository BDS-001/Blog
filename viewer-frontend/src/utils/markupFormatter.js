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
  
  // Images
  formatted = formatted.replace(
    /!\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g,
    (match, alt, url) => {
      try {
        const validatedUrl = new URL(url);
        if (!['http:', 'https:'].includes(validatedUrl.protocol)) return match;
        return `<img src="${url}" alt="${alt}" class="max-w-full h-auto my-2" />`;
      } catch {
        return match; // Return original text if URL is invalid
      }
    }
  );
  
  // Headers (must be at start of line)
  // Make sure to handle spacing properly - allow for optional spaces after # symbols
  formatted = formatted
    .replace(/(^|<br>)#\s+(.*?)(?=<br>|$)/g, '$1<h1 class="text-2xl font-bold my-2">$2</h1>')
    .replace(/(^|<br>)##\s+(.*?)(?=<br>|$)/g, '$1<h2 class="text-xl font-bold my-2">$2</h2>');
  
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
  
  // Blockquotes (must be at start of line)
  formatted = formatted.replace(
    /(^|<br>)> (.*?)(?=<br>|$)/g,
    '$1<blockquote class="pl-4 border-l-4 border-gray-300 italic my-2">$2</blockquote>'
  );
  
  // Code blocks (inline)
  formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded font-mono">$1</code>');
  
  // List items (must be at start of line)
  formatted = formatted.replace(
    /(^|<br>)- (.*?)(?=<br>|$)/g,
    '$1<li class="ml-4">$2</li>'
  );
  
  // Ordered list items
  formatted = formatted.replace(
    /(^|<br>)(\d+)\. (.*?)(?=<br>|$)/g,
    '$1<li class="ml-4 list-decimal">$3</li>'
  );
  
  // Step 5: Replace consecutive list items with proper ul/ol wrapping
  
  // Unordered lists
  formatted = formatted.replace(
    /(<li class="ml-4">.*?<\/li>)(?:\s*<li class="ml-4">.*?<\/li>)+/g,
    '<ul class="list-disc mb-4">$&</ul>'
  );
  
  // Ordered lists
  formatted = formatted.replace(
    /(<li class="ml-4 list-decimal">.*?<\/li>)(?:\s*<li class="ml-4 list-decimal">.*?<\/li>)+/g,
    '<ol class="list-decimal mb-4">$&</ol>'
  );
  
  // Strikethrough
  formatted = formatted.replace(/~~(.*?)~~/g, '<span class="line-through">$1</span>');
  
  return formatted;
};

export default parseMarkup;