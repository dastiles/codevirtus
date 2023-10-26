import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private baseUrl: string = 'https://apidev2.codevirtus.com/api';
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }),
  };
  createUser(data: any) {
    let url = `${this.baseUrl}/v1/auth/register`;
    return this.http.post<any>(url, data);
  }
  loginUser(data: any) {
    let url = `${this.baseUrl}/v1/auth/authenticate`;
    return this.http.post<any>(url, data);
  }

  getCompanies() {
    let url = `${this.baseUrl}/company/all`;
    return this.http.get<any>(url, this.httpOptions);
  }

  getEmployees() {
    let url = `${this.baseUrl}/employee/all`;
    return this.http.get<any>(url, this.httpOptions);
  }

  createCompany(data: any) {
    let url = `${this.baseUrl}/company/add`;
    return this.http.post<any>(url, data, this.httpOptions);
  }

  getSearchEmployees(data: any) {
    let url = `${this.baseUrl}/employee/search?name=${data}`;
    return this.http.get<any>(url, this.httpOptions);
  }
}
