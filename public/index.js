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

/// Fix syntax of ejs and js in customers 
function handleEditClick(button) {
  const customer = JSON.parse(button.getAttribute('data-customer'));
  showEditModal(customer);
}