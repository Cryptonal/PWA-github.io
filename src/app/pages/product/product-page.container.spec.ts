import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { cold } from 'jest-marbles';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { Product } from 'ish-core/models/product/product.model';
import { ApplyConfiguration } from 'ish-core/store/configuration';
import { coreReducers } from 'ish-core/store/core-store.module';
import { LoadProduct, LoadProductSuccess, SelectProduct } from 'ish-core/store/shopping/products';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';
import { MockComponent } from 'ish-core/utils/dev/mock.component';

import { ProductPageContainerComponent } from './product-page.container';

describe('Product Page Container', () => {
  let component: ProductPageContainerComponent;
  let fixture: ComponentFixture<ProductPageContainerComponent>;
  let element: HTMLElement;
  let store$: Store<{}>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FeatureToggleModule,
        NgbModalModule,
        RouterTestingModule,
        StoreModule.forRoot({
          ...coreReducers,
          shopping: combineReducers(shoppingReducers),
        }),
      ],
      declarations: [
        MockComponent({
          selector: 'ish-breadcrumb',
          template: 'Breadcrumb Component',
          inputs: ['category', 'categoryPath', 'product'],
        }),
        MockComponent({
          selector: 'ish-product-add-to-quote-dialog',
          template: 'Product Add To Quote Dialog',
          inputs: ['quote', 'quoteLoading'],
        }),
        MockComponent({
          selector: 'ish-product-detail',
          template: 'Category Page Component',
          inputs: ['product', 'currentUrl'],
        }),
        MockComponent({ selector: 'ish-loading', template: 'Loading Component' }),
        MockComponent({ selector: 'ish-recently-viewed-container', template: 'Recently Viewed Container' }),
        ProductPageContainerComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    store$ = TestBed.get(Store);
    store$.dispatch(new ApplyConfiguration({ features: ['recently'] }));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not display anything when neither product nor loading is set (only the recently viewed container)', () => {
    fixture.detectChanges();

    expect(findAllIshElements(element)).toEqual(['ish-recently-viewed-container']);
  });

  it('should display loading when product is loading', () => {
    store$.dispatch(new LoadProduct({ sku: 'dummy' }));

    fixture.detectChanges();

    expect(component.productLoading$).toBeObservable(cold('a', { a: true }));
    expect(findAllIshElements(element)).toEqual(['ish-loading', 'ish-recently-viewed-container']);
  });

  it('should display product-detail when product is available', () => {
    const product = { sku: 'dummy' } as Product;
    store$.dispatch(new LoadProductSuccess({ product }));
    store$.dispatch(new SelectProduct({ sku: product.sku }));

    fixture.detectChanges();

    expect(findAllIshElements(element)).toEqual([
      'ish-breadcrumb',
      'ish-product-detail',
      'ish-recently-viewed-container',
    ]);
  });
});