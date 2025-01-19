export const parseMarkup = (input) => {
    if (!input) return '';
    
    // Convert line breaks
    let formatted = input.replace(/\n/g, '<br>');
    
    // Convert headings (must be at start of line)
    formatted = formatted.replace(/(^|<br>)# (.*?)(?=<br>|$)/g, '$1<h1 class="text-2xl font-bold my-2">$2</h1>');
    formatted = formatted.replace(/(^|<br>)## (.*?)(?=<br>|$)/g, '$1<h2 class="text-xl font-bold my-2">$2</h2>');
    
    // Convert bold
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert italic
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert links
    formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>');
    
    // Convert list items (must be at start of line)
    formatted = formatted.replace(/(^|<br>)- (.*?)(?=<br>|$)/g, '<li class="ml-4">$2</li>');
    
    return formatted;
  };