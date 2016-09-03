import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';

@Injectable()

export class EmployeeService {

    private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
    private options = new RequestOptions({ headers: this.headers });

    constructor (private http: Http) {}

    getEmployees() {
        return this.http.get('/employees').map(res => res.json());
    }

    addEmployee(employee) {
        return this.http.post("/employee", JSON.stringify(employee), this.options);
    }

    editEmployee(employee) {
        return this.http.put("/employee/"+employee._id, JSON.stringify(employee), this.options);
    }

    deleteEmployee(employee) {                     // rc5 bug
        var options = new RequestOptions({ body: '', headers: this.headers});
        return this.http.delete("/employee/"+employee._id, options);
    }

}
