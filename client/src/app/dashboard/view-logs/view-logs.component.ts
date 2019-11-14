import { UtilityService } from './../../services/utility.service';
import { LogDay } from './../../models/log.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-logs',
  templateUrl: './view-logs.component.html',
  styleUrls: ['./view-logs.component.scss']
})
export class ViewLogsComponent implements OnInit {

  logsPayload: LogDay[] = [{date: new Date(), logs: [
    {id: '0', time: new Date(), context: {method: '', params: [], result: true}, description: 'nothing in particular', user: '0'},
    {id: '0', time: new Date(), context: {method: '', params: [], result: true}, description: 'nothing in particular', user: '0'},
    {id: '0', time: new Date(), context: {method: '', params: [], result: true}, description: 'nothing in particular', user: '0'},
    {id: '0', time: new Date(), context: {method: '', params: [], result: true}, description: 'nothing in particular', user: '0'}
  ]}];

  displayedColumns: string[] = ['time', 'description', 'user', 'id'];
  

  constructor(private UtilityServices: UtilityService) { }

  ngOnInit() {
    this.UtilityServices.getAdminLogs().subscribe( (resp: LogDay[]) => {
      console.log(resp);
      this.logsPayload = resp;
    });
  }

}
