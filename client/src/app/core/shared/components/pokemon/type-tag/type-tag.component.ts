import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-type-tag',
  templateUrl: './type-tag.component.html',
  styleUrl: './type-tag.component.scss'
})
export class TypeTagComponent {
  @Input() typeName: string = '';
  @Input() backgroundColor: string = '#000000';
  @Input() isIcon = false;

  getTypeIcon(type: string): string {
    return `assets/icons/types/${type.toLowerCase()}.svg`;
  }
}
