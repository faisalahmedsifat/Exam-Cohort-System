export interface StringMatchingStrategy{
  getPercentageSimilarities(str1: string, str2: string);
}
