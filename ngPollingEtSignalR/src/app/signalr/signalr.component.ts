import { Component, OnInit, signal } from '@angular/core';
import * as signalR from "@microsoft/signalr"
import { UselessTask } from '../models/UselessTask';


@Component({
  selector: 'app-signalr',
  templateUrl: './signalr.component.html',
  styleUrls: ['./signalr.component.css']
})
export class SignalrComponent implements OnInit {

  private hubConnection?: signalR.HubConnection;
  usercount = 0;
  tasks: UselessTask[] = [];
  taskname: string = "";

  ngOnInit(): void {
    this.connecttohub()
  }

  connecttohub() {
    // TODO On doit commencer par créer la connexion vers le Hub
    this.hubConnection = new signalR.HubConnectionBuilder().withUrl('http://localhost:5042/signalRHub').build();
    console.log(this.hubConnection);
    
    // TODO On peut commencer à écouter pour les évènements qui vont déclencher des callbacks
    this.hubConnection!.on('UserCount', (data) =>{
      this.usercount = data;
      console.log(this.usercount);
      
    });
    this.hubConnection.on('TaskList', (data) => {
      console.log(data);
      this.tasks = data;
    });
    // TODO On doit ensuite se connecter
    this.hubConnection
    .start()
    .then(() => {
      console.log('La connexion est live!');

    })
    .catch(err => console.log('Error while starting connection: ' + err))
  }

  complete(id: number) {
    // TODO On invoke la méthode pour compléter une tâche sur le serveur
    this.hubConnection!.invoke('TaskDone', id);
  }

  addtask() {
    // TODO On invoke la méthode pour ajouter une tâche sur le serveur
    this.hubConnection!.invoke('AddTask', this.taskname);
  }

}

