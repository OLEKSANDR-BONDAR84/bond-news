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
  DEFAULT_PAGE_SIZE = "1";
  maxArticles = 1;
  currPageSize = 1;
  currCountry = this.DEFAULT_COUNTRY;
  currCategory = 'General';
  dropdownList = [];
  dropdownLanguageList = [];
  dropdownCountryList = [];
  dropdownCategoryList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings;
  items = new Array<Article>();

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.dropdownCountryList = [
      { item_id: 1, item_text: 'Poland', item_code: 'pl'},
      { item_id: 2, item_text: 'Ukraine', item_code: 'ua'},
      { item_id: 3, item_text: 'russian', item_code: 'ru'},
      { item_id: 4, item_text: 'USA', item_code: 'us'}
    ];
    this.dropdownCategoryList = [
      { item_id: 1, item_text: 'General' },
      { item_id: 2, item_text: 'Entertainment' },
      { item_id: 3, item_text: 'Business' },
      { item_id: 4, item_text: 'Health' },
      { item_id: 5, item_text: 'Science' },
      { item_id: 6, item_text: 'Sports' },
      { item_id: 7, item_text: 'Technology' }
    ];
    this.getNews();
  }

  getNews(): void {
    this.httpClient.get("https://bond-common-rest-api.herokuapp.com/api/query",
        {params: {type: "newsapi-top", country: this.currCountry, pageSize: String(this.currPageSize), category: this.currCategory}})
          .subscribe((data: any) => {
            this.maxArticles = +data.totalResults;
            this.items = data.articles;
        }, error => { console.log(error.message); });
  }

  geNextNews(): void {
    if (Number(this.currPageSize) < this.maxArticles) {
      this.currPageSize++;
      this.getNews();
    }
  }

  onSelectCountry(country: string): void {
    this.currCountry = country;
    this.currPageSize = 1;
    this.getNews();
  }

  onSelectCategory(category: string): void {
      this.currCategory = category;
      this.currPageSize = 1;
      this.getNews();
  }
}
