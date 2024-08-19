import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-letter',
  standalone: true,
  imports: [],
  templateUrl: './letter.component.html',
  styleUrl: './letter.component.scss',
})
export class LetterComponent {
  @Input() letter!: string;
  @Input() selected!: string;
  @Output() letterClicked = new EventEmitter<string>();

  chooseLetter() {
    this.letterClicked.emit(this.letter);
  }
}
