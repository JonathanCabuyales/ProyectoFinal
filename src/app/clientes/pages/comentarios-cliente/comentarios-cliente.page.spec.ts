import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ComentariosClientePage } from './comentarios-cliente.page';

describe('ComentariosClientePage', () => {
  let component: ComentariosClientePage;
  let fixture: ComponentFixture<ComentariosClientePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ComentariosClientePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ComentariosClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', (e) => {
    console.log(e);
    
    expect(component).toBeTruthy();
  });
});
