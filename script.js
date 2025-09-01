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

// Generate form fields based on schema type
function generateFormFields(schemaType) {
  const formContainer = document.getElementById('formContainer');
  
  if (schemaType === 'profilePage') {
    formContainer.innerHTML = `
      <div class="mb-3">
        <label for="personName" class="form-label">Person Name</label>
        <input type="text" class="form-control" id="personName" placeholder="e.g., Angelo Huff" value="Angelo Huff">
      </div>
      <div class="mb-3">
        <label for="alternateName" class="form-label">Alternate Name (Username)</label>
        <input type="text" class="form-control" id="alternateName" placeholder="e.g., ahuff23" value="ahuff23">
      </div>
      <div class="mb-3">
        <label for="identifier" class="form-label">User Identifier</label>
        <input type="text" class="form-control" id="identifier" placeholder="e.g., 123475623" value="123475623">
      </div>
      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <input type="text" class="form-control" id="description" placeholder="e.g., Defender of Truth" value="Defender of Truth">
      </div>
      <div class="mb-3">
        <label for="imageUrl" class="form-label">Profile Image URL</label>
        <input type="url" class="form-control" id="imageUrl" placeholder="e.g., https://example.com/avatars/ahuff23.jpg" value="https://example.com/avatars/ahuff23.jpg">
      </div>
      <div class="mb-3">
        <label for="followCount" class="form-label">Follow Count</label>
        <input type="number" class="form-control" id="followCount" placeholder="1" value="1">
      </div>
      <div class="mb-3">
        <label for="likeCount" class="form-label">Like Count</label>
        <input type="number" class="form-control" id="likeCount" placeholder="5" value="5">
      </div>
      <div class="mb-3">
        <label for="writeCount" class="form-label">Write Count</label>
        <input type="number" class="form-control" id="writeCount" placeholder="2346" value="2346">
      </div>
      <div class="mb-3">
        <label for="sameAs1" class="form-label">Same As URL 1</label>
        <input type="url" class="form-control" id="sameAs1" placeholder="e.g., https://www.example.com/real-angelo" value="https://www.example.com/real-angelo">
      </div>
      <div class="mb-3">
        <label for="sameAs2" class="form-label">Same As URL 2</label>
        <input type="url" class="form-control" id="sameAs2" placeholder="e.g., https://example.com/profile/therealangelohuff" value="https://example.com/profile/therealangelohuff">
      </div>
    `;
    
    // Add event listeners to update preview when form values change
    const inputs = formContainer.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('input', function() {
        updateProfilePagePreview();
      });
    });
  } else {
    // Default form fields (organization)
    formContainer.innerHTML = `
      <div class="mb-3">
        <label for="orgName" class="form-label">Organization Name</label>
        <input type="text" class="form-control" id="orgName" placeholder="e.g., Google LLC">
      </div>
      <div class="mb-3">
        <label for="orgUrl" class="form-label">Website URL</label>
        <input type="url" class="form-control" id="orgUrl" placeholder="e.g., https://www.google.com">
      </div>
      <div class="mb-3">
        <label for="orgLogo" class="form-label">Logo URL</label>
        <input type="url" class="form-control" id="orgLogo" placeholder="e.g., https://www.google.com/logo.png">
      </div>
    `;
  }
}

// Update ProfilePage preview with form values
function updateProfilePagePreview() {
  const personName = document.getElementById('personName')?.value || 'Angelo Huff';
  const alternateName = document.getElementById('alternateName')?.value || 'ahuff23';
  const identifier = document.getElementById('identifier')?.value || '123475623';
  const description = document.getElementById('description')?.value || 'Defender of Truth';
  const imageUrl = document.getElementById('imageUrl')?.value || 'https://example.com/avatars/ahuff23.jpg';
  const followCount = parseInt(document.getElementById('followCount')?.value || '1');
  const likeCount = parseInt(document.getElementById('likeCount')?.value || '5');
  const writeCount = parseInt(document.getElementById('writeCount')?.value || '2346');
  const sameAs1 = document.getElementById('sameAs1')?.value || 'https://www.example.com/real-angelo';
  const sameAs2 = document.getElementById('sameAs2')?.value || 'https://example.com/profile/therealangelohuff';
  
  const now = new Date();
  const createdDate = now.toISOString().replace('Z', '-05:00');
  const modifiedDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().replace('Z', '-05:00');
  
  const sameAsArray = [];
  if (sameAs1) sameAsArray.push(sameAs1);
  if (sameAs2) sameAsArray.push(sameAs2);
  
  const schemaContent = `{
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "dateCreated": "${createdDate}",
  "dateModified": "${modifiedDate}",
  "mainEntity": {
    "@type": "Person",
    "name": "${personName}",
    "alternateName": "${alternateName}",
    "identifier": "${identifier}",
    "interactionStatistic": [{
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/FollowAction",
      "userInteractionCount": ${followCount}
    },{
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/LikeAction",
      "userInteractionCount": ${likeCount}
    }],
    "agentInteractionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/WriteAction",
      "userInteractionCount": ${writeCount}
    },
    "description": "${description}",
    "image": "${imageUrl}",
    "sameAs": [${sameAsArray.map(url => `"${url}"`).join(',\n      ')}]
  }
}`;

  const previewElement = document.getElementById('schemaPreview');
  previewElement.textContent = schemaContent;
  previewElement.innerHTML = highlightJson(previewElement.textContent);
}

// Generate schema preview based on type
function generateSchemaPreview(schemaType) {
  if (schemaType === 'profilePage') {
    // For ProfilePage, we'll call the update function which uses form values
    updateProfilePagePreview();
    return; // Don't set textContent directly, updateProfilePagePreview handles it
  } else if (schemaType === 'article') {
    return `{
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
    return `{
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
  } else {
    return `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Organization Name",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png"
}`;
  }
}

// Schema type change handler
document.getElementById('schemaType').addEventListener('change', function() {
  const schemaType = this.value;
  const previewElement = document.getElementById('schemaPreview');
  
  // Generate appropriate form fields
  generateFormFields(schemaType);
  
  // Generate schema preview
  if (schemaType === 'profilePage') {
    // For ProfilePage, call the update function directly
    updateProfilePagePreview();
  } else {
    const schemaContent = generateSchemaPreview(schemaType);
    previewElement.textContent = schemaContent;
    previewElement.innerHTML = highlightJson(previewElement.textContent);
  }
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
