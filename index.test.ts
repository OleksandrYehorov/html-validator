import { validateHtml } from './index';

interface TestCase {
  testName: string;
  inputHtml: string;
}

const validInputCases: TestCase[] = [
  {
    testName: 'empty input',
    inputHtml: '',
  },
  {
    testName: 'open and close tags',
    inputHtml: '<div></div>',
  },
  {
    testName: 'self closing tags',
    inputHtml: '<img/>',
  },
  {
    testName: 'self text content',
    inputHtml: '<span>text content</span>',
  },
  {
    testName: 'white spaces',
    inputHtml: `
      <p 
    
      >
      
      </p   


      >`,
  },
  {
    testName: 'numbers in tag names',
    inputHtml: `<h3></h3>`,
  },
  {
    testName: 'attributes',
    inputHtml: `
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/240px-JavaScript-logo.png"
        width="240"
        height="240"
        alt="lorem"
      />
    `,
  },
  {
    testName: 'invalid html in attributes values',
    inputHtml: `
      <img
        src="<span><p></span></p>"
        width="240"
        height="240"
        alt="lorem"
      />
    `,
  },
  {
    testName: 'valid html in attributes values',
    inputHtml: `
      <img
        src="<span>text content</span>"
        width="240"
        height="240"
        alt="lorem"
      />
    `,
  },
  {
    testName: 'nested markup',
    inputHtml: ` 
      <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
      </ul>
    `,
  },
  {
    testName: 'comments',
    inputHtml: `
      <div>
        <!-- <span>commented markup</span> -->
        <div></div>
        <!-- <img
          src="/lib/images/footer-logo.jpg"
          alt="logo"
        /><div> -->
      </div>
    `,
  },
  {
    testName: 'special chars in text content',
    inputHtml: `<span>/!&lt;&%$}{#?</span>`,
  },
  {
    testName: 'case insensitive tag names',
    inputHtml: `<SPaN></Span>`,
  },
  {
    testName: 'invalid html inside scripts',
    inputHtml: `
      <div>
        <script>
          const invalidHtmlString = '<div><span></div></span>';
        </script>
      </div>
    `,
  },
  {
    testName: 'valid html inside scripts',
    inputHtml: `
      <div>
        <script>
          const invalidHtmlString = '<div><span>text</span></div>';
        </script>
      </div>
    `,
  },
  {
    testName: 'special self closing tags without closing tag',
    inputHtml: `
      <div>
        <input type="text">
        <input type="text"/>
      </div>
    `,
  },
  {
    testName: 'special self closing tags with closing tag',
    inputHtml: `
      <div>
        <input type="text"></input>
      </div>
    `,
  },
  {
    testName: 'text',
    inputHtml: 'text content',
  },
];

const invalidInputCases: TestCase[] = [
  {
    testName: 'unclosed tags',
    inputHtml: '<div>',
  },
  {
    testName: 'unopened tags',
    inputHtml: '</div>',
  },
  {
    testName: 'invalid tag sequences',
    inputHtml: '<div><span></div></span>',
  },
];

describe('validateHtml', () => {
  describe('when input is valid html', () => {
    describe('should handle', () => {
      for (const { inputHtml, testName } of validInputCases) {
        test(testName, () => {
          expect(validateHtml(inputHtml)).toBe(true);
        });
      }
    });
  });

  describe('when input is invalid html', () => {
    describe('should handle', () => {
      for (const { inputHtml, testName } of invalidInputCases) {
        test(testName, () => {
          expect(validateHtml(inputHtml)).toBe(false);
        });
      }
    });
  });
});
