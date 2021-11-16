import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReservasActivasClientePage } from './reservas-activas-cliente.page';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../../../../environments/environment.prod';
import { RouterTestingModule } from "@angular/router/testing";

fdescribe('ReservasActivasClientePage', () => {
  let component: ReservasActivasClientePage;
  let fixture: ComponentFixture<ReservasActivasClientePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservasActivasClientePage ],
      imports: [
        IonicModule.forRoot(),
        IonicStorageModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebaseConfig),
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReservasActivasClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  fit('should create', () => {
    expect(component).toBeTruthy();
  });
});
