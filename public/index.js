/* main.js: JavaScript to interact with the banking system interface */
document.addEventListener("DOMContentLoaded", function() {
  console.log("main.js loaded");

  // Fade-in effect for elements with the class 'container'
  const container = document.querySelector('.container');
  if (container) {
    container.style.opacity = 0;
    container.style.transition = "opacity 1.5s ease-in-out";
    setTimeout(function() {
      container.style.opacity = 1;
    }, 200);
  }

  // Smooth scrolling for in-page anchor links (optional)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      e.preventDefault();
      const targetID = this.getAttribute("href");
      const targetElement = document.querySelector(targetID);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth"
        });
      }
    });
  });
});

/// Customers information update form interact function
function showEditModal(customer) {
  // Set the values in the form
  document.getElementById('customer_id').value = customer.customer_id;
  document.getElementById('fname').value = customer.fname;
  document.getElementById('lname').value = customer.lname;
  document.getElementById('address').value = customer.address || '';
  document.getElementById('phone').value = customer.phone || '';
  document.getElementById('email').value = customer.email;
  document.getElementById('birthdate').value = customer.birthdate ? new Date(customer.birthdate).toLocaleDateString() : '';
  
  // Display the modal
  document.getElementById('editModal').style.display = 'block';
}

function closeModal() {
  document.getElementById('editModal').style.display = 'none';
}

// Close the modal if user clicks outside of it
window.onclick = function(event) {
  const modal = document.getElementById('editModal');
  if (event.target === modal) {
    closeModal();
  }
}

/// Relationship update function 
document.getElementById('relationshipForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    relationshipType: document.getElementById('relationshipType').value,
    balanceAmount: document.getElementById('balanceAmount').value || 0
  };
  
  try {
    const response = await fetch('/api/relationships', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('Relationship created successfully!');
      window.location.reload();
    } else {
      alert('Error creating relationship: ' + result.error);
    }
  } catch (err) {
    alert('Error submitting form: ' + err);
  }
});

/// Securities interact update form 
 document.querySelectorAll('.edit-btn').forEach(button => {
  button.addEventListener('click', function() {
    const securityId = this.getAttribute('data-id');
    const accountId = this.getAttribute('data-account');
    const securityType = this.getAttribute('data-type');
    const purchasePrice = this.getAttribute('data-price');
    const purchaseType = this.getAttribute('data-purchase-type');
    const quantity = this.getAttribute('data-quantity');
    
    // Fill the form with security data
    document.getElementById('securityId').value = securityId;
    document.getElementById('accountId').value = accountId;
    document.getElementById('securityType').value = securityType;
    document.getElementById('purchasePrice').value = purchasePrice;
    document.getElementById('purchaseType').value = purchaseType;
    document.getElementById('quantity').value = quantity;
    
    // Scroll to the form
    document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
  });
});

// Form submission handler
document.getElementById('securityForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    securityId: document.getElementById('securityId').value || null,
    accountId: document.getElementById('accountId').value,
    securityType: document.getElementById('securityType').value,
    purchasePrice: document.getElementById('purchasePrice').value,
    purchaseType: document.getElementById('purchaseType').value,
    quantity: document.getElementById('quantity').value
  };
  
  try {
    const response = await fetch('/api/securities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('Security saved successfully!');
      window.location.reload();
    } else {
      alert('Error saving security: ' + result.error);
    }
  } catch (err) {
    alert('Error submitting form: ' + err);
  }
});

/// Relationships create form interact with front end
document.getElementById('relationshipForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    relationshipType: document.getElementById('relationshipType').value,
    balanceAmount: document.getElementById('balanceAmount').value || 0
  };
  
  try {
    const response = await fetch('/api/relationships', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('Relationship created successfully!');
      window.location.reload();
    } else {
      alert('Error creating relationship: ' + result.error);
    }
  } catch (err) {
    alert('Error submitting form: ' + err);
  }
});