# CSS hex to vars transformer

A fun project to publish a first open source npm package!

Takes all hex codes of a single css file, creates css variables and swaps the hex codes with the according variables.
Outputs the reworked css file and an extra `variables.css`.

## Installation
Install with [npm](https://www.npmjs.com/)

```sh
$ npm i css-hex-to-vars-transformer --save
```

## Usage

Currently the tool is just meant to be run directly on cli.

Run this on your terminal:
```sh
> ./node_modules/.bin/css-hex-to-vars-transformer PATH_TO_YOUR_CSS_FILE
```

### Example Output
Output files will be inside `/dist-vars`.

example.css
```css
.aclass {
  background: #ffffff;
}

.bclass {
  background: #ffffff;
}

.cclass {
  background: #000000;
}

.dclass {
  color: #abcdef;
  background: #000000;
}

.eclass {
  background: #dddfff;
  color: #aaabbb;
}
```

After transformation you have following two files:

styles.css
```css
.aclass {
  background: var(colorvariable-0);
}

.bclass {
  background: var(colorvariable-0);
}

.cclass {
  background: var(colorvariable-1);
}

.dclass {
  color: var(colorvariable-2);
  background: var(colorvariable-1);
}

.eclass {
  background: var(colorvariable-3);
  color: var(colorvariable-4);
}
```

variables.css
```css
:root {
  --colorvariable-0: #ffffff;
  --colorvariable-1: #000000;
  --colorvariable-2: #abcdef;
  --colorvariable-3: #dddfff;
  --colorvariable-4: #aaabbb;
}
```

## Contributing

Pull requests are welcome!

## Author

**Thomas Fischer**

+ [github/ItsTommyGun](https://github.com/ItsTommyGun)