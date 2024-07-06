const form = document.getElementById('loginForm')
form.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'email=' + encodeURIComponent(email) + '&password=' + encodeURIComponent(password)
    })
        .then(res => {
            res.json()
                .then(data => {
                    if (data.token) {
                        localStorage.setItem('token', data.token)
                        fetch('/users', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'text/html',
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            },
                        })
                            .then((response) => {
                                return response.text();
                            })
                            .then((html) => {
                                document.body.innerHTML = html;
                            });
                    } else {
                        console.log('token doesnt exists');
                    }
                })
        })
        .catch(err => {
            console.log(err);
        })
})