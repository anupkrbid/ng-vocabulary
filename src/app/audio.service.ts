import { Injectable } from '@angular/core';
import { fromEvent, Observable, Observer, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio: HTMLAudioElement = new Audio();
  private stop$ = new Subject();

  constructor() {}

  playback(src: string) {
    const mediaEvents: { [key: string]: Observable<any> } = {};
    const mediaEventSubscriptions: { [key: string]: Subscription } = {};
    const mediaEventNames = [
      'audioprocess', // The input buffer of a ScriptProcessorNode is ready to be processed.
      'complete', // The rendering of an OfflineAudioContext is terminated.

      'abort', // Fires when the loading of an audio/video is aborted
      'canplay', // Fires when the browser can start playing the audio/video
      'canplaythrough', // Fires when the browser can play through the audio/video without stopping for buffering
      'durationchange', // Fires when the duration of the audio/video is changed
      'emptied', // Fires when the current playlist is empty
      'ended', // Fires when the current playlist is ended
      'error', // Fires when an error occurred during the loading of an audio/video
      'loadeddata', // Fires when the browser has loaded the current frame of the audio/video
      'loadedmetadata', // Fires when the browser has loaded meta data for the audio/video
      'loadstart', // Fires when the browser starts looking for the audio/video
      'pause', // Fires when the audio/video has been paused
      'play', // Fires when the audio/video has been started or is no longer paused
      'playing', // Fires when the audio/video is playing after having been paused or stopped for buffering
      'progress', // Fires when the browser is downloading the audio/video
      'ratechange', // Fires when the playing speed of the audio/video is changed
      'seeked', // Fires when the user is finished moving/skipping to a new position in the audio/video
      'seeking', // Fires when the user starts moving/skipping to a new position in the audio/video
      'stalled', // Fires when the browser is trying to get media data, but data is not available
      'suspend', // Fires when the browser is intentionally not getting media data
      'timeupdate', // Fires when the current playback position has changed
      'volumechange', // Fires when the volume has been changed
      'waiting' // Fires when the video stops because it needs to buffer the next frame
    ];
    const playerMetaData = {
      playing: false, // Holds state of player if audio is playing or not

      audioTracks: '', // Returns an AudioTrackList object representing available audio tracks
      autoplay: '', // Sets or returns whether the audio/video should start playing as soon as it is loaded
      buffered: 0, // Returns a TimeRanges object representing the buffered parts of the audio/video
      controller: '', // Returns the MediaController object representing the current media controller of the audio/video
      controls: '', // Sets or returns whether the audio/video should display controls (like play/pause etc.)
      crossOrigin: '', // Sets or returns the CORS settings of the audio/video
      currentSrc: '', // Returns the URL of the current audio/video
      currentTime: 0, // Sets or returns the current playback position in the audio/video (in seconds)
      defaultMuted: false, // Sets or returns whether the audio/video should be muted by default
      defaultPlaybackRate: 1, // Sets or returns the default speed of the audio/video playback
      duration: 0, // Returns the length of the current audio/video (in seconds)
      ended: false, // Returns whether the playback of the audio/video has ended or not
      error: '', // Returns a MediaError object representing the error state of the audio/video
      loop: false, // Sets or returns whether the audio/video should start over again when finished
      mediaGroup: '', // Sets or returns the group the audio/video belongs to (used to link multiple audio/video elements)
      muted: false, // Sets or returns whether the audio/video is muted or not
      networkState: '', // Returns the current network state of the audio/video
      paused: false, // Returns whether the audio/video is paused or not
      playbackRate: 0, // Sets or returns the speed of the audio/video playback
      played: '', // Returns a TimeRanges object representing the played parts of the audio/video
      preload: '', // Sets or returns whether the audio/video should be loaded when the page loads
      readyState: '', // Returns the current ready state of the audio/video
      seekable: '', // Returns a TimeRanges object representing the seekable parts of the audio/video
      seeking: '', // Returns whether the user is currently seeking in the audio/video
      src: '', // Sets or returns the current source of the audio/video element
      startDate: '', // Returns a Date object representing the current time offset
      textTracks: '', // Returns a TextTrackList object representing the available text tracks
      videoTracks: '', // Returns a VideoTrackList object representing the available video tracks
      volume: 1 // Sets or returns the volume of the audio/video
    };
    const subjects = {
      play$: new Subject(), // custom event to start playing audio
      pause$: new Subject(), // custom event to pasue playing audio
      stop$: new Subject(), // custom event to stop playing audio
      togglePlayPause$: new Subject() // custom event to toggle btw play/pause state of audio
    };

    const addEventListeners = () => {
      mediaEventNames.forEach(event => {
        mediaEvents[`${event}$`] = fromEvent(this.audio, event);
      });
    };

    const removeEventListeners = () => {
      for (const subscription in mediaEventSubscriptions) {
        if (mediaEventSubscriptions.hasOwnProperty(subscription)) {
          mediaEventSubscriptions[subscription].unsubscribe();
        }
      }
    };

    return Observable.create((observer: Observer<any>) => {
      addEventListeners();

      // 'abort' //	Fires when the loading of an audio/video is aborted
      mediaEventSubscriptions.abortSubscription = mediaEvents.abort$.subscribe(
        () => {
          observer.next(playerMetaData);
          console.log('abort event fired!');
        }
      );

      // 'canplay' // Fires when the browser can start playing the audio/video
      mediaEventSubscriptions.canplaySubscription = mediaEvents.canplay$.subscribe(
        () => {
          this.audio.play();
          observer.next(playerMetaData);
          console.log('canplay event fired!');
        }
      );

      // 'canplaythrough' // Fires when the browser can play through the audio/video without stopping for buffering
      mediaEventSubscriptions.canplaythroughSubscription = mediaEvents.canplaythrough$.subscribe(
        () => {
          observer.next(playerMetaData);
          console.log('canplaythrough event fired!');
        }
      );

      // 'durationchange' // Fires when the duration of the audio/video is changed
      mediaEventSubscriptions.durationchangeSubscription = mediaEvents.durationchange$.subscribe(
        () => {
          playerMetaData.duration = this.audio.duration;
          observer.next(playerMetaData);
          console.log('durationchange event fired!');
        }
      );

      // 'emptied' //	Fires when the current playlist is empty
      mediaEventSubscriptions.emptiedSubscription = mediaEvents.emptied$.subscribe(
        () => {
          observer.next(playerMetaData);
          console.log('emptied event fired!');
        }
      );

      // 'ended' //	Fires when the current playlist is ended
      mediaEventSubscriptions.endedSubscription = mediaEvents.ended$.subscribe(
        () => {
          alert('ended');
          playerMetaData.ended = true;
          observer.next(playerMetaData);
          console.log('ended event fired!');
        }
      );

      // 'error' //	Fires when an error occurred during the loading of an audio/video
      mediaEventSubscriptions.errorSubscription = mediaEvents.error$.subscribe(
        () => {
          observer.next(playerMetaData);
          console.log('error event fired!');
        }
      );

      // 'loadeddata' // Fires when the browser has loaded the current frame of the audio/video
      mediaEventSubscriptions.loadeddataSubscription = mediaEvents.loadeddata$.subscribe(
        () => {
          observer.next(playerMetaData);
          console.log('loadeddata event fired!');
        }
      );

      // 'loadedmetadata' // Fires when the browser has loaded meta data for the audio/video
      mediaEventSubscriptions.loadedmetadataSubscription = mediaEvents.loadedmetadata$.subscribe(
        () => {
          observer.next(playerMetaData);
          console.log('loadedmetadata event fired!');
        }
      );

      // 'loadstart' //	Fires when the browser starts looking for the audio/video
      mediaEventSubscriptions.loadstartSubscription = mediaEvents.loadstart$.subscribe(
        () => {
          observer.next(playerMetaData);
          console.log('loadstart event fired!');
        }
      );

      // 'pause' //	Fires when the audio/video has been paused
      mediaEventSubscriptions.pauseSubscription = mediaEvents.pause$.subscribe(
        () => {
          playerMetaData.paused = this.audio.paused;
          playerMetaData.playing = !this.audio.paused;
          observer.next(playerMetaData);
          console.log('pause event fired!');
        }
      );

      // 'play' // Fires when the audio/video has been started or is no longer paused
      mediaEventSubscriptions.playSubscription = mediaEvents.play$.subscribe(
        () => {
          playerMetaData.paused = false;
          playerMetaData.playing = true;
          observer.next(playerMetaData);
          console.log('play event fired!');
        }
      );

      // 'playing' //	Fires when the audio/video is playing after having been paused or stopped for buffering
      mediaEventSubscriptions.playingSubscription = mediaEvents.playing$.subscribe(
        () => {
          playerMetaData.paused = false;
          playerMetaData.playing = true;
          observer.next(playerMetaData);
          console.log('playing event fired!');
        }
      );

      // 'progress' // Fires when the browser is downloading the audio/video
      mediaEventSubscriptions.progressSubscription = mediaEvents.progress$.subscribe(
        () => {
          // playerMetaData.buffered = this.audio.buffered.end(0);
          // playerMetaData.seekable = this.audio.seekable;
          observer.next(playerMetaData);
          console.log('progress event fired!');
        }
      );

      // 'ratechange' // Fires when the playing speed of the audio/video is changed
      mediaEventSubscriptions.ratechangeSubscription = mediaEvents.ratechange$.subscribe(
        () => {
          playerMetaData.playbackRate = this.audio.playbackRate;
          observer.next(playerMetaData);
          console.log('ratechange event fired!');
        }
      );

      // 'seeked' // Fires when the user is finished moving/skipping to a new position in the audio/video
      mediaEventSubscriptions.seekedSubscription = mediaEvents.seeked$.subscribe(
        () => {
          playerMetaData.currentTime = this.audio.currentTime;
          observer.next(playerMetaData);
          console.log('seeked event fired!');
        }
      );

      // 'seeking' // Fires when the user starts moving/skipping to a new position in the audio/video
      mediaEventSubscriptions.seekingSubscription = mediaEvents.seeking$.subscribe(
        () => {
          playerMetaData.currentTime = this.audio.currentTime;
          observer.next(playerMetaData);
          console.log('seeking event fired!');
        }
      );

      // 'stalled' // Fires when the browser is trying to get media data, but data is not available
      mediaEventSubscriptions.stalledSubscription = mediaEvents.stalled$.subscribe(
        () => {
          observer.next(playerMetaData);
          console.log('stalled event fired!');
        }
      );

      // 'suspend' // Fires when the browser is intentionally not getting media data
      mediaEventSubscriptions.suspendSubscription = mediaEvents.suspend$.subscribe(
        () => {
          observer.next(playerMetaData);
          console.log('suspend event fired!');
        }
      );

      // 'timeupdate' // Fires when the current playback position has changed
      mediaEventSubscriptions.timeupdateSubscription = mediaEvents.timeupdate$.subscribe(
        () => {
          playerMetaData.currentTime = this.audio.currentTime;
          playerMetaData.buffered = this.audio.buffered.end(0);
          observer.next(playerMetaData);
          console.log('timeupdate event fired!');
        }
      );

      // 'volumechange' // Fires when the volume has been changed
      mediaEventSubscriptions.volumechangeSubscription = mediaEvents.volumechange$.subscribe(
        () => {
          playerMetaData.volume = this.audio.volume;
          observer.next(playerMetaData);
          console.log('volumechange event fired!');
        }
      );

      // 'waiting' // Fires when the video stops because it needs to buffer the next frame
      mediaEventSubscriptions.waitingSubscription = mediaEvents.waiting$.subscribe(
        () => {
          console.log('waiting event fired!');
          observer.next(playerMetaData);
        }
      );

      this.audio.src = src;
      playerMetaData.src = src;

      // observer.next(sharableSubjects);

      return () => {
        console.log('unsubscribing!');
        this.audio.pause();
        this.audio.src = '';
        removeEventListeners();
      };
    });
  }

  play(src: string) {
    return this.playback(src).pipe(takeUntil(this.stop$));
  }

  stop() {
    this.stop$.next();
  }
}
