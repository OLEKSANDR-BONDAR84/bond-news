import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { IDropdownSettings } from 'ng-multiselect-dropdown';

export interface Source {
    id: string;
    name: string;
    description: string;
    url: string;
    category: string;
    language: string;
    country: string;
}

export interface Article {
    author: string;
    content: string;
    description: string;
    publishedAt: string;
    source: Source;
    title: string;
    url: string;
    urlToImage: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'bond-news';
  DEFAULT_COUNTRY = 'PL';
  DEFAULT_PAGE = "1";
  country: string = 'PL';
  page: string = '1';
  dropdownList = [];
  dropdownLanguageList = [];
  dropdownCountryList = [];
  dropdownCategoryList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings;
  items = new Array<Article>();

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.dropdownLanguageList = [
      { item_id: 1, item_text: 'PL' },
      { item_id: 2, item_text: 'UA' },
      { item_id: 3, item_text: 'RU' },
      { item_id: 4, item_text: 'EN' },
      { item_id: 5, item_text: 'All' }
    ];
    this.dropdownCountryList = [
      { item_id: 1, item_text: 'PL' },
      { item_id: 2, item_text: 'UA' },
      { item_id: 3, item_text: 'RU' },
      { item_id: 4, item_text: 'US' },
      { item_id: 5, item_text: 'All' }
    ];
    this.dropdownCategoryList = [
      { item_id: 1, item_text: 'Business' },
      { item_id: 2, item_text: 'Entertainment' },
      { item_id: 3, item_text: 'General' },
      { item_id: 4, item_text: 'Health' },
      { item_id: 5, item_text: 'Science' },
      { item_id: 6, item_text: 'Sports' },
      { item_id: 7, item_text: 'Technology' },
      { item_id: 8, item_text: 'All' }
    ];
    this.getNews(this.DEFAULT_COUNTRY, this.DEFAULT_PAGE);
  }

  getNews(country: string, page: string): void {
    this.page = page;
    this.httpClient.get<any>("https://bond-common-rest-api.herokuapp.com/api?id=1")
    .subscribe( response => { this.httpClient.get(response.configValue,
    {params: {country: country, pageSize: "5", page: this.page, apiKey: "2b0d53a3d6b74c5dbdcda7cdf7b190bf"}})
      .subscribe((data: any)=> {
        this.items = data.articles;
    }); }, error => { console.log(error.message) });
  }

  geNextNews(): void {
    this.getNews(this.country, String(Number(this.DEFAULT_PAGE)+1));
  }

  gePrevNews(): void {
    this.getNews(this.country, String(Number(this.DEFAULT_PAGE)-1));
  }

  onSelectCountry(country: string): void {
    this.country = country;
    this.getNews(this.country, this.DEFAULT_PAGE);
  }
}
