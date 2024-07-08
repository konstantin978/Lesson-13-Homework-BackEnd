document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const file = document.getElementById('file').files[0];
    const formData = new FormData();

    formData.append('file', file);
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);

    fetch('/api/register', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data && data.message === 'User Successfully added') {
            window.location.href = '/login';
        } else {
            console.log(data.message);
        }
    })
    .catch(err => {
        console.log(err);
    });
});
