const form = document.getElementById('registerForm')
        form.addEventListener('submit', (e) => {
            e.preventDefault()

            const username = document.getElementById('username').value
            const email = document.getElementById('email').value
            const password = document.getElementById('password').value

            fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            })
                .then(res => {
                    res.json()
                        .then(data => {
                            if (data && data.message === 'User Succesfully added') {
                                window.location.href = '/login';
                            } else if (data.message === 'User already exists') {
                                console.log(data.message);
                            }
                        })
                })

                .catch(err => {
                    console.log(err);
                })
        })