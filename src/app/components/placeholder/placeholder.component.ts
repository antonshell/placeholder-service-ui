import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-placeholder',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './placeholder.component.html',
  styleUrl: './placeholder.component.scss'
})
export class PlaceholderComponent {
  imageUrl: string = 'https://placeholder.antonshell.me/img?width=500';

  formats = [
    {name: 'jpeg', title: 'JPEG'},
    {name: 'png', title: 'PNG'},
    {name: 'gif', title: 'GIF'},
  ];

  constructor(
    private formBuilder: FormBuilder,
  ) {
  }

  public createForm: FormGroup = this.formBuilder.group({
    text: ['Placeholder service', Validators.required],
    width: ['1024', Validators.required],
    height: ['768', Validators.required],
    textSize: ['28'],
    textColor: ['000'],
    backgroundColor: ['fff'],
    format: new FormControl(this.formats[0]),
  });

  get text() {
    return this.createForm.get('text');
  }

  get width() {
    return this.createForm.get('width');
  }

  get height() {
    return this.createForm.get('height');
  }

  get textSize() {
    return this.createForm.get('textSize');
  }

  get textColor() {
    return this.createForm.get('textColor');
  }

  get backgroundColor() {
    return this.createForm.get('backgroundColor');
  }

  get format() {
    return this.createForm.get('format');
  }

  ngOnInit(): void {}

  onSubmit() {
    console.log('### onSubmit ###');
  }
}
