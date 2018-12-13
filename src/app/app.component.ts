import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import * as moment from 'moment';
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  
  response:any;
  response1:any;
  responseDetails:any;
  artistDetails:any;
  artistImages:any;
  venueInfo:any;
  sliceLimit:number=5;
  keywords:string ="";
  locationRadio:any;
  locationString:string;
  type:string = "all";
  distance:number = 10;
  unit:string = "miles";
  segmentId:string="";
  lat: number = -118;
  lng: number = 38;
  localStorageCopy = localStorage;
  mylat: number;
  mylng: number;
  favArray=[];
  currentEvent:any;
  time:any;
  flag:number = 1;
  upcomingInfo:any;
  error1:any;
  sortCategory:any;
  sortOrder: any;
  upcomingEvents:any;
  upcomingEventsCopy:any;
  autoComplete:any;
  autoCompleteArray:any;
  locationResponse:any;
  locationRes:any;
  eventCategory:string;
  ticketmasterapikey = "h7qBbTvXHC4xKc7pcXrFAjzTwLVT0DD5";
  googlemapsapikey = "AIzaSyByKVdDMj68rGt73isluIxpNu82gX0-UJo";
  url:string = "";

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];

  searchTerm : FormControl = new FormControl();
  otherLoc : FormControl = new FormControl();
  myEvents = <any>[];

  constructor(private http: HttpClient){
  }

  ngOnInit() {
    // console.log(this.searchTerm);
    this.locationRadio = "current";
    this.sortCategory = 'default';
    this.sortOrder = 'ascending';
    this.searchTerm.valueChanges.subscribe(
      term => {
        if (term != '' &&term!=' ') {
          this.url ="http://csci-hw8-222600.appspot.com/autocom/"+term;
          this.http.get(this.url)
          .subscribe((response) => {
            this.autoComplete = response;
            if(this.autoComplete._embedded)
            {
              this.autoCompleteArray = this.autoComplete._embedded.attractions;
            }
            // console.log(this.autoCompleteArray);
          });
        }
    })

    this.url ="http://ip-api.com/json";
    this.http.get(this.url)
    .subscribe((response) => {
      this.locationRes = response;
      this.mylat = this.locationRes.lat;
      this.mylng = this.locationRes.lon;

      if(this.mylat)
      {
        // document.getElementById('searchBtn').removeAttribute("disabled");
      }
    });

    this.favArray = [];
    for(var i=0;i<localStorage.length;i++)
    {
      this.favArray[i] = (JSON.parse(localStorage.getItem(localStorage.key(i))));
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  
  search():void{

    if(this.keywords!="")
    {
      this.response1 = null;
      this.responseDetails = null;
      this.artistDetails = [];
      this.artistImages = [];
      this.venueInfo = null;
      this.upcomingInfo = null;
    
      if(this.type=='music')
      {
        this.segmentId = 'KZFzniwnSyZfZ7v7nJ';
      }
      else if(this.type=='sports')
      {
        this.segmentId = 'KZFzniwnSyZfZ7v7nE';
      }
      else if(this.type=='artsandtheater')
      {
        this.segmentId = 'KZFzniwnSyZfZ7v7na';
      }
      else if(this.type=='film')
      {
        this.segmentId = 'KZFzniwnSyZfZ7v7nn';
      }
      else if(this.type=='miscellaneous')
      {
        this.segmentId = 'KZFzniwnSyZfZ7v7n1';
      }

      
      if(this.locationString != null)
      {
        this.url ="http://csci-hw8-222600.appspot.com/location/"+this.locationString;
        this.http.get(this.url)
        .subscribe((response) => {
        this.locationResponse = response;
        this.mylat = this.locationResponse.results[0].geometry.location.lat;
        this.mylng = this.locationResponse.results[0].geometry.location.lng;
        // console.log(this.mylat + "  " + this.mylng);
        this.url ="http://csci-hw8-222600.appspot.com/search/"+this.keywords+"/"+this.distance+"/"+this.unit+"/"+this.mylat+"/"+this.mylng+"?segmentId="+this.segmentId;
        this.http.get(this.url)
        .subscribe((response) => {
          this.response1 = response;
          // console.log(this.mylat + "  " + this.mylng);
          // console.log(this.response1);
          document.getElementById("response1Div").setAttribute('style','display:block');

        });
      })
      }
      else
      {
        this.url ="http://csci-hw8-222600.appspot.com/search/"+this.keywords+"/"+this.distance+"/"+this.unit+"/"+this.mylat+"/"+this.mylng+"?segmentId="+this.segmentId;
        this.http.get(this.url)
        .subscribe((response) => {
          this.response1 = response;
          // console.log(this.mylat + "  " + this.mylng);
          // console.log(this.response1);
          document.getElementById("response1Div").setAttribute('style','display:block');
        });
      }
    }
    document.getElementById('favTable').setAttribute('style','display:none');
    this.favArray = [];
    for(var i=0;i<localStorage.length;i++)
    {
      this.favArray[i] = (JSON.parse(localStorage.getItem(localStorage.key(i))));
    }
  }

  getEventDetails(id:string):void{
    this.url ="http://csci-hw8-222600.appspot.com/details/"+id;
    this.http.get(this.url)
    .subscribe((response) => {
      this.responseDetails = response;
      this.currentEvent = this.responseDetails;
      this.eventCategory = this.responseDetails.classifications[0].segment.name;
      this.lat = +this.responseDetails._embedded.venues[0].location.latitude;
      this.lng = +this.responseDetails._embedded.venues[0].location.longitude;
      this.time = this.responseDetails.dates.start.localDate;
      this.time = moment(this.time).format('MMM DD, YYYY');
      // console.log(this.time);
      // console.log(this.responseDetails);
      this.getArtistImages(this.responseDetails._embedded.attractions); 
      this.getArtistDetails(this.responseDetails._embedded.attractions); //Changes start here.
      this.getVenueInfo(this.responseDetails._embedded.venues[0].name);
      this.getUpcoming(this.responseDetails._embedded.venues[0].name);
      document.getElementById("detailsDiv").setAttribute('style','display:block');
      document.getElementById("response1Div").setAttribute('style','display:none');
      document.getElementById("favTable").setAttribute('style','display:none');
      document.getElementById('details').removeAttribute('disabled');  
      document.getElementById('details2').removeAttribute('disabled');  
    });
  }

  getArtistDetails(arr):void{
    if(this.eventCategory=='Music')
    {
      for(var i=0;i<arr.length;i++)
      {
        this.url ="http://csci-hw8-222600.appspot.com/artist/"+arr[i].name;
        this.http.get(this.url)
        .subscribe((response) => {
        this.artistDetails.push(response);
      });
      }
    }
    // console.log(this.artistDetails);
  }

  getArtistImages(arr):void{
    for(var i=0;i<arr.length;i++)
      {
        this.url ="http://csci-hw8-222600.appspot.com/images/"+arr[i].name;
        this.http.get(this.url)
        .subscribe((response) => {
          this.artistImages.push(response);
        });
      }
    // console.log(this.artistImages);
  }

  getVenueInfo(keyword:string):void{
    this.url ="http://csci-hw8-222600.appspot.com/venue/"+keyword;
    this.http.get(this.url)
    .subscribe((response) => {
      this.venueInfo = response;
      console.log(this.venueInfo);
    });
  }

  getUpcoming(keyword:string):void{
    this.url ="http://csci-hw8-222600.appspot.com/upcoming/"+keyword;
    this.http.get(this.url)
    .subscribe((response) => {
      this.upcomingInfo = response;
      this.upcomingEvents = this.upcomingInfo.resultsPage.results.event;
      this.upcomingEventsCopy = this.upcomingInfo.resultsPage.results.event;
      console.log(this.upcomingEvents);
    });
  }

  deactivateLocation():void{
    document.getElementById('otherLocation').setAttribute('disabled','disabled');
  }

  activateLocation():void{
    document.getElementById('otherLocation').removeAttribute('disabled');
    // document.getElementById('searchBtn').setAttribute("disabled",'(!mylat) || myform.invalid || searchTerm.invalid || otherLoc.invalid');
  }

  clear():void{
    var resetForm = <HTMLFormElement>document.getElementById('myform');
    resetForm.reset();
    this.locationRadio = "current";
    document.getElementById('otherLocation').setAttribute('disabled','disabled');
    document.getElementById("response1Div").setAttribute('style','display:none');
    document.getElementById("detailsDiv").setAttribute('style','display:none');
    document.getElementById("favTable").setAttribute('style','display:none');
    this.response1 = null;
    this.responseDetails = null;
    this.artistDetails = null;
    this.artistImages = null;
    this.venueInfo = null;
    this.upcomingInfo = null;
    this.sortCategory = 'default';
    this.type = "all";
    this.distance = 10;
    this.unit = "miles";
    this.sortOrder = 'ascending';
    this.segmentId ="";
    this.searchTerm.markAsUntouched();
    this.searchTerm.markAsPristine();
    this.otherLoc.markAsUntouched();
    this.otherLoc.markAsPristine();
  }

  toggle():void{
    if(this.flag==1)
    {
      document.getElementById('collapseBtn').innerHTML='Show Less';
      this.flag = 0;
      this.sliceLimit = 100;
    }
    else
    {
      document.getElementById('collapseBtn').innerHTML='Show More';
      this.flag = 1;
      this.sliceLimit = 5;
    }
  }

  viewSeats(url):void{
    // console.log('Inside yayyy');
    document.getElementById('myModal').setAttribute('style','display:block;');
    document.getElementById("img01").setAttribute('src',url);
    document.getElementById("modalAnchor").setAttribute('href',url);
  }

  closeModal():void{
    document.getElementById('myModal').setAttribute('style','display:none');
  }

  favorite(event,id):void{
    if(localStorage.getItem(event.id))
    {
      localStorage.removeItem(event.id);
      // document.getElementById(id).setAttribute('class','material-icons');
      // document.getElementById(id).innerHTML='star_border';
    }
    else
    {
      localStorage.setItem(event.id,JSON.stringify(event));
      // document.getElementById(id).setAttribute('class','material-icons yellow');
      // document.getElementById(id).innerHTML='star';
    }
    this.favArray = [];
    for(var i=0;i<localStorage.length;i++)
    {
      this.favArray[i] = (JSON.parse(localStorage.getItem(localStorage.key(i))));
    }
  this.localStorageCopy = localStorage;
  }

  showFav():void{
    this.favArray = [];
    for(var i=0;i<localStorage.length;i++)
    {
      this.favArray[i] = (JSON.parse(localStorage.getItem(localStorage.key(i))));
    }
    document.getElementById('favTable').setAttribute('style','display:block');
    document.getElementById('response1Div').setAttribute('style','display:none');
    document.getElementById('detailsDiv').setAttribute('style','display:none');
  }

  showResult():void{
    document.getElementById('favTable').setAttribute('style','display:none');
    document.getElementById('response1Div').setAttribute('style','display:block');
  }

  displayList():void{
    document.getElementById("detailsDiv").setAttribute('style','display:none');
    document.getElementById("response1Div").setAttribute('style','display:block');
  }

  displayDetails():void{
    document.getElementById('response1Div').setAttribute('style','display:none');
    document.getElementById('detailsDiv').setAttribute('style','display:block');
  }

  displayDetails2():void{
    document.getElementById('favTable').setAttribute('style','display:none');
    document.getElementById('detailsDiv').setAttribute('style','display:block');
  }

  sort():void{
    switch(this.sortCategory) {  
      case "default": { 
        console.log('default chosen');
        this.upcomingEventsCopy.sort(function(a, b) {
          var nameA = a.start.datetime; 
          var nameB = b.start.datetime; 
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        this.upcomingEvents = this.upcomingEventsCopy;
         console.log(this.upcomingEventsCopy);
         break;
      }
      case "eventName": { 
          console.log('eventname chosen');
          this.upcomingEventsCopy.sort(function(a, b) {
            var nameA = a.displayName.toUpperCase(); 
            var nameB = b.displayName.toUpperCase(); 
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          });
        this.upcomingEvents = this.upcomingEventsCopy;          
         console.log(this.upcomingEventsCopy);

         break;
      }
      case "time": { 
        console.log('time chosen');
        this.upcomingEventsCopy.sort(function(a, b) {
          var nameA = a.start.datetime; 
          var nameB = b.start.datetime; 
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        this.upcomingEvents = this.upcomingEventsCopy;
        console.log(this.upcomingEventsCopy);
         break;
      }
      case "artist": { 
        console.log('artist chosen');
        this.upcomingEventsCopy.sort(function(a, b) {
          var nameA = a.performance[0].displayName.toUpperCase(); 
          var nameB = b.performance[0].displayName.toUpperCase(); 
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        this.upcomingEvents = this.upcomingEventsCopy;
        console.log(this.upcomingEventsCopy);
 
        break;
     }
     case "type": { 
      console.log('type chosen');
      this.upcomingEventsCopy.sort(function(a, b) {
        var nameA = a.type.toUpperCase(); 
        var nameB = b.type.toUpperCase(); 
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      this.upcomingEvents = this.upcomingEventsCopy;  
        console.log(this.upcomingEventsCopy);
        break;
     }
   }
  }

  sortReverse():void{
    if(this.sortOrder=='ascending')
    {
      this.sort();
    }
    if(this.sortOrder=='descending')
    {
      this.upcomingEventsCopy = this.upcomingEvents;
      this.upcomingEventsCopy.reverse();
    }
  }

}
