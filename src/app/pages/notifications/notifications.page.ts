import { Component, OnInit, AfterContentInit } from '@angular/core';
import { FutbolInnService } from '../../services/futbol-inn.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit, AfterContentInit {
  
  constructor(
  ) {
   }

  async ngOnInit() {
  }

  ngAfterContentInit(){
  }

  
}
