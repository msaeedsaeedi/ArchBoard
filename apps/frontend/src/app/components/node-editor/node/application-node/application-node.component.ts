import { Component, computed } from '@angular/core';
import { NodeComponent } from '../node.component';
import { Vflow } from 'ngx-vflow';

export interface ApplicationNodeData {
  baseURL: string;
}

@Component({
  selector: 'app-application-node',
  imports: [Vflow],
  templateUrl: './application-node.component.html',
  styleUrl: './application-node.component.css',
})
export class ApplicationNodeComponent extends NodeComponent<ApplicationNodeData> {
  baseURL = computed(() => this.data()?.data?.baseURL);

  override ngAfterViewInit(): void {
    console.log(this.node().data?.());
  }
}
