import { Appointment } from "./interfaces";

/* 
    * AppointmentService:
    * Helper Service to make all requests in the app using axios 
    * right now they are only for dummy purposes, because the app 
    * dont have any backend to comunicate, all requests will result
    * in error, so the data will be saved using local storage
    * in catch using the callback function onError: CallableFunction
*/
/*
  * This service is not being used, but it has been kept for future reference. 
  * This is because the appointment operations are now handled via local storage, 
  * and it is the sync queue service that is responsible for sending data to the server.
*/
export class AppointmentService {

  public async sendHttp(url: string, requestData: Appointment, onSuccess: CallableFunction, onError: CallableFunction) {
    try {
      console.log(url);

      const response = await fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      //settimeout will simulate the request time
      setTimeout(() => {
        onSuccess({
          loading: false,
          message: response.ok ? `Success: ${data.message}` : `Error: ${data.message}`,
          data: response.ok ? data : null,
          status: response.status,
        });
      }, 400)

    } catch (error) {
      setTimeout(() => {
        onError({
          loading: false,
          message: `OnCreateError`,
          data: requestData,
          status: 200,
        });
      }, 400)
    }
  }
}