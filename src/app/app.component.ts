import {
  Component,
  HostListener,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import {
  animate,
  AnimationEvent,
  style,
  transition,
  trigger
} from '@angular/animations';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, tap, take, withLatestFrom, pluck, filter } from 'rxjs/operators';

import { AppService } from './app.service';
import { AppState } from './app-state.interface';
import { HelpModalOverlayRef } from './help-modal/help-modal-overlay-ref.class';
import { HelpModalService } from './help-modal/help-modal.service';
import { Question, WordVault } from './word-vault.interface';
import { VocabularyState } from './vocabulary-state.interface';
import { VaultService } from './vault/vault.service';
import { AudioService } from './audio.service';

// Keycode for ESCAPE
const ESCAPE = 27;

// Pick a random Audio
const pickRandomAudio = audioArray => {
  return audioArray[Math.floor(Math.random() * audioArray.length)];
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 }))
      ])
      // transition(':leave', [
      //   animate('200ms ease-in', style({ transform: 'translateY(-100%)' }))
      // ])
    ])
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  vaultState$: Observable<WordVault>;
  vaultHelpSubscription: Subscription;
  noOfRounds$: Observable<any>;
  appState$: Observable<AppState>;
  vocabularyState$: Observable<VocabularyState>;
  vocabularySubscription: Subscription;
  dialogRef: HelpModalOverlayRef;
  helpInfo: string;
  noOfWrongAttemps = 0;
  answerStatus = {
    correct: null,
    incorrect: null
  };
  audioSubscription: Subscription;
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
    private audioService: AudioService,
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
    const submittedAnswer = form.value.answer;
    const allPossibleAnswers = question.answers;
    const correctAnswerIndex = question.correctAnswer - 1;

    // reset form and reset answer indication for incorrect attempt after audio has finished
    this.audioSubscription = this.audioService.audioInfo.subscribe(audio => {
      if (audio.ended) {
        this.form.reset();
        this.audioSubscription.unsubscribe();
        this.answerStatus = {
          correct: null,
          incorrect: null
        };

        // answer correct in first attempt
        if (allPossibleAnswers[correctAnswerIndex] === submittedAnswer) {
          this.noOfWrongAttemps = 0; // reset correct attempts state
          this.appService.indexOfQuestionAnswered$.next(
            indexOfQuestionAnswered
          );
          // this.appService.appState$.next({...appState, currentQuestion: appState.currentQuestion + 1});
        } else {
          // check if incorrect answer on first attempts
          if (this.noOfWrongAttemps === 2) {
            this.noOfWrongAttemps = 0; // reset incorrect attempts state

            // emiting event to update the app state when answers was incorrect
            this.getNextPossibleValidState(indexOfQuestionAnswered, false);
          }
        }
      }
    });

    // choose audio to play based on answer status
    if (allPossibleAnswers[correctAnswerIndex] === submittedAnswer) {
      // check if correct anser in second attempt
      if (this.noOfWrongAttemps === 1) {
        // play audio
        this.vaultState$
          .pipe(
            take(1),
            pluck('audio', 'retryCorrect')
          )
          .subscribe(audioName =>
            this.audioService.play(`../assets/audio/sfx/${audioName}`)
          );
      } else {
        // play audio
        this.vaultState$
          .pipe(
            take(1),
            pluck('audio', 'correct')
          )
          .subscribe(audioArray =>
            this.audioService.play(
              `../assets/audio/sfx/${pickRandomAudio(audioArray)}`
            )
          );
      }
    } else {
      // check if incorrect answer on first attempts
      if (++this.noOfWrongAttemps < 2) {
        // play audio
        this.vaultState$
          .pipe(
            take(1),
            pluck('audio', 'retry')
          )
          .subscribe(audioArray =>
            this.audioService.play(
              `../assets/audio/sfx/${pickRandomAudio(audioArray)}`
            )
          );
      } else {
        // css change to highlight correct and incorrect answer
        this.answerStatus = {
          correct: allPossibleAnswers[correctAnswerIndex],
          incorrect: submittedAnswer
        };

        // play audio
        this.vaultState$
          .pipe(
            take(1),
            pluck('audio', 'incorrect')
          )
          .subscribe(audioName =>
            this.audioService.play(`../assets/audio/sfx/${audioName}`)
          );
      }
    }
  }

  observeVocabularyStateChange() {
    // this will capture all events when any question is answered correctly which will be a number
    this.vocabularySubscription = this.appService.indexOfQuestionAnswered$
      .pipe(
        // this will get the latest values from the word vault
        withLatestFrom(this.vaultState$),
        // do something with the index of the answered question and the latest values form vault
        tap(([indexOfQuestionAnswered, vaultState]) => {
          // get the last updated value of the app state
          const appState = this.appService.appState$.getValue();
          // get the animation state table
          const animationState = this.appService.animationState$.getValue();

          // object which will update the new app state depending on the previous state
          const callbackOnAnimationEnd = {
            arg1: appState,
            arg2: indexOfQuestionAnswered,
            arg3: vaultState,
            callback: this.handleAppStateChange.bind(this)
          };

          // getting the start and end frame to preform the vault animaiton
          const noOfCorrectAnswersGivenForCurrentRound = appState.answerStatus[
            appState.currentRound.toString()
          ].filter(data => data).length;
          const frameRange =
            animationState[appState.currentRound.toString()][
              noOfCorrectAnswersGivenForCurrentRound
            ];

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

  handleAppStateChange(appState, indexOfQuestionAnswered, vaultState) {
    this.getNextPossibleValidState(indexOfQuestionAnswered, true);
  }

  getNextPossibleValidState(indexOfQuestionAnswered, answerIsCorrect) {
    this.vaultState$.pipe(take(1)).subscribe(vaultState => {
      const appState = this.appService.appState$.getValue();
      const newState = { ...appState };

      const noOfRounds = Object.keys(vaultState.rounds).length;

      const noOfQuestionsInCurrentRound =
        vaultState.rounds[appState.currentRound.toString()].questions.length;

      if (answerIsCorrect) {
        newState.answerStatus[newState.currentRound.toString()][
          newState.currentQuestion - 1
        ] = true;
      }

      const noOfCorrectAnswersGivenInCurrentRound = newState.answerStatus[
        newState.currentRound.toString()
      ].filter(a => a === true).length;

      if (
        noOfQuestionsInCurrentRound === noOfCorrectAnswersGivenInCurrentRound
      ) {
        newState.currentQuestion = 1;
        newState.currentRound = newState.currentRound + 1;
      } else {
        const questionNoJustAnswered = indexOfQuestionAnswered + 1;

        let currentAnsweredQuestionIndex = questionNoJustAnswered - 1;
        const currentRound = newState.currentRound.toString();

        do {
          if (
            ++currentAnsweredQuestionIndex >
            noOfQuestionsInCurrentRound - 1
          ) {
            currentAnsweredQuestionIndex = 0;
          }
        } while (
          newState.answerStatus[currentRound][currentAnsweredQuestionIndex]
        );

        newState.currentQuestion = currentAnsweredQuestionIndex + 1;
      }

      if (newState.currentRound > noOfRounds) {
        console.log('Completed');
      } else {
        // emiting event to update the vocabulary state with updated state
        this.appService.appState$.next(newState);
      }
    });
  }

  onOpenHelpDialog() {
    // returns a handle to the open overlay
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
      .subscribe(audioName =>
        this.audioService.play(`../assets/audio/${audioName}`)
      );
  }

  animationStarted(event: AnimationEvent) {
    if (!event.fromState) {
      this.vaultState$
        .pipe(
          take(1),
          pluck('audio', 'questionChange')
        )
        .subscribe(audioName =>
          this.audioService.play(`../assets/audio/sfx/${audioName}`)
        );
    }
  }

  ngOnDestroy() {
    this.vocabularySubscription.unsubscribe();
    this.audioSubscription.unsubscribe();
  }
}
