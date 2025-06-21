import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const autenticarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });

    req.usuario = usuario; 
    next();
  });
};

export const verificarAdmin = (req, res, next) => {
  if (req.usuario?.status !== 'adm') {
    return res.status(403).json({ error: 'Acesso negado: apenas admins' });
  }
  next();
};
