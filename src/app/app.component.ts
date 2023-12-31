import { Component, OnInit } from '@angular/core';
import { CompanyService } from './services/api/company/company.service';
import { faSignOut, faSearch, faBars } from '@fortawesome/free-solid-svg-icons';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  query,
  stagger,
} from '@angular/animations';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('stagger', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true }),
        query(
          ':enter',
          stagger('200ms', [animate('500ms', style({ opacity: 1 }))]),
          { optional: true }
        ),
      ]),
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
    ]),
    trigger('inputAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('500ms', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
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
  isLoading: boolean = false;

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
      return 'text-blue-600 bg-transparent py-2 hover:text-black transition-all';
    }

    return 'text-black bg-transparent py-2 hover:text-blue-600 transition-all';
  }

  onCreateAccount() {
    this.isLoading = true;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (this.isLoggedTitle === 'Sign In') {
      if (!this.firstname || !this.lastname || !this.email || !this.password) {
        this.service.showAlert('Please fill in all inputs', 'alert-error');
        this.isLoading = false;
        return;
      }
      if (!emailRegex.test(this.email)) {
        this.service.showAlert('Invalid Email', 'alert-error');
        this.isLoading = false;
        return;
      }

      if (this.password.length < 6) {
        this.service.showAlert('Password too short', 'alert-error');
        this.isLoading = false;
        return;
      }
      let data = {
        firstname: this.firstname,
        lastname: this.lastname,
        email: this.email,
        password: this.password,
      };
      this.service.createUser(data).subscribe({
        next: (data: any) => {
          this.service.showAlert('Successfully Logged', 'alert-success');
          localStorage.setItem('token', data.access_token);
          location.reload();
        },
        error: (error) => {
          console.log(error);
          if (error.status === 403) {
            this.service.showAlert('Email Already registered', 'alert-error');
          } else {
            this.service.showAlert('Something went wrong', 'alert-error');
          }
        },
      });
    } else {
      if (!this.email || !this.password) {
        this.service.showAlert('Please fill in all inputs', 'alert-error');
        this.isLoading = false;
        return;
      }
      if (!emailRegex.test(this.email)) {
        this.service.showAlert('Invalid Email', 'alert-error');
        this.isLoading = false;
        return;
      }

      let data = {
        email: this.email,
        password: this.password,
      };

      this.service.loginUser(data).subscribe({
        next: (data: any) => {
          console.log(data);
          this.service.showAlert('Successfully Logged', 'alert-success');
          localStorage.setItem('token', data.access_token);
          location.reload();
        },
        error: (error) => {
          this.service.showAlert('Something went wrong', 'alert-error');
        },
      });
    }
    this.isLoading = false;
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
    this.service.showAlert('You have successfully logged out', '');
    location.reload();
  }

  onClick(active: string) {
    this.activeTab = active;
    this.isopen = !this.isopen;
  }
  onNameSearch(active: string) {
    if (active === '') {
      this.service.showAlert('PLease Fill in a name', 'alert-error');
      this.isLoading = false;
      return;
    }
    this.service.getSearchEmployees(this.name).subscribe({
      next: (data: any) => {
        console.log(data[0]);
        this.searchedEmployees = data;
      },
      error: (error) => {
        console.log(error);
        this.service.showAlert('Something went wrong', 'alert-error');
      },
    });
    this.activeTab = active;
  }

  onCompanySubmit() {
    this.isLoading = true;
    const regex = /^07\d{8}$/;
    if (
      !this.company_name ||
      !this.company_address ||
      !this.date ||
      !this.industry ||
      !this.description ||
      !this.phone_number ||
      !this.image
    ) {
      this.service.showAlert('PLease Fill in all inputs', 'alert-error');
      this.isLoading = false;
      return;
    }

    if (!regex.test(this.phone_number)) {
      this.service.showAlert('Invalid phone number format ', 'alert-error');
      this.isLoading = false;
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
      error: (error) => {
        console.log(error);

        this.service.showAlert('Something went wrong', 'alert-error');
      },
    });

    this.isLoading = false;
  }

  getCompanies() {}
}
