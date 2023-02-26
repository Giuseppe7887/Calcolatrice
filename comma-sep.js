
export function commaNumber(inputNumber, optionalSeparator, optionalDecimalChar) {

    const decimalChar = optionalDecimalChar || '.'
  
    let stringNumber 
  
    {
      let number 
  
      switch (typeof inputNumber) {
  
        case 'string':
  
          if (inputNumber.length < (inputNumber[0] === '-' ? 5 : 4)) {
            return inputNumber
          }
  
          stringNumber = inputNumber
  
          number = Number(
            (decimalChar !== '.') ? stringNumber.replace(decimalChar, '.') : stringNumber
          )
          break
  
        case 'number':
          stringNumber = String(inputNumber)
          number       = inputNumber
          if ('.' !== decimalChar && !Number.isInteger(inputNumber)) {
            stringNumber = stringNumber.replace('.', decimalChar)
          }
          break
  
        default: return inputNumber
      }
  
      if ((-1000 < number && number < 1000) || isNaN(number) || !isFinite(number)) {
        return stringNumber
      }
    }
  
    {
      const decimalIndex = stringNumber.lastIndexOf(decimalChar)
      let decimal
      if (decimalIndex > -1) {
        decimal = stringNumber.slice(decimalIndex)
        stringNumber = stringNumber.slice(0, decimalIndex)
      }
  
      const parts = parse(stringNumber, optionalSeparator || ',')
  
  
      if (decimal) {
        parts.push(decimal)
      }

      return parts.join('')
    }
  }
  
  function parse(string, separator) {
  
    let i = ((string.length - 1) % 3) + 1
  
    if (i === 1 && (string[0] === '-')) {
      i = 4 
    }
  
    const strings = [ 
      string.slice(0, i)
    ]
  
    for (; i < string.length; i += 3) {
      strings.push(separator, string.substr(i, 3))
    }
  
    return strings
  }
  

export  function bindWith(separator, decimalChar) {
    return function(number) {
      return commaNumber(number, separator, decimalChar)
    }
  }

  
  
