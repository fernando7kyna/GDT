const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'Título é obrigatório']
  },
  descricao: {
    type: String,
    required: [true, 'Descrição é obrigatória']
  },
  categoria: {
    type: String,
    required: [true, 'Categoria é obrigatória']
  },
  status: {
    type: String,
    enum: ['Pendente', 'Em Andamento', 'Concluído'],
    default: 'Pendente'
  },
  prioridade: {
    type: String,
    enum: ['Baixa', 'Média', 'Alta'],
    default: 'Média'
  },
  dataCriacao: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Task', TaskSchema);
