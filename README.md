# MVP3 - Puc Rio - Full Stack Development Advanced

# Overview

This is the third MVP of the Full Stack Development Postgraduate Program at PUC Rio University, Rio de Janeiro.

The goal of this app/PWA is to allow the user to organize their medical appointments, enabling them to register, update, and view appointments in a list, calendar, or map format.

Additionally, the user will be able to install the app and run it offline, as this is a Progressive Web App (PWA). All interactions will be saved in local storage whenever there is no internet connection or when the server is unavailable. Whenever the user wishes, they can synchronize their data with the cloud.

To install the app, when running the app, click on the 'Install' button located in the footer; this will create a shortcut for the app on your mobile or desktop.

The idea for this app is that it operates entirely offline— all authenticated operations work by saving data in local storage, without making the user wait for an API request. Afterwards, the user can synchronize their data with the API.

## How to Run the MVP with all micro services
 
This project also comes with a Dockerfile, which provides an additional option for starting up. To better understand how to use it, please refer to the docker-compose.yml in the gateway api repository of this MVP.  
 
For the entire MVP to work, the microservices must be executed using a docker-compose.yml in the gateway api repository.

To learn how to run the full MVP, visit the gateway api repository at the provided link.

## Important Note

Before running this app with Docker, you need to enter the app folder and run the commands:
- npm install
- npm run pwa

This will build the app by creating the "dist" folder, which is necessary for the docker-compose.yml or Dockerfile to work.

## Local and Env Variables

- rename .env.local.demo to .env.local and set the VITE_GOOGLE_MAPS_API_KEY value to make the Google Maps Api work.
- set the VITE_API_URL value for .env.production when runing the app with docker
- set the VITE_API_URL value for .env.development when runing the app locally with 'npm run dev'

## Commands
- npm install
- npm run dev (builds and serves the app locally)"
- npm run pwa (builds for pwa and serve localhost)
- npm run preview (serve pwa for localhost)

## APP features

- Appointment List in calendar (local storage)
- Appointment List in Google Maps (External api will need connection to work)
- Appointment Normal list (local storage)
- Appointment Create (local storage)
- Appointment Update (local storage)
- Appointment Delete (local storage)
- Appointment Sync localstorage appointment data with cloud, create, update and deleted data.
- Copy one appointment, making ease to create a new appointment based on another one
- Change App Font and containers size
- Change theme color (local storage)
- Change theme between light and dark mode. 
- Register a user
- Confirm register with a user code sent by email
- Login with a user
- Install App (PWA)
- PWA, the app works offline.
- Mobile and Desktop responsive design.
- Increase font size in the app (accessibility feature).
- Fix click delay on mobile devices with a CSS rule (no need for FastClickJS or similar js):
* {
  touch-action: manipulation!important;
}

## TODO:

- Test more sync situations.

# React + TypeScript + Vite + PWA + MUI

These are some of the technologies used in this app.

# Thanks to the MVP professors

Thanks to the MVP professors, Marisa Silva, Dieinison Braga and Carlos Rocha.

## About This Project
 
This is the third MVP of the Full Stack Development Postgraduate Program at PUCRS University, Rio de Janeiro.

**Main Component Gateway Api**: [https://github.com/leonardopaiva/pucrio-mvp-des-fs-advanced-micro-gateway-api](https://github.com/leonardopaiva/pucrio-mvp-des-fs-advanced-micro-gateway-api)  
**APP**: [https://github.com/leonardopaiva/pucrio-mvp-des-fs-advanced-app](https://github.com/leonardopaiva/pucrio-mvp-des-fs-advanced-app)  
**micro-auth-api**: [https://github.com/leonardopaiva/pucrio-mvp-des-fs-advanced-micro-auth-api](https://github.com/leonardopaiva/pucrio-mvp-des-fs-advanced-micro-auth-api)  
**micro-queue-api**: [https://github.com/leonardopaiva/pucrio-mvp-des-fs-advanced-micro-queue-api](https://github.com/leonardopaiva/pucrio-mvp-des-fs-advanced-micro-queue-api)  
**micro-appointments-api**: [https://github.com/leonardopaiva/pucrio-mvp-des-fs-advanced-micro-appointments-api](https://github.com/leonardopaiva/pucrio-mvp-des-fs-advanced-micro-appointments-api)  

**youtube video presenting project**: [https://youtu.be/7QQ_WHTqXxk](https://youtu.be/7QQ_WHTqXxk)  
**Live demo APP**: [https://pucriomvp3.leonardopaiva.com/](https://pucriomvp3.leonardopaiva.com/)  
 
**Student**: Leonardo Souza Paiva  
**Portfolio**: [www.leonardopaiva.com](http://www.leonardopaiva.com)
