document.getElementById('toggle-button').addEventListener('click', function() {
    var hiddenText = document.getElementById('more-text');
    var toggleButton = document.getElementById('toggle-button');

    hiddenText.classList.toggle('hidden');

    if (hiddenText.classList.contains('hidden')) {
        toggleButton.textContent = 'Read more';
    } else {
        toggleButton.textContent = 'Read less';
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('.email-form');
    const checkmarkContainer = document.getElementById('checkmark-container');
    const messageDiv = document.getElementById('message');

    forms.forEach(function(form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Loading...';

            const formData = new FormData(form);

            fetch("/post-subscribe", {
                method: "POST",
                body: new URLSearchParams(formData),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText} (status: ${response.status})`);
                }
                return response.json();
            })
            .then(data => {
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Submit';

                    if (data.success) {
                        // Handle success and update UI to show subscription is completed
                        messageDiv.textContent = 'Subscription successful! You will receive daily forecasts.';
                        messageDiv.classList.add('success');
                        checkmarkContainer.classList.add('show');
                    } else {
                        messageDiv.textContent = 'Subscription failed. Please try again.';
                        messageDiv.classList.add('error');
                    }
                }, 1000); // Delay of 1 second
            })
            .catch(error => {
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Submit';
                    messageDiv.textContent = 'An error occurred. Please try again later.';
                    messageDiv.classList.add('error');
                    console.error("Error marking subscription as completed:", error);
                }, 1000); // Delay of 1 second
            });
        });
    });
});
