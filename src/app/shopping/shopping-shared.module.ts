import { NgModule } from '@angular/core';
import { FormsSharedModule } from '../forms/forms-shared.module';
import { SharedModule } from '../shared/shared.module';
import { CategoryNavigationComponent } from './components/category//category-navigation/category-navigation.component';
import { CategoryListComponent } from './components/category/category-list/category-list.component';
import { ProductAddToCartComponent } from './components/product/product-add-to-cart/product-add-to-cart.component';
import { ProductAttributesComponent } from './components/product/product-attributes/product-attributes.component';
import { ProductDetailActionsComponent } from './components/product/product-detail-actions/product-detail-actions.component';
import { ProductImageComponent } from './components/product/product-image/product-image.component';
import { ProductImagesComponent } from './components/product/product-images/product-images.component';
import { ProductInventoryComponent } from './components/product/product-inventory/product-inventory.component';
import { ProductListToolbarComponent } from './components/product/product-list-toolbar/product-list-toolbar.component';
import { ProductListComponent } from './components/product/product-list/product-list.component';
import { ProductPriceComponent } from './components/product/product-price/product-price.component';
import { ProductQuantityComponent } from './components/product/product-quantity/product-quantity.component';
import { ProductRowComponent } from './components/product/product-row/product-row.component';
import { ProductShipmentComponent } from './components/product/product-shipment/product-shipment.component';
import { ProductTileComponent } from './components/product/product-tile/product-tile.component';
import { RecentlyViewedComponent } from './components/recently/recently-viewed/recently-viewed.component';
import { ProductRowContainerComponent } from './containers/product-row/product-row.container';
import { ProductTileContainerComponent } from './containers/product-tile/product-tile.container';
import { RecentlyViewedContainerComponent } from './containers/recently-viewed/recently-viewed.container';

@NgModule({
  imports: [SharedModule, FormsSharedModule],
  declarations: [
    CategoryListComponent,
    CategoryNavigationComponent,
    ProductAttributesComponent,
    ProductImagesComponent,
    ProductImageComponent,
    ProductListComponent,
    ProductPriceComponent,
    ProductRowComponent,
    ProductTileComponent,
    ProductPriceComponent,
    ProductInventoryComponent,
    ProductShipmentComponent,
    ProductListToolbarComponent,
    ProductTileContainerComponent,
    ProductRowContainerComponent,
    ProductQuantityComponent,
    ProductAddToCartComponent,
    ProductDetailActionsComponent,
    RecentlyViewedContainerComponent,
    RecentlyViewedComponent,
  ],
  exports: [
    CategoryListComponent,
    CategoryNavigationComponent,
    ProductAttributesComponent,
    ProductImageComponent,
    ProductImagesComponent,
    ProductListComponent,
    ProductRowComponent,
    ProductTileComponent,
    ProductPriceComponent,
    ProductInventoryComponent,
    ProductShipmentComponent,
    ProductListToolbarComponent,
    ProductTileContainerComponent,
    ProductRowContainerComponent,
    ProductQuantityComponent,
    ProductAddToCartComponent,
    ProductDetailActionsComponent,
    RecentlyViewedContainerComponent,
    RecentlyViewedComponent,
  ],
})
export class ShoppingSharedModule {}
