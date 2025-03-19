import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { DatePipe } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-task',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DatePipe
    ],
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  titulo: string = '';
  descricao: string = '';
  categoria: string = '';
  status: 'Pendente' | 'Em Andamento' | 'Concluído' = 'Pendente';
  prioridade: 'Baixa' | 'Média' | 'Alta' = 'Média';
  editingTask: Task | null = null;

  tasks: Task[] = [];
  filteredTasks: Task[] = [];

  filterCategoria: string = '';
  filterStatus: string = '';
  sortOption: string = '';

  username: string = '';
  userLocal: string = '';

  constructor(
    private taskService: TaskService,
    private toastr: ToastrService,
    private notification: NotificationService,
    private router: Router
  ) {
    this.username = localStorage.getItem('username') || 'Usuário';
    this.userLocal = localStorage.getItem('userLocal') || 'Local não definido';
  }

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        console.log('Tarefas carregadas:', tasks);
        this.tasks = tasks;
        this.filteredTasks = tasks;
        this.filterAndSortTasks();
      },
      error: (error) => {
        console.error('Erro ao carregar tarefas:', error);
        this.notification.showError('Erro ao carregar tarefas');
      }
    });
  }

  addOrUpdateTask() {
    if (!this.titulo.trim()) {
      this.notification.showError('O título é obrigatório');
      return;
    }
    if (!this.descricao.trim()) {
      this.notification.showError('A descrição é obrigatória');
      return;
    }
    if (!this.categoria.trim()) {
      this.notification.showError('A categoria é obrigatória');
      return;
    }

    const taskData = {
      titulo: this.titulo.trim(),
      descricao: this.descricao.trim(),
      categoria: this.categoria.trim(),
      status: this.status,
      prioridade: this.prioridade,
      dataCriacao: new Date()
    };

    console.log('Dados da tarefa:', taskData);

    if (this.editingTask) {
      const updatedTask = { ...this.editingTask, ...taskData };
      this.taskService.updateTask(updatedTask).subscribe({
        next: (task) => {
          console.log('Tarefa atualizada:', task);
          this.notification.showSuccess('Tarefa atualizada com sucesso!');
          this.loadTasks();
          this.clearForm();
        },
        error: (error) => {
          console.error('Erro ao atualizar tarefa:', error);
          this.notification.showError('Erro ao atualizar tarefa');
        }
      });
    } else {
      this.taskService.addTask(taskData as Task).subscribe({
        next: (task) => {
          console.log('Tarefa adicionada:', task);
          this.notification.showSuccess('Tarefa adicionada com sucesso!');
          this.loadTasks();
          this.clearForm();
        },
        error: (error) => {
          console.error('Erro ao adicionar tarefa:', error);
          this.notification.showError('Erro ao adicionar tarefa');
        }
      });
    }
  }

  editTask(task: Task) {
    this.editingTask = task;
    this.titulo = task.titulo;
    this.descricao = task.descricao;
    this.categoria = task.categoria;
    this.status = task.status;
    this.prioridade = task.prioridade;
  }

  clearForm() {
    this.editingTask = null;
    this.titulo = '';
    this.descricao = '';
    this.categoria = '';
    this.status = 'Pendente';
    this.prioridade = 'Média';
  }

  deleteTask(id: string) {
    if (id) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          console.log('Tarefa deletada:', id);
          this.notification.showWarning('Tarefa removida com sucesso!');
          this.loadTasks();
        },
        error: (error) => {
          console.error('Erro ao remover tarefa:', error);
          this.notification.showError('Erro ao remover tarefa');
        }
      });
    }
  }

  filterAndSortTasks() {
    let filtered = [...this.tasks];

    if (this.filterCategoria) {
      filtered = filtered.filter(task =>
        task.categoria.toLowerCase().includes(this.filterCategoria.toLowerCase())
      );
    }

    if (this.filterStatus) {
      filtered = filtered.filter(task => task.status === this.filterStatus);
    }

    if (this.sortOption === 'data') {
      filtered.sort((a, b) => {
        const dateA = a.dataCriacao ? new Date(a.dataCriacao).getTime() : 0;
        const dateB = b.dataCriacao ? new Date(b.dataCriacao).getTime() : 0;
        return dateB - dateA;
      });
    } else if (this.sortOption === 'prioridade') {
      const prioridadeOrder = { 'Alta': 1, 'Média': 2, 'Baixa': 3 };
      filtered.sort((a, b) => prioridadeOrder[a.prioridade] - prioridadeOrder[b.prioridade]);
    }

    this.filteredTasks = filtered;
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('userLocal');
    this.router.navigate(['/login']);
  }
}
