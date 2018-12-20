import {Inject, Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Feedback, ContactType} from '../shared/feedback';
import { FeedbackService } from '../services/feedback.service';
import { expand } from '../animations/app.animation';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    'style' : 'display: block;'
  },
  animations: [
    
    expand()
  ]
})
export class ContactComponent implements OnInit {

  errMess : string ;
  feedbackForm: FormGroup;
  feedback: Feedback;
  contactType = ContactType;
  @ViewChild('fform') feedbackFormDirective;
  spinnerVisibility: boolean = false;

  formErrors = {
    'firstname': '',
    'lastname':'',
    'telnum':'',
    'email':''
  };

  validationMessages = {
    'firstname':{
      'required' : 'First name is required',
      'minlength' : 'First name must be at least 2 characters long',
      'maxlength':'First name must not be longer than 25 characters'
    },
    
    'lastname':{
      'required' : 'last name is required',
      'minlength' : 'last name must be at least 2 characters long',
      'maxlength':'last name must not be longer than 25 characters'
    },

    'telnum':{
      'required' : ' telnum is required',
      'pattern' : 'Tel. number must contain only numbers'
    },

    'email':{
      'required':'Email is required',
      'email':'Email not in valid format'
    }
  };

  constructor(private fb: FormBuilder, private feedbackService: FeedbackService, @Inject('BaseURL') private BaseURL) {
    this.createForm();
  }

  ngOnInit() {
 
  }

 createForm(){
   this.feedbackForm = this.fb.group({
     firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
     lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
     telnum: [0, [Validators.required, Validators.pattern]],
     email: ['', [Validators.required, Validators.email]],
     agree : false,
     contactType: 'None',
     message: ''
   });

   this.feedbackForm.valueChanges
   .subscribe(data => this.onValueChanged(data));

   this.onValueChanged();
 }

 onValueChanged(data?: any){
   if(!this.feedbackForm){return;}
   const form = this.feedbackForm;
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

  this.spinnerVisibility = true ;

  
   this.feedback = this.feedbackForm.value;
   console.log(this.feedback);

   this.feedbackService.submitFeedback(this.feedback)
   .subscribe(feedback => 
    { 
      
        this.feedback = feedback; this.spinnerVisibility = false; console.log(this.feedback); 
        
        
        
      
      
    },
   errmess => {this.feedback = null;  this.errMess = <any>errmess;});
   setTimeout(() => this.feedback = null, 7000);

   this.feedbackForm.reset(
     {
       firstname: '',
       lastname: '',
       telnum:0,
       email:'',
       agree: false,
       contacttype: 'None',
       message:''
     }
   );
   this.feedbackFormDirective.resetForm();
 }
}
