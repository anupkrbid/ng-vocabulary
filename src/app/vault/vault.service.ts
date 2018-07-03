import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VaultService {

  executeAnimation = new Subject<any>();

  constructor(private httpClient: HttpClient) {}

  getVaultSpriteSheet(): Observable<any> {
    const apiUrl = '../assets/db/vault-sprite.json';
    return this.httpClient.get<any>(apiUrl);
  }
}
