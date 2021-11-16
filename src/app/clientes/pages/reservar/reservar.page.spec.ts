import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { ReservarPage } from './reservar.page';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../../../../environments/environment.prod';
import { IonicStorageModule } from '@ionic/storage-angular';
import { RouterTestingModule } from '@angular/router/testing';
import { ReservarPageRoutingModule } from './reservar-routing.module';

describe('ReservarPage', () => {
  let component: ReservarPage;
  let fixture: ComponentFixture<ReservarPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservarPage ],
      imports: [
        IonicModule.forRoot(), 
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        IonicStorageModule.forRoot(),
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReservarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
