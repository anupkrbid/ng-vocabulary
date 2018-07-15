import {
  Component,
  HostListener,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, tap, take, withLatestFrom, pluck } from 'rxjs/operators';

import { AppService } from './app.service';
import { HelpModalOverlayRef } from './help-modal/help-modal-overlay-ref.class';
import { HelpModalService } from './help-modal/help-modal.service';
import { Question, WordVault } from './word-vault.interface';
import { VocabularyState } from './vocabulary-state.interface';
import { VaultService } from './vault/vault.service';

// Keycode for ESCAPE
const ESCAPE = 27;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  vaultState$: Observable<WordVault>;
  vaultHelpSubscription: Subscription;
  noOfRounds$: Observable<any>;
  appState$: Observable<any>;
  vocabularyState$: Observable<VocabularyState>;
  vocabularySubscription: Subscription;
  dialogRef: HelpModalOverlayRef;
  helpInfo: string;
  noOfWrongAttemps = 0;
  answerStatus = {
    correct: null,
    incorrect: null
  };
  @ViewChild('form') form: NgForm;

  // Listen on keydown events on a document level
  @HostListener('document:keydown', ['$event'])
  private handleKeydown(event: KeyboardEvent) {
    if (event.keyCode === ESCAPE) {
      this.dialogRef.close();
    }
  }

  constructor(
    private appService: AppService,
    private helpModalService: HelpModalService,
    private vaultService: VaultService
  ) {}

  ngOnInit() {
    // vault state
    this.vaultState$ = this.appService.getWordVault().pipe(take(1));

    // holds the updated state of the app
    this.appState$ = this.appService.appState$;
    this.vocabularyState$ = this.appService.vocabularyState$;

    // initializing app state
    this.appService
      // get vault state
      .getWordVault()
      .pipe(
        // unsubscribe after getting one value
        take(1),
        // get round data
        pluck('rounds'),
        // transform round data to the initial app and animation state
        map(roundObj => {
          const appState = {
            currentRound: 1,
            currentQuestion: 1,
            answerStatus: {}
          };
          const animationState = {};
          for (const key in roundObj) {
            if (roundObj.hasOwnProperty(key)) {
              const tempArr = roundObj[key];
              appState.answerStatus[key] = tempArr.questions.map(val => false);
              animationState[key] = tempArr.questions.map(
                val => val.frameRange
              );
            }
          }
          return { appState, animationState };
        })
      )
      // emiting events to initialize initial app and animation state
      .subscribe(state => {
        this.appService.appState$.next(state.appState);
        this.appService.animationState$.next(state.animationState);
      });

    // creating an array of all the rounds
    this.noOfRounds$ = this.vaultState$.pipe(
      map(vault => [...Object.keys(vault.rounds)])
    );

    // observes the state change of the app and dose the required animation
    this.observeVocabularyStateChange();

    // open modal when app initializes
    this.vaultHelpSubscription = this.appService
      .getWordVaultHelp()
      .pipe(take(1))
      .subscribe((data: any) => {
        this.helpInfo = data.text;
        this.dialogRef = this.helpModalService.open({
          data: this.helpInfo
        });
      });
  }

  onSubmit(form: NgForm, question: Question, indexOfQuestionAnswered: number) {
    const answer = form.value.answer;
    const answers = question.answers;
    const correctAnswer = question.correctAnswer;

    if (answers[correctAnswer - 1] === answer) {
      this.answerStatus = {
        correct: answers[correctAnswer - 1],
        incorrect: null
      };
      console.log('Correct answer!');
      this.appService.indexOfQuestionAnswered$.next(indexOfQuestionAnswered);
    } else {

      this.answerStatus = {
        correct: answers[correctAnswer - 1],
        incorrect: answer
      };

      if (++this.noOfWrongAttemps < 2) {
        alert('Try Again!');
        this.form.reset();
      } else {
        alert('Changing Question!');
        this.noOfWrongAttemps = 0;
        const appState = this.appService.appState$.getValue();
        this.appService.appState$.next({...appState, currentQuestion: appState.currentQuestion + 1});
      }
    }

    setTimeout(() => {
      this.answerStatus = {
        correct: null,
        incorrect: null
      };
    }, 100);
  }

  observeVocabularyStateChange() {
    // this will capture all events when any question is answered correctly which will be a number
    this.vocabularySubscription = this.appService.indexOfQuestionAnswered$
      .pipe(
        // this will get the latest values from the word vault
        withLatestFrom(this.vaultState$),
        // do something with the index of the answered question and the latest values form vault
        tap(([indexOfQuestionAnswered, vaultState]) => {
          // get the last updated value of the vocabulary state
          const vocabularyState = this.appService.vocabularyState$.getValue();

          // object which will update the new vacabulary state depending on the previous state
          const callbackOnAnimationEnd = {
            arg1: vocabularyState,
            arg2: indexOfQuestionAnswered,
            arg3: vaultState,
            callback: this.handleVocabularStateChange.bind(this)
          };

          const frameRange =
            vaultState.rounds[vocabularyState.currentRound.toString()]
              .questions[vocabularyState.currentQuestion - 1].frameRange;

          // emit event for vault to perform animation
          this.vaultService.executeAnimation.next({
            startFrame: frameRange.start,
            endFrame: frameRange.end,
            callbackOnAnimationEnd: callbackOnAnimationEnd
          });
        })
      )
      .subscribe(() => console.log('observed'));
  }

  handleVocabularStateChange(
    vocabularyState,
    indexOfQuestionAnswered,
    vaultState
  ) {
    let newState: VocabularyState;
    const noOfRounds = Object.keys(vaultState.rounds).length;
    const questionNoJustAnswered = indexOfQuestionAnswered + 1;
    const noOfQuestionsInCurrentRound =
      vaultState.rounds[vocabularyState.currentRound.toString()].questions
        .length;

    if (noOfQuestionsInCurrentRound > questionNoJustAnswered) {
      newState = {
        currentQuestion: questionNoJustAnswered + 1,
        currentRound: vocabularyState.currentRound
      };
    } else {
      newState = {
        currentQuestion: 1,
        currentRound: vocabularyState.currentRound + 1
      };
    }

    if (newState.currentRound > noOfRounds) {
      console.log('Completed');
    } else {
      // emiting event to update the vocabulary state with updated state
      this.appService.vocabularyState$.next(newState);
    }
  }

  onOpenHelpDialog() {
    // Returns a handle to the open overlay
    this.dialogRef = this.helpModalService.open({
      data: this.helpInfo
    });
  }

  onDirections() {
    this.vaultState$
      .pipe(
        take(1),
        pluck('directionsAudio')
      )
      .subscribe(audioName => new Audio(`../assets/audio/${audioName}`).play());
  }

  ngOnDestroy() {
    this.vocabularySubscription.unsubscribe();
  }
}
