export class APIResponse {
  status: string;
  data: Record<string, any>;
  message: string;

  constructor(status: string, message: string = "") {
    this.status = status;
    this.data = {};
    this.message = message;
  }

  addResponseData(name: string, responseData: any): void {
    this.data[name] = responseData;
  }
}
