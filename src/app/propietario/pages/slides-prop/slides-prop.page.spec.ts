import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SlidesPropPage } from './slides-prop.page';

describe('SlidesPropPage', () => {
  let component: SlidesPropPage;
  let fixture: ComponentFixture<SlidesPropPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SlidesPropPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SlidesPropPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', (e) => {
    console.log(e);
    
    expect(component).toBeTruthy();
  });
});
