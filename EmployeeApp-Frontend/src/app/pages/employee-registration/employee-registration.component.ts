

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employee-registration',
  templateUrl: './employee-registration.component.html',
  styleUrls: ['./employee-registration.component.css']
})
export class EmployeeRegistrationComponent implements OnInit {

  // Define hardcoded departments
  departments: any[] = [
    { deptId: 1, deptName: 'Department 1' },
    { deptId: 2, deptName: 'Department 2' },
    { deptId: 3, deptName: 'Department 3' }
    // Add more departments as needed
  ];

  employeeList: any[] = [];
  isListView: boolean = true;
  employeeObject: any = {
    "onedit":false,
    "first_name": "",
    "last_name": "",
    "department": 0,
    "role": "HR",
    "salary": 0,
    "bonus": 0,
    "phone_number": "",
    "hire_date": "11/11/2021"
  };
  

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  // Load employees from backend
  loadEmployees() {
    this.http.get<any>("http://127.0.0.1:8000/all-emp/").subscribe((res: any) => {
      this.employeeList = res;
    });
  }

  toggleListView() {
    this.isListView = !this.isListView;
    this.employeeObject.onedit = !this.employeeObject.onedit
    if (this.isListView) {
      // Reset employee object when switching to list view
      this.employeeObject = {
        "first_name": "",
        "last_name": "",
        "department": 0,
        "role": "HR",
        "salary": 0,
        "bonus": 0,
        "phone_number": "",
        "hire_date": "11/11/2021"
      };
    }
  }
  

  // Create employee
  // onCreateEmp() {
  //   // Get the ID of the selected department
  //   // const selectedDeptId = this.departments.find(dept => dept.deptName === this.employeeObject.department)?.deptId;

  //   // // Check if the department name exists
  //   // if (!selectedDeptId) {
  //   //   alert("Department is required.");
  //   //   return;
  //   // }

  //   // Prepare employee data with the selected department ID
  //   const employeeData = {
  //   //   first_name: this.employeeObject.first_name,
  //   //   last_name: this.employeeObject.last_name,
  //   //  // department: selectedDeptId, // Use the selected department ID
  //   //  emp_dept: "55",
  //   //  emp_role: this.employeeObject.role,
  //   //   salary: this.employeeObject.salary,
  //   //   bonus: this.employeeObject.bonus,
  //   //   phone: this.employeeObject.phone_number,
  //   //   hire_date: this.employeeObject.hire_date

  //   "first_name": "abhi",
  //   "last_name": "N",
  //   "department": 1, 
  //   "role": 1, 
  //   "salary": 5000880,
  //   "bonus": 1000,
  //   "phone_number": "1662567890",
  //   "hire_date": "2022-03-31"

  // {
  //   "first_name": "Pavan",
  //   "last_name": "Kumar P S",
  //   "department": 11,
  //   "role": 111,
  //   "salary": 11,
  //   "bonus": 1000,
  //   "phone_number": "8296191962",
  //   "hire_date": "2010-01-04"
  // }

  //   };

  //   // Send POST request to add employee
  //   this.http.post<any>("http://127.0.0.1:8000/add-emp/", employeeData).subscribe((res:any)=>{
  //     alert(res.message);
  //     this.loadEmployees(); // Reload the list of employees after adding a new employee
  //   });
  // }
  
  onCreateEmp(empId: number) {
    // Assuming selectedDeptId is obtained properly


    // Construct the employee data object
    const employeeData = {
      "id":this.employeeObject.id,
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
      "department": 1,
      "role": 1,
      // "salary": 5000880,
      // "bonus": 1000,
      // "phone_number": "1662567890",
      "hire_date": "2022-03-31"
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
        alert(data.message);
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



