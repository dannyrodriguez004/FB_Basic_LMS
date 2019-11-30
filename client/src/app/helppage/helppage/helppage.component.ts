import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-helppage',
  templateUrl: './helppage.component.html',
  styleUrls: ['./helppage.component.scss']
})
export class HelppageComponent implements OnInit {

  faqs = [
    {
      question: 'How do I log in with Facebook?',
      answer: 'Click the “Account” button located at the top corner of the page, in the Navigation Bar, then' +
        ' choose “Facebook Login”.  Then allow the Facebook Application to use your information.  If you are ' +
        'not registered, a pop-up dialog forum should appear where you can add and edit your information.  ' +
        'Once you’ve successfully registered, congratulations!  You are ready to begin registering for courses'
    },
    {
      question: 'How do I register for courses?',
      answer: 'Navigate to and click on the “Courses” tab in the Navigation Bar at the top of your screen.' +
        '  From there you will be redirected to a page with the list of all courses which can be sorted and searched.'
    },
    {
      question: 'Why can’t I see my courses in the Dashboard page?',
      answer: 'If you have just registered, then it is likely because the Instructor needs to confirm your enrollment,' +
        ' once he has done so, you will have access to all available course material.'
    },
    {
      question: 'How can I contact my instructor?',
      answer: 'If you are already enrolled in the course then you can also navigate to and click on the “Inbox” tab in ' +
        'the Navigation Bar at the top of your screen.  From there, click on compose message in the top right corner of ' +
        'your window, just below the “Account” button.  From there you can choose a course and send a private message' +
        ' to the instructor or to any other student(s) in that course.  If you are not enrolled, then the instructors' +
        ' email is listed in the Dashboard page for the given course.'
    },
    {
      question: 'How do I know if I am logged in?',
      answer: 'Click the “Account” button located at the top corner of the page, in the Navigation Bar.  If ' +
        'you are logged in, the drop-down menu will have an option to visit your profile which, if clicked,' +
        ' will navigate you to a page containing your personal information, with the option to edit/update it.'
    },
    {
      question: 'How can I change my profile picture?',
      answer: 'Your profile picture will change automatically with your Facebook profile picture.'
    },
    {
      question: 'Can I still register for a course that is already full?',
      answer: 'Yes, you will be put on a waiting list until a spot opens up for you.'
    }, ];


  admins = [
    {name: 'Danny Rodriguez', phone: '(305)-439-1452', email: 'drodr518@fiu.edu'},
    {name: 'Joao Guiramaes', phone: '(754)-242-1096', email: 'jguim002@fiu.edu'}
  ];

  submittedComplaint = '';

  ComplaintSubmitted() {
    this.submittedComplaint = 'Thank you for your submission, we will be contacting you as soon as possible';
  }
  constructor() { }

  ngOnInit() {}

}

