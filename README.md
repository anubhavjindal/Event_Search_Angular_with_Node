# Event Search

The project is live and deployed on Google Cloud Platform. It can be accessed at the link below: 

http://csci-hw8-222600.appspot.com/

## Technologies used
NodeJS, Express, Angular 6, Bootstrap, AJAX, JSON, HTML5, jQuery

## APIs used
Ticketmaster API, IP API, Spotify API, Google Maps API, Google Customized Search API, Songkick API, and Twitter API

## Overview
Event search allows users to search for various different sports, music, film etc events based on current location or any other location entered by the user. Users can know more about the artists performing, the venue of the event, the upcoming events at the same venue, the seating map. They can also book tickets using links which lead to Ticketmaster website.

## Features
1. Autocomplete is impleted while searching for events using Angular 6
2. Real time validations are performed using two way data binding in Angular.
3. Users can search events from current location which is caught using ipapi or a custom location which is geocoded using Google api
4. Users can store their favorite events which are accessible at all times even after the website is closed. This is done using LocalStorage.
5. In case of music artists, artist details are obtained from Songkick api and Users can directly access them on Spotify.
6. Artist Images are obtained using custom Google Search.
7. Bootstrap is used to make the website responsive and mobile friendly.
8. Users can see the location on Google maps with a marker.
9. The upcoming events can be sorted based on several things in ascending or descending order. 
10. Users can directly tweet about the event by just a click of a button. 
11. Custom pipes are used in Angular to truncate sentences when long.
12. Modals are used to view the Seatmap of the venue.
13. Clear button resets the application.
