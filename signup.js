document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Registra o usuário no Firebase Authentication
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Usuário registrado com sucesso
            const user = userCredential.user;
            // Chama a função para enviar dados adicionais ao Firebase Realtime Database
            enviarDadosParaDatabase(user);
        })
        .catch((error) => {
            console.error('Erro no cadastro:', error.message);
            alert('Erro no cadastro: ' + error.message);
        });
});

function enviarDadosParaDatabase(user) {
    const nome = document.getElementById('nome').value; 
    const turma = document.getElementById('endereço').value;
    const curso = document.getElementById('telefone').value;

    // Defina o caminho no database onde os dados do usuário serão armazenados
    // 'users' é o nó principal e 'user.uid' cria um subnó com a ID única do usuário
    firebase.database().ref('users/' + user.uid).set({
        nome: nome,
        turma: turma,
        curso: curso
    }).then(() => {
        console.log('Dados adicionais armazenados com sucesso!');
        alert('Cadastro realizado com sucesso!');
        // Redireciona o usuário para a página de login ou de perfil
        window.location.href = 'login.html'; // ou outra página de sucesso
    }).catch((error) => {
        console.error('Erro ao enviar dados adicionais:', error);
        alert('Erro ao salvar dados adicionais: ' + error.message);
    });
}
