const firebaseConfig = {
  apiKey: "AIzaSyBV-AXEETR2Ujj_q2S0-6cSfGgiERqT_Ns",
  authDomain: "aula-20-05-a38d6.firebaseapp.com",
  projectId: "aula-20-05-a38d6",
  storageBucket: "aula-20-05-a38d6.appspot.com",
  messagingSenderId: "103465425487",
  appId: "1:103465425487:web:1141a46f19e38bf9baa83a"
};

firebase.initializeApp(firebaseConfig); // Inicialize o Firebase
const database = firebase.database(); // Inicialize o banco de dados
const storage = firebase.storage(); // Inicialize o storage

// Configuração para permitir CORS
const functions = firebase.functions();
const cors = functions.config().cors;
const allowedOrigins = cors ? cors.allowed_origins : ['*'];
const allowedHeaders = cors ? cors.allowed_headers : ['Content-Type', 'Authorization'];

function enableCors(req, res, next) {
  res.set('Access-Control-Allow-Origin', allowedOrigins.join(', '));
  res.set('Access-Control-Allow-Headers', allowedHeaders.join(', '));
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Max-Age', '3600');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
}

// Aplicar middleware para todas as solicitações
app.use(enableCors);

// Função para enviar dados para o Firebase
function enviarDadosParaFirebase() {
  const nomeAluno = document.getElementById('nome').value;
  const turma = document.getElementById('turma').value;
  const curso = document.getElementById('curso').value;
  const imagem = document.getElementById('imagem').files[0]; // Obtém o arquivo de imagem
  

  //Imagem
  if (imagem) {
    const storageRef = storage.ref('imagens/' + imagem.name);
    storageRef.put(imagem).then(snapshot => {
      snapshot.ref.getDownloadURL().then(downloadURL => {
        const dados = {
          nomeAluno: nomeAluno,
          turma: turma,
          curso: curso,
          imagemURL: downloadURL // Salva a URL da imagem
        };
        database.ref('alunos').push(dados)
        .then(() => {
          alert('Dados enviados com sucesso!');
          document.getElementById('nome').value = '';
          document.getElementById('turma').value = '';
          document.getElementById('curso').value = '';
          document.getElementById('imagem').value = '';
        })
        .catch(error => {
          console.error('Erro ao enviar os dados: ', error);
        });
      });
    }).catch(error => {
      console.error('Erro ao fazer upload da imagem: ', error);
    });
  } else {
    alert('Por favor, selecione uma imagem.');
  }
}
//Função para limpara campo *PESQUISA*
function limparConsulta() {
  document.getElementById('nomeConsulta').value = ''; // Limpar o campo de texto de consulta por nome
}

// Função para consultar dados dos alunos
function consultarAlunoPorNome() {
  const nome = document.getElementById('nomeConsulta').value.trim();
  const alunosRef = database.ref('alunos');
  alunosRef.orderByChild('nomeAluno').equalTo(nome).once('value', snapshot => {
    const data = snapshot.val();
    const lista = document.getElementById('listaAlunos');
    lista.innerHTML = ''; // Limpar lista anterior
    if (data) {
      Object.keys(data).forEach(key => {
        const aluno = data[key];
        const item = document.createElement('li');
        item.innerHTML = `Nome: ${aluno.nomeAluno}, Turma: ${aluno.turma}, Curso: 
          ${aluno.curso}, Imagem: <img src="${aluno.imagemURL}" alt="Imagem do Aluno" 
          style="width:100px; height:auto;">`;
        lista.appendChild(item);
      });
    } else {
      lista.innerHTML = '<li>Nenhum aluno encontrado com esse nome.</li>';
    }
  }).catch(error => {
    console.error('Erro ao buscar alunos: ', error);
  });
}
