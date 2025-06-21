import express from 'express';
import upload from '../config/cloudinary.js';
import Imagem from '../model/imagemSchema.js';
import { autenticarToken, verificarAdmin } from '../Middlewares/authController.js';

const router = express.Router();

router.post(
  '/',
  autenticarToken,
  verificarAdmin,
  upload.array('fotos', 30), // 'foto' deve bater com o nome usado no formData.append('foto', ...)
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'Nenhuma imagem enviada' });
      }

      // Cria um array de documentos para salvar no banco
      const imagens = req.files.map(file => ({ url: file.path, public_id: file.filename}));
      await Imagem.insertMany(imagens);

      res.status(201).json({
        message: 'Upload feito com sucesso!',
        urls: imagens.map(img => img.url)
      });
    } catch (error) {
      console.error('Erro no upload:', error);
      res.status(500).json({ error: 'Erro ao salvar imagens' });
    }
  }
);

export default router;
