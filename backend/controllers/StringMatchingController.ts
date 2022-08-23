// @ts-nocheck

// Interfaces and Classess
import {StringMatchingStrategy} from './interfaces/StringMatchingStrategy'

// Strategy Design Pattern
export class StringMatchingController{
  private strategy: StringMatchingStrategy;
  constructor(strategy: StringMatchingStrategy){
    this.setStrategy(strategy);
  }
  public setStrategy(strategy: StringMatchingStrategy){
    this.strategy = strategy;
  }
  public getPercentageSimilarities(str1:string, str2:string){
    return this.strategy.getPercentageSimilarities(str1, str2);
  }
}
