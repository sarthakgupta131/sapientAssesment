import { Component, OnInit, DoCheck, ViewChild, ElementRef } from '@angular/core';

import { DEFAULT_PARAMS, Params, Orders } from '@models/params.model';
import { Launch } from '@models/launch.model';
import { LaunchService } from '@app/services/launch.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-launches',
  templateUrl: './launches.component.html',
  styleUrls: ['./launches.component.css']
})
export class LaunchesComponent implements DoCheck, OnInit {
  blankRows: number[];
  isLoading: boolean;
  launches: Launch[];
  math = Math;
  max: number | undefined;
  oldParamsOrder: Orders;
  oldParamsOffset: number;
  params: Params;
  yearsList : any = [];
  year: any;
  successfullaunch: any;
  successfullanding: any;
  param: {};
  selectedentry: boolean = false;
  @ViewChild('button') button: ElementRef;

  constructor(private launchService: LaunchService) {
    this.blankRows = [];
    this.isLoading = false;
    this.max = undefined;
    this.params = DEFAULT_PARAMS;
  }

  ngOnInit() {
    this.getLaunches();
  }

  ngDoCheck() {
    /*
      I am wondering if there is a better way to do this using ngOnChanges.
      The examples I found were all closely tied to two-waydata-binding of
      input elements.
    */
    // if (this.params.order !== this.oldParamsOrder) {
    //   this.getLaunches();
    //   this.oldParamsOrder = this.params.order;
    // }
    // if (this.params.offset !== this.oldParamsOffset) {
    //   this.getLaunches();
    //   this.oldParamsOffset = this.params.offset;
    // }
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
        })
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
    this.yearsList.forEach((x) => {
      x.selected = false;
    });
    this.isLoading = true;
    if (parameter === 'Launchyear') {
      this.year = value.year;
     this.yearsList.find((x)=> {
        if(x.year === value.year) {
          x.selected = true;
        }
      });
    } else if (parameter === 'SuccessfulLaunch') {
      this.successfullaunch = value;
    } else {
      this.successfullanding = value;
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
    }
    this.launchService.getLaunches(this.param).subscribe(launches => {
      this.launches = launches;
      this.isLoading = false;
    });
  }

  // onSelect(launch: Launch): void {
  //   if (!!launch.links.presskit) {
  //     window.open(launch.links.presskit);
  //   }
  // }

  // onSort(): void {
  //   this.params.order = this.params.order === 'asc'
  //     ? 'desc'
  //     : 'asc';
  // }

  // handleOffset(offset: number): void {
  //   this.params.offset = offset;
  // }
}
