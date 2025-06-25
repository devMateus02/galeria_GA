import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import uploadRoute from './routes/upload.js'
import usuarioShema from './model/usuarioShema.js';
import imagemShema from  './model/imagemSchema.js'
import { autenticarToken, verificarAdmin } from './Middlewares/authController.js';
import { v2 as cloudinary } from 'cloudinary';



dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());


app.use(cors());
app.use('/upload', uploadRoute);



mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao Mongo:', err));

app.get('/fotos', async (req, res) => {
    try {
        const fotos = await imagemShema.find()
        res.status(200).send(fotos)
    } catch (error) {
        console.error('erro interno do servidor', error)
        res.status(500).send('erro interno no servidor')
    }
})

app.delete('/fotos/:id', autenticarToken, verificarAdmin, async (req, res) => {
  try {
    const imagem = await imagemShema.findById(req.params.id);

    if (!imagem) {
      return res.status(404).json({ error: 'Imagem não encontrada' });
    }

    // Exclui do Cloudinary usando o public_id
    await cloudinary.uploader.destroy(imagem.public_id);

    // Remove do MongoDB
    await imagemShema.findByIdAndDelete(req.params.id);

    res.status(200).json({ mensagem: 'Imagem excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir imagem:', error);
    res.status(500).json({ error: 'Erro ao excluir imagem' });
  }
});

app.delete('/fotos', autenticarToken, verificarAdmin, async (req, res) => {
  try {
    const imagens = await imagemShema.find();

    // Deleta todas no Cloudinary
    for (const imagem of imagens) {
      const partesUrl = imagem.url.split('/');
      const nomeArquivo = partesUrl[partesUrl.length - 1];
      const publicIdSemExtensao = nomeArquivo.split('.')[0];
      const publicIdFinal = `galeria/${publicIdSemExtensao}`;

      await cloudinary.uploader.destroy(publicIdFinal);
    }

    // Deleta todas do MongoDB
    await imagemShema.deleteMany({});

    res.status(200).json({ mensagem: 'Todas as imagens foram excluídas com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir todas as imagens:', error);
    res.status(500).json({ error: 'Erro ao excluir todas as imagens' });
  }
});

// Rota GET para o painel protegida apenas para usuario Adm

app.get('/painel', autenticarToken, verificarAdmin, (req, res) => {
  res.status(200).json({ mensagem: 'Bem-vindo ao painel de administrador!' });
});

// Rota POST para login
app.post('/login', async (req, res) => {
  const { nome, senha } = req.body;

  try {
    const usuario = await usuarioShema.findOne({nome});

    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ mensagem: 'Senha inválida' });
    }

    const token = jwt.sign(
      { id: usuario._id, nome: usuario.nome, status: usuario.status },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      mensagem: 'Login realizado com sucesso',
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        status: usuario.status
      },
      token
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
});




app.listen(PORT, () => {
  console.log(`Servidor rodando na porta: ${PORT}`);
});
