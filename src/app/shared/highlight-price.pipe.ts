import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlightPrice',
  standalone: false
})
export class HighlightPricePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string | undefined): SafeHtml {
    if (!value) return '';

    // Regex to match currency patterns like $10, $10.99, $1,100.00
    const priceRegex = /(\$\s?[\d,]+(?:\.\d{2})?)/g;
    // Regex to match due dates like "Due: 26 Nov 2025"
    const dateRegex = /(Due:?\s*\d{1,2}\s+[A-Za-z]+\s+\d{4})/gi;

    let highlighted = value.replace(priceRegex, '<span class="highlight-price">$1</span>');
    highlighted = highlighted.replace(dateRegex, '<span class="highlight-date">$1</span>');

    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }

}
