import { Component, OnInit, Inject } from '@angular/core';
import { Leader } from '../shared/leader'
import { LeaderService } from '../services/leader.service';



@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

 leader: Leader[];
  constructor(private leaderService : LeaderService, @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {


     this.leaderService.getLeaders()
    .subscribe(leader => this.leader = leader);

  }

}
