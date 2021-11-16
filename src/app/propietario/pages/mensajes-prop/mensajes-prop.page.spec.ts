import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MensajesPropPage } from './mensajes-prop.page';

describe('MensajesPropPage', () => {
  let component: MensajesPropPage;
  let fixture: ComponentFixture<MensajesPropPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MensajesPropPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MensajesPropPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', (e) => {
    console.log(e);
    
    expect(component).toBeTruthy();
  });
});
