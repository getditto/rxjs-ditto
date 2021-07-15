import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DittoService } from 'src/DittoService';
import { Document } from '@dittolive/ditto';
import { FormBuilder } from '@angular/forms';
import { toObservable } from '../../../../dist';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Ditto Angular Example';

  tasks$!: Observable<Document[]>;

  public newTask: string = '';

  newTaskForm = this.formBuilder.group({
    body: '',
  });

  constructor(
    private dittoService: DittoService,
    private formBuilder: FormBuilder
  ) {
    this.tasks$ = toObservable(
      dittoService.ditto.store.collection('tasks').findAll()
    );
  }

  addTask() {
    this.dittoService.ditto.store.collection('tasks').insert({
      value: {
        isDone: false,
        body: this.newTask,
      },
    });
    this.newTask = '';
  }

  toggleTask(task: Document) {
    this.dittoService.ditto.store
      .collection('tasks')
      .findByID(task.id)
      .update((mutableDoc) => {
        if (mutableDoc) {
          mutableDoc['isDone'] = !task.value.isDone;
        }
      });
  }

  removeTask(task: Document) {
    this.dittoService.ditto.store
      .collection('tasks')
      .findByID(task.id)
      .remove();
  }

  onSubmit(): void {
    this.dittoService.ditto.store.collection('tasks').insert({
      value: {
        isDone: false,
        body: this.newTaskForm.value.body,
      },
    });

    this.newTaskForm.reset();
  }
}
