import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchResponse, Gif } from '../interfaces/gifs.interfaces';


@Injectable({providedIn: 'root'})
export class GifsService {
  public gifsList:Gif[]=[]

  private _tagHistory:string[]=[]

  private apiKey:string='rItJ3XWa59bD5mGNL4PkoeqvBXfhEXMR';

  private serviceUrl:string = 'https://api.giphy.com/v1/gifs';
  constructor(private http:HttpClient) {
    this.loadLocalStorage();
    this.searchTag(this._tagHistory[0]);
   }

  get tagsHistory(){
    return [...this._tagHistory]
  }

  private organizeHistory(tag:string){
    tag=tag.toLowerCase();

    if(this._tagHistory.includes(tag)){
      this._tagHistory=this._tagHistory.filter((oldtag)=>oldtag!==tag)
    }

    this._tagHistory.unshift(tag);
    this._tagHistory = this._tagHistory.splice(0,10)
    this.saveLocalStorage();
  }


  private saveLocalStorage(){
    localStorage.setItem('history', JSON.stringify(this.tagsHistory))
  }

  private loadLocalStorage():void{
    if(!localStorage.getItem('history'))return
    this._tagHistory = JSON.parse(localStorage.getItem('history')!);

  }

  searchTag(tag:string):void{

    if(tag.length===0)return;

    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', tag)

    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, {params})
      .subscribe(
        resp=>{

          this.gifsList=resp.data;
        }
      )


  }


}
