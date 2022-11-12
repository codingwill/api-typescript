export default class DataReturnHelper {
  public success: boolean;
  public message: string;
  public data: any;
  public page: number;

  public constructor(
    success: boolean = true,
    message: string = "Successfully",
    data: any = {},
    page: number = 0
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.page = page;
  }

  public setToFailed(message: string = "Failed"): DataReturnHelper {
    this.success = false;
    this.message = message;
    this.data = {};

    return this;
  }
}
