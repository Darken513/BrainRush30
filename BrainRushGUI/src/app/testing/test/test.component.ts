import { Component, OnInit } from '@angular/core';
import { TestingService } from '../testing.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  constructor(private testingService: TestingService) { }

  ngOnInit(): void {
    this.testingService.generateTest(2).subscribe((res) => { })
  }

}
