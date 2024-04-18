import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceholderComponent } from './placeholder.component';

describe('PlaceholderComponent', () => {
  let component: PlaceholderComponent;
  let fixture: ComponentFixture<PlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaceholderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.imageUrl).toEqual('https://placeholder.antonshell.me/img?text=Placeholder service&width=1024&height=250&text_size=28&color_text=fff&color_bg=888&format=jpeg');
  });

  it('onSubmit', () => {
    expect(component).toBeTruthy();

    component.width?.setValue('1920');
    component.height?.setValue('1080');
    component.textSize?.setValue('30');
    component.textColor = '#aaa';
    component.backgroundColor = '#000';
    component.format?.setValue(component.formats[1]);
    component.onSubmit();

    expect(component.imageUrl).toEqual('https://placeholder.antonshell.me/img?text=Placeholder service&width=1920&height=1080&text_size=30&color_text=aaa&color_bg=000&format=png');
  });

  it('onSubmit failure', () => {
    expect(component).toBeTruthy();

    component.width?.setValue('');
    component.height?.setValue('');
    component.onSubmit();

    expect(component.imageUrl).toEqual('https://placeholder.antonshell.me/img?text=Placeholder service&width=1024&height=250&text_size=28&color_text=fff&color_bg=888&format=jpeg');
  });
});
