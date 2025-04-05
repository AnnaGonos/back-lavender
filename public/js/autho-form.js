const phoneOption = document.getElementById('phone-option');
const emailOption = document.getElementById('email-option');
const phoneInput = document.getElementById('phone-input');
const emailInput = document.getElementById('email-input');

phoneOption.addEventListener('click', function() {
    phoneInput.style.display = 'flex';
    emailInput.style.display = 'none';
    phoneOption.classList.add('active');
    emailOption.classList.remove('active');
});

emailOption.addEventListener('click', function() {
    emailInput.style.display = 'flex';
    phoneInput.style.display = 'none';
    emailOption.classList.add('active');
    phoneOption.classList.remove('active');
});