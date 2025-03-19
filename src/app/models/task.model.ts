export interface Task {
  _id?: string;
  titulo: string;
  descricao: string;
  categoria: string;
  status: 'Pendente' | 'Em Andamento' | 'Concluído';
  prioridade: 'Baixa' | 'Média' | 'Alta';
  dataCriacao?: Date;
}
