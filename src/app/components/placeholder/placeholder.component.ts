import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Format} from "../../models/format.model";

@Component({
  selector: 'app-placeholder',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './placeholder.component.html',
  styleUrl: './placeholder.component.scss'
})
export class PlaceholderComponent {
  allFormats: Format[] = [
    new Format('jpeg', 'JPEG'),
    new Format('png', 'PNG'),
    new Format('gif', 'GIF')
  ];
  imageUrl: string = 'https://placeholder.antonshell.me/img?width=500';

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
    format: ['png'],
    country: ['UK'],
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
