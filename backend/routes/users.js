const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Rota de registro
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, local } = req.body;

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'Usuário ou email já cadastrado' 
      });
    }

    // Criar novo usuário
    const user = new User({
      username,
      email,
      password,
      local
    });

    await user.save();

    res.status(201).json({ 
      message: 'Usuário criado com sucesso',
      user: {
        username: user.username,
        email: user.email,
        local: user.local
      }
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ 
      message: 'Erro ao criar usuário' 
    });
  }
});

// Rota de login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar usuário
    const user = await User.findOne({ username });

    // Verificar se usuário existe
    if (!user) {
      return res.status(401).json({
        message: 'Usuário não encontrado'
      });
    }

    // Verificar se a senha está correta
    if (user.password !== password) {
      return res.status(401).json({
        message: 'Senha incorreta'
      });
    }

    // Login bem sucedido
    res.json({
      message: 'Login realizado com sucesso',
      user: {
        username: user.username,
        email: user.email,
        local: user.local
      }
    });

  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({
      message: 'Erro ao fazer login'
    });
  }
});

// Rota para atualizar local de todos os usuários
router.post('/update-all-locations', async (req, res) => {
  try {
    // Atualizar todos os usuários que não têm local definido
    const result = await User.updateMany(
      { local: { $exists: false } },
      { $set: { local: 'Brasília/DF' } }
    );

    res.json({
      message: 'Locais atualizados com sucesso',
      usersUpdated: result.modifiedCount
    });
  } catch (error) {
    console.error('Erro ao atualizar locais:', error);
    res.status(500).json({
      message: 'Erro ao atualizar locais dos usuários'
    });
  }
});

// Rota para atualizar senha
router.post('/update-password', async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body;

    // Buscar usuário
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        message: 'Usuário não encontrado'
      });
    }

    // Verificar senha antiga
    if (user.password !== oldPassword) {
      return res.status(401).json({
        message: 'Senha atual incorreta'
      });
    }

    // Atualizar senha
    user.password = newPassword;
    await user.save();

    res.json({
      message: 'Senha atualizada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    res.status(500).json({
      message: 'Erro ao atualizar senha'
    });
  }
});

module.exports = router; 