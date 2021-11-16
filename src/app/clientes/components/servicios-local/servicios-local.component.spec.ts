import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ServiciosLocalComponent } from './servicios-local.component';

describe('ServiciosLocalComponent', () => {
  let component: ServiciosLocalComponent;
  let fixture: ComponentFixture<ServiciosLocalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiciosLocalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ServiciosLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', (e) => {
    console.log(e);
    
    expect(component).toBeTruthy();
  });
});
