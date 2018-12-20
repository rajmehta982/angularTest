import { Component, OnInit, Inject } from '@angular/core';
import { Leader } from '../shared/leader'
import { LeaderService } from '../services/leader.service';
import { expand } from '../animations/app.animation';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  host: {
    'style' : 'display: block;'
  },
  animations: [
    expand()
  ]
})
export class AboutComponent implements OnInit {

  dishErrMess : string;

 leader: Leader[];
  constructor(private leaderService : LeaderService, @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {


     this.leaderService.getLeaders()
    .subscribe(leader => this.leader = leader,
      errmess => this.dishErrMess = <any>errmess);

  }

}
