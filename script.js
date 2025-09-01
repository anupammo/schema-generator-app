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

// Initialize form fields and preview on page load
document.addEventListener('DOMContentLoaded', function() {
  const initialSchemaType = document.getElementById('schemaType').value;
  generateFormFields(initialSchemaType);
  updatePreview();
});

// Form field configurations for each schema type
const schemaFormConfigs = {
  organization: [
    { id: 'orgName', label: 'Organization Name', type: 'text', placeholder: 'e.g., Google LLC' },
    { id: 'orgUrl', label: 'Website URL', type: 'url', placeholder: 'e.g., https://www.google.com' },
    { id: 'orgLogo', label: 'Logo URL', type: 'url', placeholder: 'e.g., https://www.google.com/logo.png' }
  ],
  localBusiness: [
    { id: 'businessName', label: 'Business Name', type: 'text', placeholder: 'e.g., Joe\'s Coffee Shop' },
    { id: 'businessAddress', label: 'Address', type: 'text', placeholder: 'e.g., 123 Main St, City, State 12345' },
    { id: 'businessPhone', label: 'Phone Number', type: 'tel', placeholder: 'e.g., +1-555-123-4567' },
    { id: 'businessUrl', label: 'Website URL', type: 'url', placeholder: 'e.g., https://www.joescoffee.com' }
  ],
  article: [
    { id: 'articleHeadline', label: 'Article Headline', type: 'text', placeholder: 'e.g., How to Create Schema Markup' },
    { id: 'articleAuthor', label: 'Author Name', type: 'text', placeholder: 'e.g., John Doe' },
    { id: 'articleDate', label: 'Published Date', type: 'date', placeholder: '' },
    { id: 'articleImage', label: 'Featured Image URL', type: 'url', placeholder: 'e.g., https://example.com/article-image.jpg' }
  ],
  product: [
    { id: 'productName', label: 'Product Name', type: 'text', placeholder: 'e.g., iPhone 15 Pro' },
    { id: 'productImage', label: 'Product Image URL', type: 'url', placeholder: 'e.g., https://example.com/product-image.jpg' },
    { id: 'productDescription', label: 'Description', type: 'textarea', placeholder: 'e.g., Latest iPhone with advanced features' },
    { id: 'productSku', label: 'SKU', type: 'text', placeholder: 'e.g., IP15P-128-BLU' },
    { id: 'productBrand', label: 'Brand Name', type: 'text', placeholder: 'e.g., Apple' }
  ],
  event: [
    { id: 'eventName', label: 'Event Name', type: 'text', placeholder: 'e.g., Tech Conference 2024' },
    { id: 'eventStartDate', label: 'Start Date', type: 'datetime-local', placeholder: '' },
    { id: 'eventEndDate', label: 'End Date', type: 'datetime-local', placeholder: '' },
    { id: 'eventLocation', label: 'Location', type: 'text', placeholder: 'e.g., Convention Center, New York' },
    { id: 'eventDescription', label: 'Description', type: 'textarea', placeholder: 'e.g., Annual technology conference featuring latest innovations' }
  ],
  person: [
    { id: 'personName', label: 'Full Name', type: 'text', placeholder: 'e.g., John Doe' },
    { id: 'personJobTitle', label: 'Job Title', type: 'text', placeholder: 'e.g., Software Engineer' },
    { id: 'personCompany', label: 'Company', type: 'text', placeholder: 'e.g., Google LLC' },
    { id: 'personEmail', label: 'Email', type: 'email', placeholder: 'e.g., john.doe@example.com' }
  ],
  webpage: [
    { id: 'webpageName', label: 'Page Title', type: 'text', placeholder: 'e.g., About Us - Company Name' },
    { id: 'webpageDescription', label: 'Page Description', type: 'textarea', placeholder: 'e.g., Learn more about our company and mission' },
    { id: 'webpageUrl', label: 'Page URL', type: 'url', placeholder: 'e.g., https://example.com/about' }
  ]
};

// Function to generate form fields based on schema type
function generateFormFields(schemaType) {
  const formContainer = document.getElementById('formContainer');
  const config = schemaFormConfigs[schemaType] || schemaFormConfigs.organization;
  
  formContainer.innerHTML = '';
  
  config.forEach(field => {
    const fieldDiv = document.createElement('div');
    fieldDiv.className = 'mb-3';
    
    const label = document.createElement('label');
    label.setAttribute('for', field.id);
    label.className = 'form-label';
    label.textContent = field.label;
    
    let input;
    if (field.type === 'textarea') {
      input = document.createElement('textarea');
      input.className = 'form-control';
      input.rows = 3;
    } else {
      input = document.createElement('input');
      input.type = field.type;
      input.className = 'form-control';
    }
    
    input.id = field.id;
    input.placeholder = field.placeholder;
    
    // Add event listener for real-time preview updates
    input.addEventListener('input', updatePreview);
    
    fieldDiv.appendChild(label);
    fieldDiv.appendChild(input);
    formContainer.appendChild(fieldDiv);
  });
}

// Function to update preview based on current form values
function updatePreview() {
  const schemaType = document.getElementById('schemaType').value;
  const previewElement = document.getElementById('schemaPreview');
  
  let schemaData = {
    "@context": "https://schema.org"
  };
  
  // Get form values and build schema based on type
  if (schemaType === 'organization') {
    schemaData["@type"] = "Organization";
    schemaData.name = document.getElementById('orgName')?.value || "Your Organization Name";
    schemaData.url = document.getElementById('orgUrl')?.value || "https://example.com";
    schemaData.logo = document.getElementById('orgLogo')?.value || "https://example.com/logo.png";
  } else if (schemaType === 'localBusiness') {
    schemaData["@type"] = "LocalBusiness";
    schemaData.name = document.getElementById('businessName')?.value || "Your Business Name";
    schemaData.address = document.getElementById('businessAddress')?.value || "123 Main St, City, State";
    schemaData.telephone = document.getElementById('businessPhone')?.value || "+1-555-123-4567";
    schemaData.url = document.getElementById('businessUrl')?.value || "https://yourbusiness.com";
  } else if (schemaType === 'article') {
    schemaData["@type"] = "Article";
    schemaData.headline = document.getElementById('articleHeadline')?.value || "Article Title";
    schemaData.author = {
      "@type": "Person",
      "name": document.getElementById('articleAuthor')?.value || "Author Name"
    };
    schemaData.datePublished = document.getElementById('articleDate')?.value || "2023-01-01";
    schemaData.image = document.getElementById('articleImage')?.value || "https://example.com/article-image.jpg";
  } else if (schemaType === 'product') {
    schemaData["@type"] = "Product";
    schemaData.name = document.getElementById('productName')?.value || "Product Name";
    schemaData.image = document.getElementById('productImage')?.value || "https://example.com/product-image.jpg";
    schemaData.description = document.getElementById('productDescription')?.value || "Product description";
    schemaData.sku = document.getElementById('productSku')?.value || "0446310786";
    schemaData.brand = {
      "@type": "Brand",
      "name": document.getElementById('productBrand')?.value || "Brand Name"
    };
  } else if (schemaType === 'event') {
    schemaData["@type"] = "Event";
    schemaData.name = document.getElementById('eventName')?.value || "Event Name";
    schemaData.startDate = document.getElementById('eventStartDate')?.value || "2024-01-01T10:00:00";
    schemaData.endDate = document.getElementById('eventEndDate')?.value || "2024-01-01T18:00:00";
    schemaData.location = document.getElementById('eventLocation')?.value || "Event Location";
    schemaData.description = document.getElementById('eventDescription')?.value || "Event description";
  } else if (schemaType === 'person') {
    schemaData["@type"] = "Person";
    schemaData.name = document.getElementById('personName')?.value || "Person Name";
    schemaData.jobTitle = document.getElementById('personJobTitle')?.value || "Job Title";
    schemaData.worksFor = {
      "@type": "Organization",
      "name": document.getElementById('personCompany')?.value || "Company Name"
    };
    schemaData.email = document.getElementById('personEmail')?.value || "person@example.com";
  } else if (schemaType === 'webpage') {
    schemaData["@type"] = "WebPage";
    schemaData.name = document.getElementById('webpageName')?.value || "Page Title";
    schemaData.description = document.getElementById('webpageDescription')?.value || "Page description";
    schemaData.url = document.getElementById('webpageUrl')?.value || "https://example.com/page";
  }
  
  previewElement.textContent = JSON.stringify(schemaData, null, 2);
  previewElement.innerHTML = highlightJson(previewElement.textContent);
}

// Schema type change handler
document.getElementById('schemaType').addEventListener('change', function() {
  const schemaType = this.value;
  generateFormFields(schemaType);
  updatePreview();
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
