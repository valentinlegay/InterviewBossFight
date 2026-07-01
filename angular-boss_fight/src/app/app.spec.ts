import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render a contact button', async () => {
    const fixture = TestBed.createComponent(App);
    (fixture.componentInstance as any).contact.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.contact-btn');

    expect(button?.textContent).toContain('Envoyer un mail');
  });
});
