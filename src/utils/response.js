export class APIResponse {
  constructor(status, message = "") {
    this.status = status;
    this.data = {};
    this.message = message;
  }
  addResponseData(name, responseData) {
    this.data[name] = responseData;
  }
}
