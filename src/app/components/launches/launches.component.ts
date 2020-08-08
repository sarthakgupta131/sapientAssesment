import { Component, OnInit, DoCheck, ViewChild, ElementRef, Inject, HostListener } from '@angular/core';
import { LaunchService } from '@app/services/launch.service';
import { Location, DOCUMENT } from '@angular/common';


@Component({
  selector: 'app-launches',
  templateUrl: './launches.component.html',
  styleUrls: ['./launches.component.css']
})
export class LaunchesComponent implements  OnInit {
  blankRows: number[];
  isLoading: boolean;
  math = Math;
  max: number | undefined;
  oldParamsOffset: number;

  yearsList: any = [];
  year: any;
  successfullaunch: any;
  successfullanding: any;
  param: {};
  selectedentry: boolean = false;
  @ViewChild('button') button: ElementRef;
  selectedtrue: boolean;
  selectedfalse: boolean;
  selectedlandtrue: boolean;
  selectedlandfalse: boolean;
  launches: any[];
  windowScrolled: boolean;

  constructor(private launchService: LaunchService,private location: Location,@Inject(DOCUMENT) private document: Document) {
    this.blankRows = [];
    this.isLoading = false;
    this.max = undefined;
  }
  
  @HostListener("window:scroll", [])
  onWindowScroll() {
      if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
          this.windowScrolled = true;
      } 
     else if (this.windowScrolled && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10) {
          this.windowScrolled = false;
      }
  }
  ngOnInit() {
    this.getLaunches();
  }

  getLaunches(): void {
    this.isLoading = true;
    const params = {
      limit: '100'
    }
    this.launchService.getLaunches(params)
      .subscribe(launches => {
        this.launches = launches;
        this.launches.forEach(item => {
          var i = this.yearsList.findIndex(x => x == item.launch_year);
          if (i <= -1) {
            this.yearsList.push(item.launch_year);
          }
        });
        this.location.replaceState(this.launchService.queryString);
        this.yearsList.forEach((part, index, yearsList) => {
          yearsList[index] = {
            id: index,
            year: part,
            selected: false,
          }
        });
        console.log("this.yeaR" + this.yearsList)
        this.isLoading = false;
      });
  }

  selection(value, parameter, index?) {
    this.isLoading = true;
    if (parameter === 'Launchyear') {
      this.yearsList.forEach((x) => {
        x.selected = false;
      });
      this.year = value.year;
      this.yearsList.find((x) => {
        if (x.year === value.year) {
          x.selected = true;
        }
      });
    } else if (parameter === 'SuccessfulLaunch') {
      this.successfullaunch = value;
      if (value === "true") {
        this.selectedtrue = true;
        this.selectedfalse = false;
      } else {
        this.selectedfalse = true;
        this.selectedtrue = false;
      }
    } else {
      this.successfullanding = value;
      if (value === "true") {
        this.selectedlandtrue = true;
        this.selectedlandfalse = false;
      } else {
        this.selectedlandtrue = false;
        this.selectedlandfalse = true
      }
    }
    this.getLaunch();
  }

  getLaunch() {
    // If all the three filters are selected.
    if (this.year && this.successfullanding && this.successfullaunch) {
      this.param = {
        limit: '100',
        launch_year: this.year,
        land_success: this.successfullanding,
        launch_success: this.successfullaunch
      }
    } else if (this.year && this.successfullanding && !this.successfullaunch) {
      // If year and successfull landing filters are selected.
      this.param = {
        limit: '100',
        launch_year: this.year,
        land_success: this.successfullanding,
      }
    } else if (this.year && !this.successfullanding && !this.successfullaunch) {
      // If year filters  selected.
      this.param = {
        limit: '100',
        launch_year: this.year,
      }
    } else if (!this.year && this.successfullanding && !this.successfullaunch) {
      // If successfull landing filters are selected.
      this.param = {
        limit: '100',
        land_success: this.successfullanding,
      }
    } else if (!this.year && !this.successfullanding && this.successfullaunch) {
      // If successfull Launch filters  selected.
      this.param = {
        limit: '100',
        launch_success: this.successfullaunch
      }
    } else if (!this.year && this.successfullanding && this.successfullaunch) {
      // If successfull landing and launch filters are selected.
      this.param = {
        limit: '100',
        land_success: this.successfullanding,
        launch_success: this.successfullaunch
      }
    } else if (this.year && !this.successfullanding && this.successfullaunch) {
      // If successfull launch and year filters are selected.
      this.param = {
        limit: '100',
        launch_year: this.year,
        launch_success: this.successfullaunch
      }
    } else if(!this.year && !this.successfullanding && !this.successfullaunch) {
      this.param = {
        limit: '100',
      }
    }
    this.launchService.getLaunches(this.param).subscribe(launches => {
      this.launches = launches;
      this.isLoading = false;
    });
    this.location.replaceState(this.launchService.queryString);
  }

  reset() {
    this.year = '';
    this.successfullanding = '';
    this.successfullaunch = '';
    this.yearsList.forEach((x) => {
      x.selected = false;
    });
    this.selectedlandtrue = false;
    this.selectedlandfalse = false;
    this.selectedtrue = false;
    this.selectedfalse = false;
    this.getLaunch();
    this.isLoading = true;
}

  scrollToTop() {
      (function smoothscroll() {
          var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
          if (currentScroll > 0) {
              window.requestAnimationFrame(smoothscroll);
              window.scrollTo(0, currentScroll - (currentScroll / 8));
          }
      })();
  }

}
