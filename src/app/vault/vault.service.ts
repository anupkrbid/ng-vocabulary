import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VaultService {

  constructor(private httpClient: HttpClient) {}

  getVaultSpriteSheet(): Observable<any> {
    const apiUrl = '../assets/db/vault-sprite.json';
    return this.httpClient.get<any>(apiUrl);
  }
}
