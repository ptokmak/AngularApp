import {Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';

import {EmployeeService} from './employee.service';

@Component({
	selector: 'employee',
	templateUrl: 'app/employee.component.html'
})

export class EmployeeComponent implements OnInit {

	private employees = [];
	private isLoading = true;

	private isEditing = false;
	private employee = {};

	private infoMsg = { body: "", type: "info"};

	private addEmployeeForm: FormGroup;
	private name = new FormControl("", Validators.required);
	private position = new FormControl("", Validators.required);
	private salary = new FormControl("", Validators.required);
	private phone = new FormControl("", Validators.required);
	private empSince = new FormControl("", Validators.required);
	private address = new FormControl("", Validators.required);
	

	constructor(private http: Http,
				private employeeService: EmployeeService,
				private formBuilder: FormBuilder) {	}

	ngOnInit() {
		this.loadEmployees();

		this.addEmployeeForm = this.formBuilder.group({
			name: this.name,
			position: this.position,
			salary: this.salary,
			phone: this.phone,
			empSince: this.empSince,
			address: this.address,

		});
	}

	loadEmployees() {
		this.employeeService.getEmployees().subscribe(
			data => this.employees = data,
			error => console.log(error),
			() => this.isLoading = false
		);
	}

	submitAdd() {
		this.employeeService.addEmployee(this.addEmployeeForm.value).subscribe(
			res => {
				var newEmployee = res.json();
				this.employees.push(newEmployee);
				this.addEmployeeForm.reset();
				this.sendInfoMsg("item added successfully.", "success");
			},
			error => console.log(error)
		);
	}

	enableEditing(employee) {
		this.isEditing = true;
		this.employee = employee;
	}

	cancelEditing() {
		this.isEditing = false;
		this.employee = {};
		this.sendInfoMsg("item editing cancelled.", "warning");
		// reload the employee to reset the editing
		this.loadEmployees();
	}

	submitEdit(employee) {
		this.employeeService.editEmployee(employee).subscribe(
			res => {
				this.isEditing = false;
				this.employee = employee;
				this.sendInfoMsg("item edited successfully.", "success");
			},
			error => console.log(error)
		);
	}

	submitRemove(employee) {
		if(window.confirm("Are you sure you want to permanently delete this item?")) {
			this.employeeService.deleteEmployee(employee).subscribe(
				res => {
					var pos = this.employees.map(employee => { return employee._id }).indexOf(employee._id);
					this.employees.splice(pos, 1);
					this.sendInfoMsg("item deleted successfully.", "success");
				},
				error => console.log(error)
			);
		}
	}

	sendInfoMsg(body, type, time = 3000) {
		this.infoMsg.body = body;
		this.infoMsg.type = type;
		window.setTimeout(() => this.infoMsg.body = "", time);
	}

}