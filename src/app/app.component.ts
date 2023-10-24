import { Component, OnInit } from '@angular/core';
import { CompanyService } from './services/api/company/company.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title: string = 'My Dashboard';

  constructor(private service: CompanyService) {}

  ngOnInit(): void {}
  isopen: boolean = false;

  onMobile() {
    this.isopen = !this.isopen;
  }
  // auth
  firstname: string = '';
  lastname: string = '';
  email: string = '';
  password: string = '';
  itemsArray: number[] = Array(6).fill(0);
  // add company forms
  company_name: string = '';
  company_address: string = '';
  date: string = '';
  industry: string = '';
  description: string = '';
  phone_number: string = '';
  image: string = '';

  isModal: boolean = localStorage.getItem('token') !== null ? true : false;
  isRegistered: boolean = true;
  isLoggedTitle: string = 'Sign In';

  activeTab: string = 'viewcompany';

  companies: Array<any> = [];
  employees: Array<any> = [];

  onCreateAccount() {
    if (this.isLoggedTitle === 'Sign In') {
      let data = {
        firstname: this.firstname,
        lastname: this.lastname,
        email: this.email,
        password: this.password,
      };
      this.service.createUser(data).subscribe({
        next: (data: any) => {
          localStorage.setItem('token', data.access_token);
          location.reload();
        },
      });
    } else {
      let data = {
        email: this.email,
        password: this.password,
      };
      this.service.createUser(data).subscribe({
        next: (data: any) => {
          console.log(data[0]);
          this.companies.push(data[0]);
        },
      });
    }
  }

  handleIsRegistered() {
    this.isRegistered = !this.isRegistered;
    if (this.isLoggedTitle === 'Sign In') {
      this.isLoggedTitle = 'Log In';
    } else {
      this.isLoggedTitle = 'Sign In';
    }
  }

  onLogout() {
    localStorage.removeItem('token');
    location.reload();
  }

  onClick(active: string) {
    if (this.activeTab === 'viewcompany') {
      this.service.getCompanies().subscribe({
        next: (data: any) => {
          console.log(data);
          this.companies = data;
        },
      });
    } else if (this.activeTab === 'viewemployees') {
      this.service.getCompanies().subscribe({
        next: (data: any) => {
          console.log(data);
          this.employees.push(data);
        },
      });
    }
    this.activeTab = active;
    this.isopen = !this.isopen;
  }

  onCompanySubmit() {
    if (
      !this.company_name ||
      !this.company_address ||
      !this.date ||
      !this.industry ||
      !this.description ||
      !this.phone_number ||
      !this.image
    ) {
      alert('please fill in the inputs');
      return;
    }
    let data = {
      company_name: this.company_name,
      company_address: this.company_address,
      date: this.date,
      industry: this.industry,
      description: this.description,
      phone_number: this.phone_number,
      image: this.image,
    };
    this.service.createCompany(data).subscribe({
      next: (data: any) => {
        this.companies = data[0][0];
      },
    });
  }

  getCompanies() {}
}
