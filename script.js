// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme preference or respect OS preference
if (localStorage.getItem('theme') === 'dark' || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('theme'))) {
  body.classList.add('dark-mode');
  themeToggle.innerHTML = '<i class="fas fa-sun me-1"></i>';
} else {
  themeToggle.innerHTML = '<i class="fas fa-moon me-1"></i>';
}

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  
  if (body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun me-1"></i>';
  } else {
    localStorage.setItem('theme', 'light');
    themeToggle.innerHTML = '<i class="fas fa-moon me-1"></i>';
  }
});

// Copy to clipboard functionality
const copyBtn = document.getElementById('copyBtn');
copyBtn.addEventListener('click', () => {
  const previewText = document.getElementById('schemaPreview').textContent;
  navigator.clipboard.writeText(previewText).then(() => {
    // Change button text temporarily
    const originalHtml = copyBtn.innerHTML;
    copyBtn.innerHTML = '<i class="fas fa-check me-1"></i>Copied!';
    copyBtn.classList.add('btn-success');
    
    setTimeout(() => {
      copyBtn.innerHTML = originalHtml;
      copyBtn.classList.remove('btn-success');
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy: ', err);
    alert('Failed to copy to clipboard. Please try again.');
  });
});

// Additional buttons functionality
document.getElementById('validateBtn').addEventListener('click', () => {
  window.open('https://search.google.com/test/rich-results', '_blank');
});

document.getElementById('downloadBtn').addEventListener('click', () => {
  const schemaContent = document.getElementById('schemaPreview').textContent;
  const blob = new Blob([schemaContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'schema.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

document.getElementById('implementBtn').addEventListener('click', () => {
  // Create a modal with implementation instructions
  const implementationModal = new bootstrap.Modal(document.getElementById('implementationModal'));
  implementationModal.show();
});

// Simple syntax highlighting for JSON preview
function highlightJson(json) {
  return json
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?)/g, function (match) {
      let cls = 'json-key';
      if (/:$/.test(match)) {
        return '<span class="' + cls + '">' + match + '</span>';
      } else {
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'json-key';
          } else {
            cls = 'json-string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'json-boolean';
        } else if (/null/.test(match)) {
          cls = 'json-null';
        } else if (/^[0-9]+$/.test(match)) {
          cls = 'json-number';
        }
        return '<span class="' + cls + '">' + match + '</span>';
      }
    });
}

// Apply highlighting to the initial preview
const previewElement = document.getElementById('schemaPreview');
previewElement.innerHTML = highlightJson(previewElement.textContent);

// Schema field configurations
const schemaConfigs = {
  organization: {
    type: 'Organization',
    fields: [
      { id: 'orgName', label: 'Organization Name', type: 'text', placeholder: 'e.g., Google LLC' },
      { id: 'orgUrl', label: 'Website URL', type: 'url', placeholder: 'e.g., https://www.google.com' },
      { id: 'orgLogo', label: 'Logo URL', type: 'url', placeholder: 'e.g., https://www.google.com/logo.png' }
    ]
  },
  localBusiness: {
    type: 'LocalBusiness',
    fields: [
      { id: 'businessName', label: 'Business Name', type: 'text', placeholder: 'e.g., Joe\'s Pizza' },
      { id: 'businessUrl', label: 'Website URL', type: 'url', placeholder: 'e.g., https://joespizza.com' },
      { id: 'businessAddress', label: 'Address', type: 'text', placeholder: 'e.g., 123 Main St, City, State' },
      { id: 'businessPhone', label: 'Phone Number', type: 'tel', placeholder: 'e.g., +1-555-123-4567' }
    ]
  },
  article: {
    type: 'Article',
    fields: [
      { id: 'articleHeadline', label: 'Article Title', type: 'text', placeholder: 'e.g., How to Create Amazing Content' },
      { id: 'articleAuthor', label: 'Author Name', type: 'text', placeholder: 'e.g., John Doe' },
      { id: 'articleDate', label: 'Published Date', type: 'datetime-local', placeholder: '' }
    ]
  },
  newsArticle: {
    type: 'NewsArticle',
    fields: [
      { id: 'newsHeadline', label: 'Headline', type: 'text', placeholder: 'e.g., Breaking News: Important Update' },
      { id: 'newsImages', label: 'Image URLs (one per line)', type: 'textarea', placeholder: 'https://example.com/photos/1x1/photo.jpg\nhttps://example.com/photos/4x3/photo.jpg\nhttps://example.com/photos/16x9/photo.jpg' },
      { id: 'newsDatePublished', label: 'Date Published', type: 'datetime-local', placeholder: '' },
      { id: 'newsDateModified', label: 'Date Modified', type: 'datetime-local', placeholder: '' },
      { id: 'newsAuthors', label: 'Authors (JSON format)', type: 'textarea', placeholder: '[\n  {"name": "Jane Doe", "url": "https://example.com/profile/janedoe123"},\n  {"name": "John Doe", "url": "https://example.com/profile/johndoe123"}\n]' }
    ]
  },
  product: {
    type: 'Product',
    fields: [
      { id: 'productName', label: 'Product Name', type: 'text', placeholder: 'e.g., Amazing Widget' },
      { id: 'productImage', label: 'Product Image URL', type: 'url', placeholder: 'e.g., https://example.com/product.jpg' },
      { id: 'productDescription', label: 'Description', type: 'textarea', placeholder: 'e.g., An amazing widget that does everything' },
      { id: 'productSku', label: 'SKU', type: 'text', placeholder: 'e.g., AWG123456' },
      { id: 'productBrand', label: 'Brand Name', type: 'text', placeholder: 'e.g., WidgetCorp' }
    ]
  },
  event: {
    type: 'Event',
    fields: [
      { id: 'eventName', label: 'Event Name', type: 'text', placeholder: 'e.g., Tech Conference 2024' },
      { id: 'eventDate', label: 'Event Date', type: 'datetime-local', placeholder: '' },
      { id: 'eventLocation', label: 'Location', type: 'text', placeholder: 'e.g., San Francisco, CA' },
      { id: 'eventDescription', label: 'Description', type: 'textarea', placeholder: 'e.g., Annual tech conference featuring the latest innovations' }
    ]
  },
  person: {
    type: 'Person',
    fields: [
      { id: 'personName', label: 'Full Name', type: 'text', placeholder: 'e.g., John Doe' },
      { id: 'personUrl', label: 'Website/Profile URL', type: 'url', placeholder: 'e.g., https://johndoe.com' },
      { id: 'personJobTitle', label: 'Job Title', type: 'text', placeholder: 'e.g., Software Engineer' },
      { id: 'personImage', label: 'Photo URL', type: 'url', placeholder: 'e.g., https://example.com/photo.jpg' }
    ]
  },
  webpage: {
    type: 'WebPage',
    fields: [
      { id: 'pageTitle', label: 'Page Title', type: 'text', placeholder: 'e.g., About Us' },
      { id: 'pageUrl', label: 'Page URL', type: 'url', placeholder: 'e.g., https://example.com/about' },
      { id: 'pageDescription', label: 'Description', type: 'textarea', placeholder: 'e.g., Learn more about our company and mission' }
    ]
  }
};

// Generate form fields dynamically
function generateFormFields(schemaType) {
  const formContainer = document.getElementById('formContainer');
  const config = schemaConfigs[schemaType] || schemaConfigs.organization;
  
  formContainer.innerHTML = '';
  
  config.fields.forEach(field => {
    const fieldHtml = `
      <div class="mb-3">
        <label for="${field.id}" class="form-label">${field.label}</label>
        ${field.type === 'textarea' 
          ? `<textarea class="form-control" id="${field.id}" rows="4" placeholder="${field.placeholder}"></textarea>`
          : `<input type="${field.type}" class="form-control" id="${field.id}" placeholder="${field.placeholder}">`
        }
      </div>
    `;
    formContainer.insertAdjacentHTML('beforeend', fieldHtml);
  });
  
  // Add event listeners for real-time preview updates
  config.fields.forEach(field => {
    const element = document.getElementById(field.id);
    element.addEventListener('input', () => updatePreview(schemaType));
  });
}

// Generate schema based on form values
function generateSchema(schemaType) {
  const config = schemaConfigs[schemaType] || schemaConfigs.organization;
  let schema = {
    "@context": "https://schema.org",
    "@type": config.type
  };
  
  if (schemaType === 'newsArticle') {
    const headline = document.getElementById('newsHeadline')?.value || 'Title of a News Article';
    const imagesText = document.getElementById('newsImages')?.value || '';
    const datePublished = document.getElementById('newsDatePublished')?.value || '';
    const dateModified = document.getElementById('newsDateModified')?.value || '';
    const authorsText = document.getElementById('newsAuthors')?.value || '';
    
    // Process images
    let images = [];
    if (imagesText.trim()) {
      images = imagesText.split('\n').filter(url => url.trim()).map(url => url.trim());
    }
    if (images.length === 0) {
      images = [
        "https://example.com/photos/1x1/photo.jpg",
        "https://example.com/photos/4x3/photo.jpg", 
        "https://example.com/photos/16x9/photo.jpg"
      ];
    }
    
    // Process authors
    let authors = [];
    if (authorsText.trim()) {
      try {
        const parsedAuthors = JSON.parse(authorsText);
        authors = parsedAuthors.map(author => ({
          "@type": "Person",
          "name": author.name || "Author Name",
          "url": author.url || "https://example.com/profile"
        }));
      } catch (e) {
        // Fallback to default authors if JSON parsing fails
        authors = [
          {
            "@type": "Person",
            "name": "Jane Doe",
            "url": "https://example.com/profile/janedoe123"
          },
          {
            "@type": "Person", 
            "name": "John Doe",
            "url": "https://example.com/profile/johndoe123"
          }
        ];
      }
    } else {
      authors = [
        {
          "@type": "Person",
          "name": "Jane Doe", 
          "url": "https://example.com/profile/janedoe123"
        },
        {
          "@type": "Person",
          "name": "John Doe",
          "url": "https://example.com/profile/johndoe123"
        }
      ];
    }
    
    // Format dates
    const formatDate = (dateValue) => {
      if (!dateValue) return new Date().toISOString();
      return new Date(dateValue).toISOString();
    };
    
    schema = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": headline,
      "image": images,
      "datePublished": formatDate(datePublished),
      "dateModified": formatDate(dateModified),
      "author": authors
    };
  } else {
    // Handle other schema types with their existing logic
    config.fields.forEach(field => {
      const element = document.getElementById(field.id);
      const value = element?.value || '';
      
      if (schemaType === 'organization') {
        if (field.id === 'orgName') schema.name = value || 'Your Organization Name';
        if (field.id === 'orgUrl') schema.url = value || 'https://example.com';
        if (field.id === 'orgLogo') schema.logo = value || 'https://example.com/logo.png';
      } else if (schemaType === 'article') {
        if (field.id === 'articleHeadline') schema.headline = value || 'Article Title';
        if (field.id === 'articleAuthor') {
          schema.author = {
            "@type": "Person",
            "name": value || 'Author Name'
          };
        }
        if (field.id === 'articleDate') {
          schema.datePublished = value ? new Date(value).toISOString().split('T')[0] : '2023-01-01';
        }
      } else if (schemaType === 'product') {
        if (field.id === 'productName') schema.name = value || 'Product Name';
        if (field.id === 'productImage') schema.image = value || 'https://example.com/product-image.jpg';
        if (field.id === 'productDescription') schema.description = value || 'Product description';
        if (field.id === 'productSku') schema.sku = value || '0446310786';
        if (field.id === 'productBrand') {
          schema.brand = {
            "@type": "Brand",
            "name": value || 'Brand Name'
          };
        }
      }
      // Add more schema types as needed
    });
  }
  
  return schema;
}

// Update preview
function updatePreview(schemaType) {
  const previewElement = document.getElementById('schemaPreview');
  const schema = generateSchema(schemaType);
  const jsonString = JSON.stringify(schema, null, 2);
  
  previewElement.textContent = jsonString;
  previewElement.innerHTML = highlightJson(previewElement.textContent);
}

// Schema type change handler
document.getElementById('schemaType').addEventListener('change', function() {
  const schemaType = this.value;
  generateFormFields(schemaType);
  updatePreview(schemaType);
});

// Initialize with default schema type
document.addEventListener('DOMContentLoaded', function() {
  const defaultSchemaType = 'organization';
  generateFormFields(defaultSchemaType);
  updatePreview(defaultSchemaType);
});

// Create implementation modal on the fly
document.body.insertAdjacentHTML('beforeend', `
<div class="modal fade" id="implementationModal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title"><i class="fas fa-code me-2"></i>Implementation Guide</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <h6>JSON-LD Implementation</h6>
        <p>Copy the generated code and paste it within the <code>&lt;head&gt;</code> section of your HTML:</p>
        <pre class="bg-light p-3"><code>&lt;script type="application/ld+json"&gt;
// Your schema code here
&lt;/script&gt;</code></pre>
        
        <h6 class="mt-3">Microdata Implementation</h6>
        <p>Microdata is added directly to your HTML elements using attributes:</p>
        <pre class="bg-light p-3"><code>&lt;div itemscope itemtype="http://schema.org/Product"&gt;
  &lt;span itemprop="name"&gt;Product Name&lt;/span&gt;
  &lt;img itemprop="image" src="product-image.jpg" alt="Product"&gt;
&lt;/div&gt;</code></pre>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
`);
