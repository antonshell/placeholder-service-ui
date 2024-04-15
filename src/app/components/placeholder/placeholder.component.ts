import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ColorPickerModule} from "ngx-color-picker";

@Component({
  selector: 'app-placeholder',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ColorPickerModule,
  ],
  templateUrl: './placeholder.component.html',
  styleUrl: './placeholder.component.scss'
})
export class PlaceholderComponent {
  public createForm: FormGroup;
  imageUrl: string;
  formats = [
    {name: 'jpeg', title: 'JPEG'},
    {name: 'png', title: 'PNG'},
    {name: 'gif', title: 'GIF'},
  ];

  textColor: string = '#fff';
  backgroundColor: string = '#888';

  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.createForm = this.formBuilder.group({
      text: ['Placeholder service', Validators.required],
      width: ['1024', Validators.required],
      height: ['250', Validators.required],
      textSize: ['28', Validators.required],
      format: new FormControl(this.formats[0]),
    });

    this.imageUrl = this.generateImageUrl();
  }

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

  get format() {
    return this.createForm.get('format');
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.createForm.invalid) {
      return;
    }

    this.imageUrl = this.generateImageUrl();
  }

  private generateImageUrl(): string
  {
    let url = 'https://placeholder.antonshell.me/img';
    url += '?text=' + this.text?.value;
    url += '&width=' + this.width?.value;
    url += '&height=' + this.height?.value;
    url += '&text_size=' + this.textSize?.value;
    url += '&color_text=' + this.textColor.replace('#', '');
    url += '&color_bg=' +  this.backgroundColor.replace('#', '');
    url += '&format=' + this.format?.value['name'];

    return url;
  }
}
