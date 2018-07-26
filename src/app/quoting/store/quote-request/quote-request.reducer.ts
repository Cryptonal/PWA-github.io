import { HttpErrorResponse } from '@angular/common/http';
import { UserAction, UserActionTypes } from '../../../core/store/user';
import { QuoteRequestItem } from '../../../models/quote-request-item/quote-request-item.model';
import { QuoteRequestData } from '../../../models/quote-request/quote-request.interface';
import { QuoteAction, QuoteRequestActionTypes } from './quote-request.actions';

export interface QuoteRequestState {
  quoteRequests: QuoteRequestData[];
  quoteRequestItems: QuoteRequestItem[];
  loading: boolean;
  error: HttpErrorResponse;
  selected: string;
}

export const initialState: QuoteRequestState = {
  quoteRequests: [],
  quoteRequestItems: [],
  loading: false,
  error: undefined,
  selected: undefined,
};

export function quoteRequestReducer(state = initialState, action: QuoteAction | UserAction): QuoteRequestState {
  switch (action.type) {
    case UserActionTypes.LogoutUser: {
      return initialState;
    }

    case QuoteRequestActionTypes.SelectQuoteRequest: {
      return {
        ...state,
        selected: action.payload,
      };
    }

    case QuoteRequestActionTypes.LoadQuoteRequests:
    case QuoteRequestActionTypes.AddQuoteRequest:
    case QuoteRequestActionTypes.UpdateQuoteRequest:
    case QuoteRequestActionTypes.DeleteQuoteRequest:
    case QuoteRequestActionTypes.SubmitQuoteRequest:
    case QuoteRequestActionTypes.CreateQuoteRequestFromQuote:
    case QuoteRequestActionTypes.LoadQuoteRequestItems:
    case QuoteRequestActionTypes.AddProductToQuoteRequest:
    case QuoteRequestActionTypes.AddBasketToQuoteRequest:
    case QuoteRequestActionTypes.UpdateQuoteRequestItems:
    case QuoteRequestActionTypes.DeleteItemFromQuoteRequest: {
      return {
        ...state,
        loading: true,
      };
    }

    case QuoteRequestActionTypes.LoadQuoteRequestsFail:
    case QuoteRequestActionTypes.AddQuoteRequestFail:
    case QuoteRequestActionTypes.UpdateQuoteRequestFail:
    case QuoteRequestActionTypes.DeleteQuoteRequestFail:
    case QuoteRequestActionTypes.SubmitQuoteRequestFail:
    case QuoteRequestActionTypes.CreateQuoteRequestFromQuoteFail:
    case QuoteRequestActionTypes.LoadQuoteRequestItemsFail:
    case QuoteRequestActionTypes.AddProductToQuoteRequestFail:
    case QuoteRequestActionTypes.AddBasketToQuoteRequestFail:
    case QuoteRequestActionTypes.UpdateQuoteRequestItemsFail:
    case QuoteRequestActionTypes.DeleteItemFromQuoteRequestFail: {
      const error = action.payload;

      return {
        ...state,
        error,
        loading: false,
      };
    }

    case QuoteRequestActionTypes.LoadQuoteRequestsSuccess: {
      const quoteRequests = action.payload;

      return {
        ...state,
        quoteRequests: quoteRequests,
        loading: false,
      };
    }

    case QuoteRequestActionTypes.LoadQuoteRequestItemsSuccess: {
      const quoteRequestItems = action.payload;

      return {
        ...state,
        quoteRequestItems,
        loading: false,
      };
    }

    case QuoteRequestActionTypes.AddQuoteRequestSuccess:
    case QuoteRequestActionTypes.UpdateQuoteRequestSuccess:
    case QuoteRequestActionTypes.DeleteQuoteRequestSuccess:
    case QuoteRequestActionTypes.SubmitQuoteRequestSuccess:
    case QuoteRequestActionTypes.CreateQuoteRequestFromQuoteSuccess:
    case QuoteRequestActionTypes.AddProductToQuoteRequestSuccess:
    case QuoteRequestActionTypes.AddBasketToQuoteRequestSuccess:
    case QuoteRequestActionTypes.UpdateQuoteRequestItemsSuccess:
    case QuoteRequestActionTypes.DeleteItemFromQuoteRequestSuccess: {
      return {
        ...state,
        loading: false,
      };
    }
  }

  return state;
}
