import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UbicacionMapaComponent } from './ubicacion-mapa.component';

describe('UbicacionMapaComponent', () => {
  let component: UbicacionMapaComponent;
  let fixture: ComponentFixture<UbicacionMapaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UbicacionMapaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UbicacionMapaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', (e) => {
    console.log(e);
    
    expect(component).toBeTruthy();
  });
});
