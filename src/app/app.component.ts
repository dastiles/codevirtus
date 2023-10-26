import { Component, OnInit } from '@angular/core';
import { CompanyService } from './services/api/company/company.service';
import { faSignOut, faSearch, faBars } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title: string = 'My Dashboard';

  // icons
  faSignOut = faSignOut;
  faSearch = faSearch;
  faBars = faBars;

  constructor(private service: CompanyService) {}

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

  // search
  name = '';

  isModal: boolean = localStorage.getItem('token') !== null ? true : false;
  isRegistered: boolean = true;
  isLoggedTitle: string = 'Sign In';

  activeTab: string = 'addcompany';
  activeClass: boolean = this.activeTab === 'addCompany';

  companies: Array<any> = [];
  employees: Array<any> = [];
  searchedEmployees: Array<any> = [];

  ngOnInit(): void {
    this.service.getCompanies().subscribe({
      next: (data: any) => {
        this.companies = data;
      },
    });
    this.service.getEmployees().subscribe({
      next: (data: any) => {
        console.log(data);
        this.employees = data;
      },
    });
  }
  isopen: boolean = false;

  onMobile() {
    this.isopen = !this.isopen;
  }

  getActiveClass(tab: string) {
    this.activeClass = this.activeTab === tab;

    if (this.activeClass) {
      return 'text-red-600 bg-transparent py-2 hover:text-gray-400 transition-all';
    }

    return 'text-gray-400 bg-transparent py-2 hover:text-blue-600 transition-all';
  }

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
      this.service.loginUser(data).subscribe({
        next: (data: any) => {
          console.log(data);
          localStorage.setItem('token', data.access_token);
          location.reload();
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
    if (active === 'search') {
      this.service.getSearchEmployees(this.name).subscribe({
        next: (data: any) => {
          console.log(data[0]);
          this.searchedEmployees = data;
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
      name: this.company_name,
      address: this.company_address,
      date: this.date,
      industry: this.industry,
      description: this.description,
      phoneNumber: this.phone_number,
      imageUrl: this.image,
    };
    this.service.createCompany(data).subscribe({
      next: (data: any) => {
        console.log(data);
        this.activeTab = 'viewcompany';
        location.reload();
      },
    });
  }

  getCompanies() {}
}
