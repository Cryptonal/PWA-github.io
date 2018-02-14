import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { filter } from 'rxjs/operators';
import { Category } from '../../../models/category/category.model';
import { Product } from '../../../models/product/product.model';
import { getSelectedCategory, getSelectedCategoryPath } from '../../store/categories';
import { getProductLoading, getSelectedProduct } from '../../store/products';
import { ShoppingState } from '../../store/shopping.state';

@Component({
  selector: 'ish-product-page',
  templateUrl: './product-page.component.html'
})

export class ProductPageComponent implements OnInit {

  product$: Observable<Product>;
  productLoading$: Observable<boolean>;
  category$: Observable<Category>;
  categoryPath$: Observable<Category[]> = of([]);

  constructor(
    private store: Store<ShoppingState>
  ) { }

  ngOnInit() {
    // TODO: find a nicer way to filter out the case of an 'undefined' product when the router state change is not waiting for the guard to actually do the routing
    this.product$ = this.store.select(getSelectedProduct).pipe(
      filter(product => !!product)
    );

    // TODO: find a nicer way to filter out the case of an 'undefined' category when the router state change is not waiting for the guard to actually do the routing
    this.category$ = this.store.select(getSelectedCategory).pipe(
      filter(category => !!category)
    );

    this.productLoading$ = this.store.select(getProductLoading);

    // TODO: only category should be needed once the REST call returns the categoryPath as part of the category
    this.categoryPath$ = this.store.select(getSelectedCategoryPath);
  }

}
