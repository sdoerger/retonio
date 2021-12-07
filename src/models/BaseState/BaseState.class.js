export class BaseState {
  //Indicates if the request has finished
  isFinished = undefined;
  //Indicates if the request is currently loading
  isLoading = undefined;
  //Indicates if the request was canceled
  error = undefined;
  // //Axios response data
  response = undefined;

  constructor(isFinished = false, isLoading = false, error = false, response = undefined) {
    this.isFinished = isFinished || false;
    this.isLoading = isLoading || false;
    this.error = error || false;
    this.response = response || undefined;
  }
}
