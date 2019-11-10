import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(private http: HttpClient) { }

  /**
   * get admin logged actions for review
   */
  getAdminLogs() {
    return this.http.get(`${environment.apiAddress}/utils/logs`);
  }

}
