import { HeaderModule } from '../header.module';

export class CartPage {
  readonly tag = 'ish-shopping-basket';

  readonly header = new HeaderModule();

  beginCheckout() {
    cy.wait(1000);
    cy.get(this.tag)
      .find('button')
      .contains('Checkout')
      .click();
  }

  get lineItems() {
    return cy.get(this.tag).find('div.pli-description');
  }

  lineItem(idx: number) {
    return {
      quantity: {
        set: (num: number) =>
          cy
            .get(this.tag)
            .find('input[data-testing-id="quantity"]')
            .eq(idx)
            .clear()
            .type(num.toString())
            .blur(),
      },
      remove: () =>
        cy
          .get(this.tag)
          .find('svg[data-icon="trash-alt"]')
          .eq(idx)
          .click(),
    };
  }

  get summary() {
    return {
      subtotal: cy
        .get('ish-basket-cost-summary')
        .find('dd')
        .first(),
    };
  }
}