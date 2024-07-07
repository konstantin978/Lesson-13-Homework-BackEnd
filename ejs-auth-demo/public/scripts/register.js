document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const photoInput = document.getElementById('photo');
    const photoFile = photoInput.files[0];

    const photo = await readFileAsBase64(photoFile);

    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password, photo })
    })
    .then(res => res.json())
    .then(data => {
        if (data && data.message === 'User Successfully added') {
            window.location.href = '/login';
        } else if (data.message === 'User already exists') {
            console.log(data.message);
        }
    })
    .catch(err => {
        console.log(err);
    });
});

function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}