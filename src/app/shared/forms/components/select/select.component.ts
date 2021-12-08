import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { SelectOption } from 'ish-core/models/select-option/select-option.model';
import { FormElementComponent } from 'ish-shared/forms/components/form-element/form-element.component';

// tslint:disable ish-deprecation

/**
 * @deprecated use formly instead
 */
@Component({
  selector: 'ish-select',
  templateUrl: './select.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SelectComponent extends FormElementComponent implements OnInit {
  @Input() options: SelectOption[];
  @Input() translateOptionLabels = false;
  @Input() translateOptionValues = false;
  @Input() emptyOptionLabel = 'account.option.select.text';

  showEmptyOption: boolean; // is automatically set if the control value is empty

  constructor(protected translate: TranslateService) {
    super(translate);
  }

  ngOnInit() {
    this.componentInit();
  }

  protected componentInit() {
    super.init();

    // show empty option if the control value is empty
    this.showEmptyOption = !this.formControl.value;
  }
}
