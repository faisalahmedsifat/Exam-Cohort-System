// @ts-nocheck

class ValidationHelper {

  // Check if string length is between a range
  static validateStringLength(stringObj, objName, minLengthInclusive, maxLengthInclusive,) {
    if (typeof stringObj !== 'string' || !(stringObj.length >= minLengthInclusive && stringObj.length <= maxLengthInclusive))
      throw new Error(`${objName} must be a string of length between between ${minLengthInclusive} and ${maxLengthInclusive}!`);
  }

  // Check if string length is between a range
  static validateObjectLength(obj, objName, minLengthInclusive, maxLengthInclusive, errorText=null) {
    if (typeof obj !== 'object' || !(obj.length >= minLengthInclusive && obj.length <= maxLengthInclusive)){
      if (errorText != null) {
        throw new Error(errorText)
      } else {
        throw new Error(`${objName} must be a object with length between ${minLengthInclusive} and ${maxLengthInclusive}!`);
      }
    }
  }

  static validateVariableValueNotEq(variable, targetValue, errorText) {
    if (!(variable !== targetValue))
      throw new Error(errorText);
  }

  static validateVariableValueEq(variable, targetValue, errorText) {
    if (!(variable === targetValue))
      throw new Error(errorText);
  }

  static validateNumber(number, objName, minInclusive, maxInclusive) {
    if (typeof number !== 'number' || !(number >= minInclusive && number <= maxInclusive))
      throw new Error(`${objName} must be a number between ${minInclusive} and ${maxInclusive}!`);
  }

  static validateEmailAddress(emailID, objName) {
    if (!emailID.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/))
      throw new Error(`${objName} must be a valid email address!`);
  } 

}
module.exports = ValidationHelper