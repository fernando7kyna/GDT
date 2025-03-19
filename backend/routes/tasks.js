const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ dataCriacao: -1 });
    res.json(tasks);
  } catch (err) {
    console.error('Erro ao buscar tarefas:', err);
    res.status(500).json({ message: 'Erro ao buscar tarefas' });
  }
});

// Create task
router.post('/', async (req, res) => {
  try {
    const { titulo, descricao, categoria, status, prioridade } = req.body;

    if (!titulo || !descricao || !categoria) {
      return res.status(400).json({ message: 'Campos obrigatórios não preenchidos' });
    }

    const task = new Task({
      titulo,
      descricao,
      categoria,
      status: status || 'Pendente',
      prioridade: prioridade || 'Média',
      dataCriacao: new Date()
    });

    const newTask = await task.save();
    console.log('Tarefa criada:', newTask);
    res.status(201).json(newTask);
  } catch (err) {
    console.error('Erro ao criar tarefa:', err);
    res.status(400).json({ message: 'Erro ao criar tarefa', error: err.message });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const { titulo, descricao, categoria, status, prioridade } = req.body;

    if (!titulo || !descricao || !categoria) {
      return res.status(400).json({ message: 'Campos obrigatórios não preenchidos' });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { titulo, descricao, categoria, status, prioridade },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    console.log('Tarefa atualizada:', task);
    res.json(task);
  } catch (err) {
    console.error('Erro ao atualizar tarefa:', err);
    res.status(400).json({ message: 'Erro ao atualizar tarefa', error: err.message });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    console.log('Tarefa removida:', task);
    res.json({ message: 'Tarefa removida com sucesso' });
  } catch (err) {
    console.error('Erro ao remover tarefa:', err);
    res.status(500).json({ message: 'Erro ao remover tarefa', error: err.message });
  }
});

module.exports = router;
