import { UtilityService } from './../../services/utility.service';
import { LogDay } from './../../models/log.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-logs',
  templateUrl: './view-logs.component.html',
  styleUrls: ['./view-logs.component.scss']
})
export class ViewLogsComponent implements OnInit {

  logsPayload: LogDay[] = [];

  constructor(private UtilityServices: UtilityService) { }

  ngOnInit() {
    this.UtilityServices.getAdminLogs().subscribe( (resp: LogDay[]) => {
      console.log(resp);
    });
  }

}
