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

// Organization form field update handlers
function updateOrganizationSchema() {
  const schemaType = document.getElementById('schemaType').value;
  if (schemaType !== 'organization') return;
  
  const name = document.getElementById('orgName').value || 'Example Corporation';
  const url = document.getElementById('orgUrl').value || 'https://www.example.com';
  const logo = document.getElementById('orgLogo').value || 'https://www.example.com/images/logo.png';
  const description = document.getElementById('orgDescription').value || 'The example corporation is well-known for producing high-quality widgets';
  const email = document.getElementById('orgEmail').value || 'contact@example.com';
  const telephone = document.getElementById('orgTelephone').value || '+47-99-999-9999';
  const vatID = document.getElementById('orgVatID').value || 'FR12345678901';
  const iso6523Code = document.getElementById('orgIso6523Code').value || '0199:724500PMK2A2M1SQQ228';
  
  // Handle sameAs URLs
  const sameAsInput = document.getElementById('orgSameAs').value;
  let sameAsArray = ['https://example.net/profile/example1234', 'https://example.org/example1234'];
  if (sameAsInput.trim()) {
    sameAsArray = sameAsInput.split(',').map(url => url.trim()).filter(url => url);
  }
  
  // Address components
  const streetAddress = document.getElementById('orgStreetAddress').value || 'Rue Improbable 99';
  const addressLocality = document.getElementById('orgAddressLocality').value || 'Paris';
  const addressRegion = document.getElementById('orgAddressRegion').value || 'Ile-de-France';
  const postalCode = document.getElementById('orgPostalCode').value || '75001';
  const addressCountry = document.getElementById('orgAddressCountry').value || 'FR';
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "url": url,
    "sameAs": sameAsArray,
    "logo": logo,
    "name": name,
    "description": description,
    "email": email,
    "telephone": telephone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": streetAddress,
      "addressLocality": addressLocality,
      "addressCountry": addressCountry,
      "addressRegion": addressRegion,
      "postalCode": postalCode
    },
    "vatID": vatID,
    "iso6523Code": iso6523Code
  };
  
  const previewElement = document.getElementById('schemaPreview');
  previewElement.textContent = JSON.stringify(schema, null, 2);
  previewElement.innerHTML = highlightJson(previewElement.textContent);
}

// Add event listeners for organization form fields
document.addEventListener('DOMContentLoaded', function() {
  const orgFields = [
    'orgName', 'orgUrl', 'orgLogo', 'orgDescription', 'orgEmail', 'orgTelephone',
    'orgSameAs', 'orgVatID', 'orgIso6523Code', 'orgStreetAddress', 'orgAddressLocality',
    'orgAddressRegion', 'orgPostalCode', 'orgAddressCountry'
  ];
  
  orgFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener('input', updateOrganizationSchema);
    }
  });
});

// Schema type change handler
document.getElementById('schemaType').addEventListener('change', function() {
  // In a real app, this would generate different form fields based on schema type
  const schemaType = this.value;
  const previewElement = document.getElementById('schemaPreview');
  
  // Simple example of changing preview based on schema type
  if (schemaType === 'article') {
    previewElement.textContent = `{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  },
  "datePublished": "2023-01-01"
}`;
  } else if (schemaType === 'product') {
    previewElement.textContent = `{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "image": "https://example.com/product-image.jpg",
  "description": "Product description",
  "sku": "0446310786",
  "brand": {
    "@type": "Brand",
    "name": "Brand Name"
  }
}`;
  } else if (schemaType === 'organization') {
    // Use the dynamic organization schema updater
    updateOrganizationSchema();
    return; // Don't apply highlighting yet, updateOrganizationSchema will do it
  } else {
    previewElement.textContent = `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "url": "https://www.example.com",
  "sameAs": ["https://example.net/profile/example1234", "https://example.org/example1234"],
  "logo": "https://www.example.com/images/logo.png",
  "name": "Example Corporation",
  "description": "The example corporation is well-known for producing high-quality widgets",
  "email": "contact@example.com",
  "telephone": "+47-99-999-9999",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rue Improbable 99",
    "addressLocality": "Paris",
    "addressCountry": "FR",
    "addressRegion": "Ile-de-France",
    "postalCode": "75001"
  },
  "vatID": "FR12345678901",
  "iso6523Code": "0199:724500PMK2A2M1SQQ228"
}`;
  }
  
  previewElement.innerHTML = highlightJson(previewElement.textContent);
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
