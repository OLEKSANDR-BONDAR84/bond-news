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
  DEFAULT_PAGE_SIZE = "3";
  maxArticles = '0';
  currPage = this.DEFAULT_PAGE;
  currentArticle = Number(this.DEFAULT_PAGE_SIZE);
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
    this.dropdownLanguageList = [
      { item_id: 1, item_text: 'PL' },
      { item_id: 2, item_text: 'UA' },
      { item_id: 3, item_text: 'RU' },
      { item_id: 4, item_text: 'EN' }
    ];
    this.dropdownCountryList = [
      { item_id: 1, item_text: 'PL' },
      { item_id: 2, item_text: 'UA' },
      { item_id: 3, item_text: 'RU' },
      { item_id: 4, item_text: 'US' }
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
    this.getNews(this.DEFAULT_PAGE);
  }

  getNews(page: string): void {
    this.currPage = page;
    this.currentArticle = Number(this.currPage)*Number(this.DEFAULT_PAGE_SIZE);
    this.httpClient.get("https://bond-common-rest-api.herokuapp.com/api/query",
        {params: {type: "newsapi-top", country: this.currCountry, pageSize: this.DEFAULT_PAGE_SIZE,
        page: this.currPage, category: this.currCategory}})
          .subscribe((data: any) => {
            this.maxArticles = data.totalResults;
            this.items = data.articles;
        }, error => { console.log(error.message) });
  }

  geNextNews(): void {
    if (this.currentArticle < Number(this.maxArticles)) {
      this.getNews(String(Number(this.currPage)+1));
    }
  }

  gePrevNews(): void {
    if (Number(this.currPage) > 1) {
      this.getNews(String(Number(this.currPage)-1));
    }
  }

  onSelectCountry(country: string): void {
    this.currCountry = country;
    this.getNews(this.DEFAULT_PAGE);
  }

  onSelectCategory(category: string): void {
      this.currCategory = category;
      this.getNews(this.DEFAULT_PAGE);
  }
}
