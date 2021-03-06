import { Component, OnInit,Input, ViewChild, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Comment } from '../shared/comment';
import { flyInOut, visibility,expand } from '../animations/app.animation';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style' : 'display: block;'
  },
  animations: [
    flyInOut(),
    visibility(),
    expand()
  ]
  
})
export class DishdetailComponent implements OnInit {


  commentForm : FormGroup ;
  comment : Comment;
  @ViewChild('fform') commentFormDirective;
  dishcopy: Dish;
  visibility = 'shown';

  formErrors = {
    'author': '',
    'comment':'',
    'rating':''
    
  };

  validationMessages = {
    'author':{
      'required' : 'First name is required',
      'minlength' : 'First name must be at least 2 characters long'
    },
    
    'comment':{
      'required' : 'last name is required'
    }

  };

  errMess: string;
  dish:Dish;
  dishIds: string[];
  prev: string;
  next: string;

  constructor(private dishService: DishService,
     private location:Location,
   private route: ActivatedRoute,private fb : FormBuilder, @Inject('BaseURL') private BaseURL) {
     this.createForm();
    }

  ngOnInit() {
    this.dishService.getDishIds()
    .subscribe((dishIds) => this.dishIds = dishIds);

    this.route.params
    .pipe(switchMap((params: Params) => {this.visibility = 'hidden'; return this.dishService.getDish(params['id']); }))
    .subscribe(dish => { this.dish = dish; this.dishcopy= dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
    errmess => this.errMess = <any>errmess);
  }

  createForm(){
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      comment: ['', [Validators.required]],
      rating: [5, [Validators.required]]
      
      
    });

    this.commentForm.valueChanges
   .subscribe(data => this.onValueChanged(data));

   this.onValueChanged();

  }

  onValueChanged(data?: any){
    if(!this.commentForm){return;}
    const form = this.commentForm;
    for (const field in this.formErrors){
      if(this.formErrors.hasOwnProperty(field)){
        this.formErrors[field] = '';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages = this.validationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key))
            {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
 
  onSubmit(){

    var today = new Date();
    console.log(today);

    this.comment = this.commentForm.value;
    this.comment.date = today.toISOString();
    
    console.log(this.comment);


    this.dishcopy.comments.push(this.comment);
    this.dishService.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish;
      },
      errmess => {this.dish = null; this.dishcopy = null; this.errMess = <any>errmess;});

      
    


    this.commentForm.reset(
      {
        author : '',
        comment: '',
        rating: 5 
        
      }
    );
    this.commentFormDirective.resetForm();
  }


  setPrevNext(dishId : string){
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];

  }

  goBack(): void{
    this.location.back();
  }

}
