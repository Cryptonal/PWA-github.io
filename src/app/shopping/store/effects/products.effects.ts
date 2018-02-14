import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';
import { ShoppingState } from '../';
import { randomDelay } from '../../../dev-utils/operators';
import { ProductsService } from '../../services/products/products.service';
import * as productsActions from '../actions/products.actions';
import { ProductsActionTypes } from '../actions/products.actions';
import * as productsSelectors from '../selectors/products.selectors';

@Injectable()
export class ProductsEffects {
  constructor(
    private actions$: Actions,
    private store: Store<ShoppingState>,
    private productsService: ProductsService
  ) { }

  @Effect()
  loadProduct$ = this.actions$.pipe(
    ofType(ProductsActionTypes.LOAD_PRODUCT),
    map((action: productsActions.LoadProduct) => action.payload),
    mergeMap(sku => {
      return this.productsService.getProduct(sku).pipe(
        randomDelay(), // DEBUG
        map(product => new productsActions.LoadProductSuccess(product)),
        catchError(error => of(new productsActions.LoadProductFail(error)))
      );
    })
  );

  @Effect()
  selectedProduct$ = this.store.select(productsSelectors.getSelectedProductId).pipe(
    filter(id => !!id),
    map(id => new productsActions.LoadProduct(id)),
  );
}
