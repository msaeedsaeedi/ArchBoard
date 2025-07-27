import { Component, signal } from '@angular/core';
import { ApplicationNodeComponent } from '@components/node-editor/node/application-node/application-node.component';
import { NodeComponent } from '@components/node-editor/node/node.component';
import { Edge, Vflow, Connection, Background, DynamicNode } from 'ngx-vflow';

@Component({
  selector: 'app-board',
  imports: [Vflow],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent {
  bg: Background = {
    backgroundColor: '#FFF',
    type: 'dots',
    gap: 20,
    color: '#AAA',
  };

  public nodes: DynamicNode[] = [
    {
      id: '1',
      width: signal(48),
      data: signal({
        inputs: 2,
        outputs: 1,
        title: 'Application',
        data: {
          baseURL: 'https://archboard.com/',
        },
      }),
      point: signal({ x: 10, y: 200 }),
      type: ApplicationNodeComponent,
    },
    {
      id: '2',
      data: signal({
        title: 'Service',
        inputs: 1,
      }),
      point: signal({ x: 200, y: 100 }),
      type: NodeComponent,
    },
  ];

  public edges: Edge[] = [
    {
      id: '1 -> 2',
      source: '1',
      target: '2',
    },
  ];

  handleConnection(connection: Connection) {
    console.log('Attempting to connect: ', connection);
    this.edges = [
      ...this.edges,
      {
        id: `${connection.source} -> ${connection.target}`,
        ...connection,
      },
    ];
  }
}
