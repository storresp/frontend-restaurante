
const loginBoton = document.getElementById('login');


    function login(logindata) {
        fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa(logindata) 
                }
            })

            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                sessionStorage.setItem('token', response.token);
                return response.json(); // Convertir la respuesta a JSON
            })

            .then(data => {
                sessionStorage.setItem('token', data.token);
                console.log('Respuesta del servidor:', data);
                window.location.href = "gestionpedidos.html";
            })
            

            .catch(error => {
                console.error('Error en la solicitud:', error);
                document.getElementById('Incorrectos').style.display= 'flex';
            })
    }

    if (loginBoton) {
        loginBoton.addEventListener('click', function (e) {
            e.preventDefault();
            const password = document.getElementById('password').value;
            const userBoton = document.getElementById('username').value;
            const logindata = userBoton+":"+password;
            login(logindata);
        });
    };
