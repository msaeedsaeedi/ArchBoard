import { AfterViewInit, Component, computed } from '@angular/core';
import { CustomDynamicNodeComponent, Vflow } from 'ngx-vflow';

export interface NodeData<T = unknown> {
  title: string;
  inputs?: number;
  outputs?: number;
  data?: T;
}

@Component({
  selector: 'app-node',
  imports: [Vflow],
  styleUrl: './node.component.css',
  templateUrl: './node.component.html',
})
export class NodeComponent<T>
  extends CustomDynamicNodeComponent<NodeData<T>>
  implements AfterViewInit
{
  inputs = computed(() => Array.from({ length: this.data()?.inputs || 0 }));
  outputs = computed(() => Array.from({ length: this.data()?.outputs || 0 }));
  title = computed(() => this.data()?.title);

  ngAfterViewInit(): void {
    console.log(this.data());
  }
}
