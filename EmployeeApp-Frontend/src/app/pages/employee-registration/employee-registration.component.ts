

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employee-registration',
  templateUrl: './employee-registration.component.html',
  styleUrls: ['./employee-registration.component.css']
})
export class EmployeeRegistrationComponent implements OnInit {
  showDashboard: boolean = false;
  showEmployees: boolean = false;
  employeeList: any[] = [];
  isListView: boolean = true;
  toggleView(isDashboard: boolean) {
    // this.showDashboard = isDashboard;

    // this.showEmployees = !isDashboard;
    this.showDashboard = isDashboard;
    this.showEmployees = !isDashboard;
    this.isListView = false;

  }

  // Define hardcoded departments
  departments: any[] = [
    { deptId: 1, deptName: 'Department 1' },
    { deptId: 2, deptName: 'Department 2' },
    { deptId: 3, deptName: 'Department 3' }
    // Add more departments as needed
  ];



  employeeObject: any = {
    "onedit": false,
    "first_name": "",
    "last_name": "",
    "department": 0,
    "role": "HR",
    "salary": 0,
    "bonus": 0,
    "phone_number": "",
    "hire_date": "2022-03-31"
  };


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadEmployees();
  }




  // Load employees from backend
  loadEmployees() {
    const token = localStorage.getItem("empToken");
    const headers = {
      'Authorization': `Bearer ${token}` // Assuming the token is a Bearer token
    };
    this.http.get<any>("http://127.0.0.1:8000/all-emp/", { headers }).subscribe((res: any) => {
      this.employeeList = res;
    });
  }

  toggleListView() {
    this.isListView = !this.isListView;
    this.employeeObject.onedit = !this.employeeObject.onedit
    // this.isListView = !this.isListView;
    this.showDashboard = false;
    this.showEmployees = false;
    if (this.isListView) {
      const currentDate = new Date();
      const hireDate = currentDate.toISOString().split('T')[0];
      // Reset employee object when switching to list view
      this.employeeObject = {
        "first_name": "",
        "last_name": "",
        "department": 0,
        "role": "HR",
        "salary": 0,
        "bonus": 0,
        "phone_number": "",
        "hire_date": hireDate
      };
    }
  }

  calculateAverageSalary(): number {
    let totalSalary = 0;
    for (const emp of this.employeeList) {
      totalSalary += emp.salary;
    }
    return totalSalary / this.employeeList.length;
  }


  getRoleCounts(): { [role: string]: number } {
    const roleCounts: { [role: string]: number } = {};
  
    // Initialize counts for each role to zero
    for (const emp of this.employeeList) {
      roleCounts[emp.role] = 0;
    }
  
    // Count occurrences of each role
    for (const emp of this.employeeList) {
      roleCounts[emp.role]++;
    }
  
    return roleCounts;
  }
  getDepartmentCounts(): { [role: string]: number } {
    const departmentcounts: { [role: string]: number } = {};
  
    // Initialize counts for each role to zero
    for (const emp of this.employeeList) {
      departmentcounts[emp.department] = 0;
    }
  
    // Count occurrences of each role
    for (const emp of this.employeeList) {
      departmentcounts[emp.department]++;
    }
  
    return departmentcounts;
  }
  

  department: string[] = ['HR', 'IT', 'Management'];
  roles: string[] = ['Software Engineer', 'Frontend Developer', 'Backend Developer'];

  getRandomDepartment(): string {
    const index = Math.floor(Math.random() * this.department.length);
    return this.departments[index];
  }

  getRandomRole(): string {
    const index = Math.floor(Math.random() * this.roles.length);
    return this.roles[index];
  }
  onCreateEmp(empId: number) {
    // Assuming selectedDeptId is obtained properly
    const currentDate = new Date();
    const hireDate = currentDate.toISOString().split('T')[0];
    // this.employeeObject.hire_date = hireDate;
    const departmentOptions = [0, 1, 2]; // Assuming department options are represented by integers 0, 1, 2
    const roleOptions = [0, 1, 2]; // Assuming role options are represented by integers 0, 1, 2

    const randomDepartmentIndex = Math.floor(Math.random() * departmentOptions.length);
    const randomRoleIndex = Math.floor(Math.random() * roleOptions.length);


    // Construct the employee data object
    const employeeData = {
      "id": this.employeeObject.id,
      "first_name": this.employeeObject.first_name,
      "last_name": this.employeeObject.last_name,
      // "department": selectedDeptId,
      // "role": this.employeeObject.role,
      "salary": this.employeeObject.salary,
      "bonus": this.employeeObject.bonus,
      "phone_number": this.employeeObject.phone_number,
      // "hire_date": this.employeeObject.hire_date
      // "first_name": "abhi",
      // "last_name": "N",
      "department": departmentOptions[randomDepartmentIndex],
      "role": roleOptions[randomRoleIndex],
      // "salary": 5000880,
      // "bonus": 1000,
      // "phone_number": "1662567890",
      "hire_date": hireDate
    };

    console.log(employeeData)

    // Send POST request to add employee
    fetch("http://127.0.0.1:8000/add-emp/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(employeeData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // alert(data.message);
        alert("successsfull")
        this.isListView = !this.isListView;
        this.loadEmployees();
        // Reload the list of employees or update the UI accordingly
      })
      .catch(error => {
        console.error("Error:", error);
        alert("An error occurred while adding the employee.");
      });
  }




  // Edit employee
  onEdit(item: any) {
    this.employeeObject = item;
    this.isListView = false;
  }

  // Delete employee

  onDelete(emp: any) {
    const empId = emp.id; // Assuming emp_id is the property containing the employee ID

    // Send a POST request to delete the employee
    this.http.post<any>(`http://127.0.0.1:8000/delete-emp/${empId}/`, {}).subscribe((res: any) => {
      alert("Successfully deleted"); // Display success message
      this.loadEmployees(); // Reload the list of employees after deletion
    }, (error) => {
      console.error('Error deleting employee:', error); // Log any errors
    });
  }
}



